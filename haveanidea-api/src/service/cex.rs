use axum::{extract::State, Json};
use axum::response::IntoResponse;
use sqlx::Row;
use crate::app::AppState;
use crate::models::{ApiResponse, CexItem};

pub async fn list(State(state): State<AppState>) -> impl IntoResponse {
    match get_cexs_data(&state.pool).await {
        Ok(cex_items) => Json(ApiResponse::ok(cex_items)),
        Err(e) => Json(ApiResponse::err(format!("Database error: {}", e))),
    }
}

async fn get_cexs_data(pool: &sqlx::SqlitePool) -> Result<Vec<CexItem>, sqlx::Error> {
    // 从 t_cex 表获取所有CEX基本信息
    let cex_rows = sqlx::query("SELECT id, name, icon, bg_color FROM t_cex ORDER BY id")
        .fetch_all(pool)
        .await?;

    let mut cex_items = Vec::new();

    for row in cex_rows {
        let cex_id: i64 = row.get("id");
        let cex_name: String = row.get("name");
        let cex_icon: Option<String> = row.get("icon");
        let cex_bg_color: Option<String> = row.get("bg_color");

        // 查询消息记录
        let msg_rows = sqlx::query("SELECT title, created, href FROM t_cex_msg WHERE cex_id = ? ORDER BY created DESC")
            .bind(cex_id)
            .fetch_all(pool)
            .await?;

        // 构造消息列表
        let messages: Vec<crate::models::CexItemMsg> = msg_rows
            .into_iter()
            .map(|msg_row| crate::models::CexItemMsg {
                title: msg_row.get("title"),
                created: msg_row.get("created"),
                href: msg_row.get("href"),
            })
            .collect();

        // 构造CexItem对象
        let cex_item = CexItem {
            id: cex_id,
            name: cex_name,
            icon: cex_icon.unwrap_or_default(),
            bg_color: cex_bg_color.unwrap_or_default(),
            messages,
        };

        cex_items.push(cex_item);
    }

    Ok(cex_items)
}
