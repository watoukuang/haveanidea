use axum::Json;
use crate::models::ApiResponse;

pub async fn health() -> Json<ApiResponse<&'static str>> {
    Json(ApiResponse { success: true, data: Some("ok"), message: None })
}
