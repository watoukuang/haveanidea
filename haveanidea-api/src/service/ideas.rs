use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Json,
};
use serde::{Deserialize, Serialize};

use crate::app::AppState;
use crate::models::{
    ApiResponse, Idea,
};

#[derive(Deserialize)]
pub struct IdeaQuery {
    pub category: Option<String>,
    pub chain: Option<String>,
    pub idea_type: Option<String>,
    pub page: Option<u32>,
    pub limit: Option<u32>,
}

pub async fn page_ideas(
    State(state): State<AppState>,
    Query(params): Query<IdeaQuery>,
) -> Result<Json<ApiResponse<Vec<Idea>>>, StatusCode> {
    let page = params.page.unwrap_or(1);
    let limit = params.limit.unwrap_or(20).min(100); // 最大100条
    let offset = (page - 1) * limit;

    let mut query = "SELECT \
            id, \
            name AS title, \
            description, \
            icon AS icon_hash, \
            tags, \
            chain, \
            deployer, \
            strftime('%s', created_at) AS created, \
            idea_type AS crowdfunding_mode \
        FROM ideas WHERE 1=1".to_string();
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

    let ideas: Vec<Idea> = query_builder
        .fetch_all(&state.db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(ApiResponse {
        success: true,
        data: Some(ideas),
        message: None,
    }))
}

pub async fn get_idea_by_id(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<Idea>>, StatusCode> {
    let idea: Idea = sqlx::query_as::<_, Idea>(
        "SELECT \
            id, \
            name AS title, \
            description, \
            icon AS icon_hash, \
            tags, \
            chain, \
            deployer, \
            strftime('%s', created_at) AS created, \
            idea_type AS crowdfunding_mode \
        FROM ideas WHERE id = ?1"
    )
        .bind(id)
        .fetch_one(&state.db)
        .await
        .map_err(|_| StatusCode::NOT_FOUND)?;

    Ok(Json(ApiResponse {
        success: true,
        data: Some(idea),
        message: None,
    }))
}

// All auth-required functions removed since auth module was deleted

#[derive(Debug, Deserialize, Serialize)]
pub struct LaunchRequest {
    pub title: String,
    pub description: String,
    #[serde(rename = "iconHash")]
    pub icon_hash: String,
    pub tags: Option<Vec<String>>,
    pub timestamp: i64,
    #[serde(rename = "crowdfundingMode")]
    pub crowdfunding_mode: Option<String>,
    pub chain: Option<String>,
    pub deployer: Option<String>,
}

pub async fn launch(
    State(state): State<AppState>,
    Json(req): Json<LaunchRequest>,
) -> Result<Json<ApiResponse<()>>, StatusCode> {
    let tags_json: Option<String> = req.tags.map(|t| serde_json::to_string(&t).unwrap_or_else(|_| "[]".to_string()));

    let idea_type = req.crowdfunding_mode.clone();
    sqlx::query(r#"
        INSERT INTO ideas (title, description, icon, idea_type, tags, chain, deployer)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)"#,
    ).bind(&req.title)
        .bind(&req.description)
        .bind(&req.icon_hash)
        .bind(&idea_type)
        .bind(&tags_json)
        .bind(&req.chain)
        .bind(&req.deployer)
        .execute(&state.db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(ApiResponse {
        success: true,
        data: None,
        message: Some("Idea submitted successfully".to_string()),
    }))
}
