use axum::{extract::State, Json};
use axum::response::IntoResponse;
use sqlx::Row;
use crate::app::AppState;
use crate::models::{ApiResponse, KolItem};

pub async fn list(State(state): State<AppState>) -> impl IntoResponse {
    match get_kols_data(&state.pool).await {
        Ok(kol_items) => Json(ApiResponse::ok(kol_items)),
        Err(e) => Json(ApiResponse::err(format!("Database error: {}", e))),
    }
}

async fn get_kols_data(pool: &sqlx::SqlitePool) -> Result<Vec<KolItem>, sqlx::Error> {
    let kol_rows = sqlx::query("SELECT id, name, avatar, description, url, platform FROM t_kol ORDER BY id")
        .fetch_all(pool)
        .await?;

    let kol_items: Vec<KolItem> = kol_rows
        .into_iter()
        .map(|row| KolItem {
            id: row.get("id"),
            name: row.get("name"),
            avatar: row.get("avatar"),
            description: row.get("description"),
            url: row.get("url"),
            platform: row.get("platform"),
        })
        .collect();

    Ok(kol_items)
}
