use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Json,
};
use serde::Deserialize;

use crate::models::{
    ApiResponse, Idea, IdeaResponse,
};
use crate::app::AppState;

#[derive(Deserialize)]
pub struct IdeaQuery {
    pub category: Option<String>,
    pub chain: Option<String>,
    pub idea_type: Option<String>,
    pub page: Option<u32>,
    pub limit: Option<u32>,
}

pub async fn get_ideas(
    State(state): State<AppState>,
    Query(params): Query<IdeaQuery>,
) -> Result<Json<ApiResponse<Vec<IdeaResponse>>>, StatusCode> {
    let page = params.page.unwrap_or(1);
    let limit = params.limit.unwrap_or(20).min(100); // 最大100条
    let offset = (page - 1) * limit;

    let mut query = "SELECT id, name, description as icon, icon, bg_color, category, idea_type, chain, tags, messages, deployer, launch, creator_id, created_at, updated_at FROM ideas WHERE 1=1".to_string();
    let mut bind_params = Vec::new();

    if let Some(category) = &params.category {
        query.push_str(" AND category LIKE ?");
        bind_params.push(format!("%{}%", category));
    }

    if let Some(chain) = &params.chain {
        query.push_str(" AND chain = ?");
        bind_params.push(chain.clone());
    }

    if let Some(idea_type) = &params.idea_type {
        query.push_str(" AND idea_type LIKE ?");
        bind_params.push(format!("%{}%", idea_type));
    }

    query.push_str(" ORDER BY created_at DESC LIMIT ? OFFSET ?");
    bind_params.push(limit.to_string());
    bind_params.push(offset.to_string());

    let mut query_builder = sqlx::query_as::<_, Idea>(&query);
    for param in bind_params {
        query_builder = query_builder.bind(param);
    }

    let ideas = query_builder
        .fetch_all(&state.db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let responses: Vec<IdeaResponse> = ideas.into_iter().map(|idea| idea.into()).collect();

    Ok(Json(ApiResponse {
        success: true,
        data: Some(responses),
        message: None,
    }))
}

pub async fn get_idea_by_id(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<IdeaResponse>>, StatusCode> {
    let idea = sqlx::query_as::<_, Idea>(
        "SELECT id, name, description as icon, icon, bg_color, category, idea_type, chain, tags, messages, deployer, launch, creator_id, created_at, updated_at FROM ideas WHERE id = ?1"
    )
        .bind(id)
        .fetch_one(&state.db)
        .await
        .map_err(|_| StatusCode::NOT_FOUND)?;

    Ok(Json(ApiResponse {
        success: true,
        data: Some(idea.into()),
        message: None,
    }))
}

// All auth-required functions removed since auth module was deleted
