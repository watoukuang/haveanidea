use axum::{extract::{Path, State}, Json};
use sqlx::Row;

use crate::app::AppState;
use crate::models::{ApiResponse, Item, NewItem, UpdateItem};

pub async fn list(State(state): State<AppState>) -> Result<Json<ApiResponse<Vec<Item>>>, Json<ApiResponse<()>>> {
    let rows = sqlx::query_as::<_, Item>(
        r#"SELECT id, name, description, datetime(created_at) as created_at FROM t_items ORDER BY id DESC"#
    )
        .fetch_all(&state.pool)
        .await
        .map_err(|e| Json(ApiResponse::err(format!("db error: {}", e))))?;

    Ok(Json(ApiResponse::ok(rows)))
}

pub async fn get(State(state): State<AppState>, Path(id): Path<i64>) -> Result<Json<ApiResponse<Item>>, Json<ApiResponse<()>>> {
    let item = sqlx::query_as::<_, Item>(
        r#"SELECT id, name, description, datetime(created_at) as created_at FROM t_items WHERE id = ?"#
    )
        .bind(id)
        .fetch_one(&state.pool)
        .await
        .map_err(|_| Json(ApiResponse::err("not found")))?;

    Ok(Json(ApiResponse::ok(item)))
}

pub async fn create(State(state): State<AppState>, Json(payload): Json<NewItem>) -> Result<Json<ApiResponse<Item>>, Json<ApiResponse<()>>> {
    let rec = sqlx::query(
        r#"INSERT INTO t_items (name, description) VALUES (?, ?) RETURNING id, name, description, datetime(created_at) as created_at"#
    )
        .bind(&payload.name)
        .bind(&payload.description)
        .fetch_one(&state.pool)
        .await
        .map_err(|e| Json(ApiResponse::err(format!("db error: {}", e))))?;

    let item = Item {
        id: rec.get("id"),
        name: rec.get("name"),
        description: rec.get("description"),
        created_at: rec.get::<String, _>("created_at"),
    };

    Ok(Json(ApiResponse::ok(item)))
}

pub async fn update(State(state): State<AppState>, Path(id): Path<i64>, Json(payload): Json<UpdateItem>) -> Result<Json<ApiResponse<Item>>, Json<ApiResponse<()>>> {
    // Fetch existing
    let mut item = sqlx::query_as::<_, Item>(
        r#"SELECT id, name, description, datetime(created_at) as created_at FROM t_items WHERE id = ?"#
    )
        .bind(id)
        .fetch_one(&state.pool)
        .await
        .map_err(|_| Json(ApiResponse::err("not found")))?;

    let new_name = payload.name.unwrap_or(item.name.clone());
    let new_desc = payload.description.or(item.description.clone());

    sqlx::query(
        r#"UPDATE t_items SET name = ?, description = ? WHERE id = ?"#
    )
        .bind(&new_name)
        .bind(&new_desc)
        .bind(id)
        .execute(&state.pool)
        .await
        .map_err(|e| Json(ApiResponse::err(format!("db error: {}", e))))?;

    item.name = new_name;
    item.description = new_desc;

    Ok(Json(ApiResponse::ok(item)))
}

pub async fn delete(State(state): State<AppState>, Path(id): Path<i64>) -> Result<Json<ApiResponse<usize>>, Json<ApiResponse<()>>> {
    let result = sqlx::query(r#"DELETE FROM t_items WHERE id = ?"#)
        .bind(id)
        .execute(&state.pool)
        .await
        .map_err(|e| Json(ApiResponse::err(format!("db error: {}", e))))?;

    Ok(Json(ApiResponse::ok(result.rows_affected() as usize)))
}
