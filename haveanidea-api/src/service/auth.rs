use axum::{
    extract::{Request, State},
    http::{HeaderMap, StatusCode},
    middleware::Next,
    response::Response,
    Json,
};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde_json::json;
use std::time::{SystemTime, UNIX_EPOCH};

use crate::models::{AuthClaims, AuthRequest, AuthResponse, User, CreateUser, ApiResponse};
use crate::app::AppState;

const JWT_SECRET: &str = "your-secret-key"; // 应该从环境变量读取

pub async fn login(
    State(state): State<AppState>,
    Json(payload): Json<AuthRequest>,
) -> Result<Json<ApiResponse<AuthResponse>>, StatusCode> {
    // 简化版本：直接验证钱包地址格式
    if payload.wallet_address.len() != 42 || !payload.wallet_address.starts_with("0x") {
        return Err(StatusCode::BAD_REQUEST);
    }

    // 查找或创建用户
    let user = match get_or_create_user(&state, &payload.wallet_address).await {
        Ok(user) => user,
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    // 生成 JWT token
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs() as usize;

    let claims = AuthClaims {
        sub: payload.wallet_address.clone(),
        exp: now + 24 * 60 * 60, // 24小时过期
        iat: now,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(JWT_SECRET.as_ref()),
    ).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let response = AuthResponse { token, user };

    Ok(Json(ApiResponse {
        success: true,
        data: Some(response),
        message: Some("Login successful".to_string()),
        error: None,
    }))
}

async fn get_or_create_user(state: &AppState, wallet_address: &str) -> Result<User, sqlx::Error> {
    // 先尝试查找用户
    if let Ok(user) = sqlx::query_as::<_, User>(
        "SELECT id, wallet_address, email, username, avatar_url, created_at, updated_at FROM users WHERE wallet_address = ?1"
    )
    .bind(wallet_address)
    .fetch_one(&state.db)
    .await
    {
        return Ok(user);
    }

    // 用户不存在，创建新用户
    let result = sqlx::query(
        "INSERT INTO users (wallet_address) VALUES (?1)"
    )
    .bind(wallet_address)
    .execute(&state.db)
    .await?;

    // 获取新创建的用户
    sqlx::query_as::<_, User>(
        "SELECT id, wallet_address, email, username, avatar_url, created_at, updated_at FROM users WHERE id = ?1"
    )
    .bind(result.last_insert_rowid())
    .fetch_one(&state.db)
    .await
}

pub async fn auth_middleware(
    headers: HeaderMap,
    mut request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let auth_header = headers
        .get("authorization")
        .and_then(|header| header.to_str().ok())
        .and_then(|header| header.strip_prefix("Bearer "));

    let token = match auth_header {
        Some(token) => token,
        None => return Err(StatusCode::UNAUTHORIZED),
    };

    let claims = decode::<AuthClaims>(
        token,
        &DecodingKey::from_secret(JWT_SECRET.as_ref()),
        &Validation::default(),
    )
    .map_err(|_| StatusCode::UNAUTHORIZED)?;

    // 将用户信息添加到请求扩展中
    request.extensions_mut().insert(claims.claims);

    Ok(next.run(request).await)
}

pub fn get_current_user(request: &Request) -> Option<&AuthClaims> {
    request.extensions().get::<AuthClaims>()
}

pub async fn get_user_profile(
    State(state): State<AppState>,
    headers: HeaderMap,
) -> Result<Json<ApiResponse<User>>, StatusCode> {
    let auth_header = headers
        .get("authorization")
        .and_then(|header| header.to_str().ok())
        .and_then(|header| header.strip_prefix("Bearer "));

    let token = match auth_header {
        Some(token) => token,
        None => return Err(StatusCode::UNAUTHORIZED),
    };

    let claims = decode::<AuthClaims>(
        token,
        &DecodingKey::from_secret(JWT_SECRET.as_ref()),
        &Validation::default(),
    )
    .map_err(|_| StatusCode::UNAUTHORIZED)?;

    let user = sqlx::query_as::<_, User>(
        "SELECT id, wallet_address, email, username, avatar_url, created_at, updated_at FROM users WHERE wallet_address = ?1"
    )
    .bind(&claims.claims.sub)
    .fetch_one(&state.db)
    .await
    .map_err(|_| StatusCode::NOT_FOUND)?;

    Ok(Json(ApiResponse {
        success: true,
        data: Some(user),
        message: None,
        error: None,
    }))
}
