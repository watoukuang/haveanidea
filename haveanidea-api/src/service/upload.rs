use axum::{
    extract::{Multipart, Request, State},
    http::StatusCode,
    Json,
};
use aliyun_oss_client::{Client, ClientBuilder};
use bytes::Bytes;
use std::env;
use uuid::Uuid;

use crate::models::ApiResponse;
use crate::app::AppState;
use crate::service::auth::get_current_user;

#[derive(serde::Serialize)]
pub struct UploadResponse {
    pub url: String,
    pub filename: String,
}

pub async fn upload_file(
    State(state): State<AppState>,
    request: Request,
    mut multipart: Multipart,
) -> Result<Json<ApiResponse<UploadResponse>>, StatusCode> {
    let claims = get_current_user(&request).ok_or(StatusCode::UNAUTHORIZED)?;

    // 获取用户ID
    let user = sqlx::query!("SELECT id FROM users WHERE wallet_address = ?1", claims.sub)
        .fetch_one(&state.db)
        .await
        .map_err(|_| StatusCode::UNAUTHORIZED)?;

    while let Some(field) = multipart.next_field().await.unwrap() {
        let name = field.name().unwrap_or("file");
        if name != "file" {
            continue;
        }

        let filename = field.file_name().unwrap_or("unknown").to_string();
        let content_type = field.content_type().unwrap_or("application/octet-stream").to_string();
        let data = field.bytes().await.unwrap();

        // 验证文件类型
        if !is_allowed_file_type(&content_type) {
            return Err(StatusCode::BAD_REQUEST);
        }

        // 验证文件大小 (10MB)
        if data.len() > 10 * 1024 * 1024 {
            return Err(StatusCode::PAYLOAD_TOO_LARGE);
        }

        // 生成唯一文件名
        let extension = get_file_extension(&filename);
        let unique_filename = format!("{}{}", Uuid::new_v4(), extension);
        let object_key = format!("uploads/{}", unique_filename);

        // 上传到阿里云 OSS
        let oss_url = match upload_to_oss(&object_key, data, &content_type).await {
            Ok(url) => url,
            Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
        };

        // 保存到数据库
        sqlx::query!(
            "INSERT INTO uploads (filename, original_name, mime_type, file_size, oss_url, uploader_id) 
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            unique_filename,
            filename,
            content_type,
            data.len() as i64,
            oss_url,
            user.id
        )
        .execute(&state.db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        let response = UploadResponse {
            url: oss_url.clone(),
            filename: unique_filename,
        };

        return Ok(Json(ApiResponse {
            success: true,
            data: Some(response),
            message: Some("File uploaded successfully".to_string()),
            error: None,
        }));
    }

    Err(StatusCode::BAD_REQUEST)
}

async fn upload_to_oss(
    object_key: &str,
    data: Bytes,
    content_type: &str,
) -> Result<String, Box<dyn std::error::Error>> {
    let region = env::var("OSS_REGION").unwrap_or_else(|_| "oss-cn-hangzhou".to_string());
    let access_key_id = env::var("OSS_ACCESS_KEY_ID")?;
    let access_key_secret = env::var("OSS_ACCESS_KEY_SECRET")?;
    let bucket = env::var("OSS_BUCKET")?;
    let endpoint = env::var("OSS_ENDPOINT")?;

    let client = ClientBuilder::new()
        .access_key_id(access_key_id)
        .access_key_secret(access_key_secret)
        .region(region)
        .endpoint(endpoint.clone())
        .build()?;

    // 上传文件
    client
        .put_object()
        .bucket(&bucket)
        .key(object_key)
        .body(data)
        .content_type(content_type)
        .send()
        .await?;

    // 返回公共访问URL
    let url = format!("https://{}.{}/{}", bucket, endpoint.replace("https://", ""), object_key);
    Ok(url)
}

fn is_allowed_file_type(content_type: &str) -> bool {
    let allowed_types = [
        "image/jpeg",
        "image/png", 
        "image/gif",
        "image/webp",
        "image/svg+xml",
    ];
    allowed_types.contains(&content_type)
}

fn get_file_extension(filename: &str) -> String {
    std::path::Path::new(filename)
        .extension()
        .and_then(|ext| ext.to_str())
        .map(|ext| format!(".{}", ext))
        .unwrap_or_default()
}
