use axum::{
    extract::{State, Query},
    response::IntoResponse,
    Json,
};
use serde::Deserialize;
use sqlx::SqlitePool;

use crate::app::AppState;
use crate::models::{ApiResponse, BinlogAfter};

#[derive(Debug, Deserialize)]
pub struct PageParams {
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

// GET /binlog?limit=50&offset=0
pub async fn binlog_list_handler(
    State(state): State<AppState>,
    Query(params): Query<PageParams>,
) -> impl IntoResponse {
    let limit = params.limit.unwrap_or(50);
    let offset = params.offset.unwrap_or(0);

    match fetch_binlog_after(&state.pool, limit, offset).await {
        Ok(items) => Json(ApiResponse::ok(items)),
        Err(e) => Json(ApiResponse::err(format!("Database error: {}", e))),
    }
}

async fn fetch_binlog_after(
    pool: &SqlitePool,
    limit: i64,
    offset: i64,
) -> Result<Vec<BinlogAfter>, sqlx::Error> {
    let rows = sqlx::query_as::<_, BinlogAfter>(
        r#"
        SELECT id, plt, name, img, account, social, remark, created, updated, yn, state
        FROM t_binlog
        ORDER BY id DESC
        LIMIT ?1 OFFSET ?2
        "#,
    )
        .bind(limit)
        .bind(offset)
        .fetch_all(pool)
        .await?;

    Ok(rows)
}

// POST /binlog/add
pub async fn binlog_add_handler(
    State(state): State<AppState>,
    Json(after): Json<BinlogAfter>,
) -> impl IntoResponse {
    match save_binlog_after(&state.pool, &after).await {
        Ok(_) => Json(ApiResponse::ok("after inserted")),
        Err(e) => Json(ApiResponse::err(format!("Database error: {}", e))),
    }
}

async fn save_binlog_after(pool: &SqlitePool, after: &BinlogAfter) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        INSERT INTO t_binlog (
            id, plt, name, img, account, social, remark, created, updated, yn, state
        )
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)
        "#,
    )
        .bind(after.id)
        .bind(&after.plt)
        .bind(&after.name)
        .bind(&after.img)
        .bind(&after.account)
        .bind(&after.social)
        .bind(&after.remark)
        .bind(after.created)
        .bind(after.updated)
        .bind(after.yn)
        .bind(after.state)
        .execute(pool)
        .await?;
    Ok(())
}

// POST /binlog/add_batch
pub async fn binlog_add_batch_handler(
    State(state): State<AppState>,
    Json(afters): Json<Vec<BinlogAfter>>,
) -> impl IntoResponse {
    match save_binlog_after_batch(&state.pool, &afters).await {
        Ok(_) => Json(ApiResponse::ok(format!("{} after records inserted", afters.len()))),
        Err(e) => Json(ApiResponse::err(format!("Database error: {}", e))),
    }
}

async fn save_binlog_after_batch(
    pool: &SqlitePool,
    afters: &[BinlogAfter],
) -> Result<(), sqlx::Error> {
    let mut tx = pool.begin().await?;
    for after in afters {
        sqlx::query(
            r#"
            INSERT INTO t_binlog (
                id, plt, name, img, account, social, remark, created, updated, yn, state
            )
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)
            "#,
        )
            .bind(after.id)
            .bind(&after.plt)
            .bind(&after.name)
            .bind(&after.img)
            .bind(&after.account)
            .bind(&after.social)
            .bind(&after.remark)
            .bind(after.created)
            .bind(after.updated)
            .bind(after.yn)
            .bind(after.state)
            .execute(&mut *tx)
            .await?;
    }
    tx.commit().await?;
    Ok(())
}
