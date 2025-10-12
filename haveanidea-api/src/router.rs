use axum::{routing::get, Router, middleware};
use axum::routing::{post, put, delete};
use crate::service::{items, cex, kol, twitter, health, auth, ideas, upload};
use crate::app::AppState;
use crate::service::binlog::{binlog_add_batch_handler, binlog_add_handler, binlog_list_handler};

pub fn build_router() -> Router<AppState> {
    Router::new()
        .merge(health_router())
        .merge(auth_router())
        .merge(ideas_router())
        .merge(upload_router())
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

fn auth_router() -> Router<AppState> {
    Router::new()
        .route("/auth/login", post(auth::login))
        .route("/auth/profile", get(auth::get_user_profile))
}

fn ideas_router() -> Router<AppState> {
    Router::new()
        .route("/ideas", get(ideas::get_ideas).post(ideas::create_idea))
        .route("/ideas/:id", get(ideas::get_idea_by_id).put(ideas::update_idea).delete(ideas::delete_idea))
        .route("/ideas/:id/launch", put(ideas::update_launch_params))
        .layer(middleware::from_fn(auth::auth_middleware))
}

fn upload_router() -> Router<AppState> {
    Router::new()
        .route("/upload", post(upload::upload_file))
        .layer(middleware::from_fn(auth::auth_middleware))
}

pub fn binlog_router() -> Router<AppState> {
    Router::new()
        .route("/binlog", get(binlog_list_handler))          // 查询
        .route("/binlog/add", post(binlog_add_handler))     // 添加单条
        .route("/binlog/add_batch", post(binlog_add_batch_handler)) // 添加多条
}