use axum::{routing::get, Router};
use axum::routing::post;
use crate::service::{items, cex, kol, twitter, health};
use crate::app::AppState;
use crate::service::binlog::{binlog_add_batch_handler, binlog_add_handler, binlog_list_handler};

pub fn build_router() -> Router<AppState> {
    Router::new()
        .merge(health_router())
        .merge(items_router())
        .merge(feeds_router())
        .merge(binlog_router())
}

fn health_router() -> Router<AppState> {
    Router::new().route("/health", get(health::health))
}

fn items_router() -> Router<AppState> {
    Router::new()
        .route("/items", get(items::list).post(items::create))
        .route("/items/:id", get(items::get).put(items::update).delete(items::delete))
}

fn feeds_router() -> Router<AppState> {
    Router::new()
        .route("/cexs", get(cex::list))
        .route("/kols", get(kol::list))
        .route("/twitters", get(twitter::list))
}

pub fn binlog_router() -> Router<AppState> {
    Router::new()
        .route("/binlog", get(binlog_list_handler))          // 查询
        .route("/binlog/add", post(binlog_add_handler))     // 添加单条
        .route("/binlog/add_batch", post(binlog_add_batch_handler)) // 添加多条
}