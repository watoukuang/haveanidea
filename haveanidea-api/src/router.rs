use crate::app::AppState;
use crate::service::{health, ideas};
use axum::routing::{get, post};
use axum::Router;


pub fn build_router() -> Router<AppState> {
    Router::new()
        .merge(health_router())
        .merge(ideas_router())
}

fn health_router() -> Router<AppState> {
    Router::new().route("/health", get(health::health))
}

fn ideas_router() -> Router<AppState> {
    Router::new()
        .route("/ideas", get(ideas::get_ideas))
        .route("/ideas/:id", get(ideas::get_idea_by_id))
        .route("/api/launch", post(ideas::launch))
        
}

