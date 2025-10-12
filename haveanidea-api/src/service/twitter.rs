use axum::{extract::State, Json};
use axum::response::IntoResponse;
use sqlx::Row;
use crate::app::AppState;
use crate::models::{ApiResponse, TwitterItem};

pub async fn list(State(state): State<AppState>) -> impl IntoResponse {
    match get_twitters_data(&state.pool).await {
        Ok(twitter_items) => Json(ApiResponse::ok(twitter_items)),
        Err(e) => Json(ApiResponse::err(format!("Database error: {}", e))),
    }
}

async fn get_twitters_data(pool: &sqlx::SqlitePool) -> Result<Vec<TwitterItem>, sqlx::Error> {
    let twitter_rows = sqlx::query("SELECT id, name, icon, bg_color, messages, created FROM t_twitter ORDER BY id")
        .fetch_all(pool)
        .await?;

    let twitter_items: Vec<TwitterItem> = twitter_rows
        .into_iter()
        .map(|row| TwitterItem {
            id: row.get("id"),
            name: row.get("name"),
            icon: row.get("icon"),
            bg_color: row.get("bg_color"),
            messages: row.get("messages"),
            created: row.get("created"),
        })
        .collect();

    Ok(twitter_items)
}
