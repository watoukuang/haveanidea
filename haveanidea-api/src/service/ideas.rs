use axum::{
    extract::{Path, Query, Request, State},
    http::StatusCode,
    Json,
};
use serde::Deserialize;
use serde_json::json;
use std::collections::HashMap;

use crate::models::{
    ApiResponse, AuthClaims, CreateIdea, Idea, IdeaMessage, IdeaResponse, 
    LaunchContacts, LaunchParams, UpdateIdea, UpdateLaunchParams
};
use crate::app::AppState;
use crate::service::auth::get_current_user;

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
        error: None,
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
        error: None,
    }))
}

pub async fn create_idea(
    State(state): State<AppState>,
    request: Request,
    Json(payload): Json<CreateIdea>,
) -> Result<Json<ApiResponse<IdeaResponse>>, StatusCode> {
    let claims = get_current_user(&request).ok_or(StatusCode::UNAUTHORIZED)?;

    // 获取用户ID
    let user = sqlx::query!("SELECT id FROM users WHERE wallet_address = ?1", claims.sub)
        .fetch_one(&state.db)
        .await
        .map_err(|_| StatusCode::UNAUTHORIZED)?;

    // 创建初始消息
    let initial_message = IdeaMessage {
        title: payload.description.clone(),
        created: chrono::Utc::now().timestamp(),
        href: "#".to_string(),
    };
    let messages_json = serde_json::to_string(&vec![initial_message])
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let result = sqlx::query!(
        "INSERT INTO ideas (name, description, icon, bg_color, category, idea_type, chain, tags, messages, creator_id, deployer) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)",
        payload.name,
        payload.description,
        payload.icon,
        payload.bg_color,
        payload.category,
        payload.idea_type,
        payload.chain,
        payload.tags,
        messages_json,
        user.id,
        claims.sub
    )
    .execute(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    // 获取创建的想法
    let idea = sqlx::query_as::<_, Idea>(
        "SELECT id, name, description as icon, icon, bg_color, category, idea_type, chain, tags, messages, deployer, launch, creator_id, created_at, updated_at FROM ideas WHERE id = ?1"
    )
    .bind(result.last_insert_rowid())
    .fetch_one(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(ApiResponse {
        success: true,
        data: Some(idea.into()),
        message: Some("Idea created successfully".to_string()),
        error: None,
    }))
}

pub async fn update_idea(
    State(state): State<AppState>,
    Path(id): Path<i64>,
    request: Request,
    Json(payload): Json<UpdateIdea>,
) -> Result<Json<ApiResponse<IdeaResponse>>, StatusCode> {
    let claims = get_current_user(&request).ok_or(StatusCode::UNAUTHORIZED)?;

    // 检查权限
    let idea = sqlx::query!("SELECT creator_id, deployer FROM ideas WHERE id = ?1", id)
        .fetch_one(&state.db)
        .await
        .map_err(|_| StatusCode::NOT_FOUND)?;

    let user = sqlx::query!("SELECT id FROM users WHERE wallet_address = ?1", claims.sub)
        .fetch_one(&state.db)
        .await
        .map_err(|_| StatusCode::UNAUTHORIZED)?;

    if user.id != idea.creator_id && Some(claims.sub.clone()) != idea.deployer {
        return Err(StatusCode::FORBIDDEN);
    }

    // 构建更新查询
    let mut updates = Vec::new();
    let mut params = Vec::new();

    if let Some(name) = &payload.name {
        updates.push("name = ?");
        params.push(name.clone());
    }
    if let Some(description) = &payload.description {
        updates.push("description = ?");
        params.push(description.clone());
    }
    if let Some(icon) = &payload.icon {
        updates.push("icon = ?");
        params.push(icon.clone());
    }
    if let Some(bg_color) = &payload.bg_color {
        updates.push("bg_color = ?");
        params.push(bg_color.clone());
    }
    if let Some(category) = &payload.category {
        updates.push("category = ?");
        params.push(category.clone());
    }
    if let Some(idea_type) = &payload.idea_type {
        updates.push("idea_type = ?");
        params.push(idea_type.clone());
    }
    if let Some(chain) = &payload.chain {
        updates.push("chain = ?");
        params.push(chain.clone());
    }

    if updates.is_empty() {
        return Err(StatusCode::BAD_REQUEST);
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    let query = format!("UPDATE ideas SET {} WHERE id = ?", updates.join(", "));
    params.push(id.to_string());

    let mut query_builder = sqlx::query(&query);
    for param in params {
        query_builder = query_builder.bind(param);
    }

    query_builder
        .execute(&state.db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    // 返回更新后的想法
    let updated_idea = sqlx::query_as::<_, Idea>(
        "SELECT id, name, description as icon, icon, bg_color, category, idea_type, chain, tags, messages, deployer, launch, creator_id, created_at, updated_at FROM ideas WHERE id = ?1"
    )
    .bind(id)
    .fetch_one(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(ApiResponse {
        success: true,
        data: Some(updated_idea.into()),
        message: Some("Idea updated successfully".to_string()),
        error: None,
    }))
}

pub async fn update_launch_params(
    State(state): State<AppState>,
    Path(id): Path<i64>,
    request: Request,
    Json(payload): Json<UpdateLaunchParams>,
) -> Result<Json<ApiResponse<()>>, StatusCode> {
    let claims = get_current_user(&request).ok_or(StatusCode::UNAUTHORIZED)?;

    // 检查权限 - 只有部署者可以更新启动参数
    let idea = sqlx::query!("SELECT deployer FROM ideas WHERE id = ?1", id)
        .fetch_one(&state.db)
        .await
        .map_err(|_| StatusCode::NOT_FOUND)?;

    if Some(claims.sub.clone()) != idea.deployer {
        return Err(StatusCode::FORBIDDEN);
    }

    // 构建启动参数
    let launch_params = LaunchParams {
        price_eth: payload.price_eth,
        funding_goal_eth: payload.funding_goal_eth,
        revenue_share_pct: payload.revenue_share_pct,
        contacts: Some(LaunchContacts {
            twitter: payload.twitter,
            discord: payload.discord,
            telegram: payload.telegram,
        }),
    };

    let launch_json = serde_json::to_string(&launch_params)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    sqlx::query!(
        "UPDATE ideas SET launch = ?1, updated_at = CURRENT_TIMESTAMP WHERE id = ?2",
        launch_json,
        id
    )
    .execute(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(ApiResponse {
        success: true,
        data: Some(()),
        message: Some("Launch parameters updated successfully".to_string()),
        error: None,
    }))
}

pub async fn delete_idea(
    State(state): State<AppState>,
    Path(id): Path<i64>,
    request: Request,
) -> Result<Json<ApiResponse<()>>, StatusCode> {
    let claims = get_current_user(&request).ok_or(StatusCode::UNAUTHORIZED)?;

    // 检查权限
    let idea = sqlx::query!("SELECT creator_id FROM ideas WHERE id = ?1", id)
        .fetch_one(&state.db)
        .await
        .map_err(|_| StatusCode::NOT_FOUND)?;

    let user = sqlx::query!("SELECT id FROM users WHERE wallet_address = ?1", claims.sub)
        .fetch_one(&state.db)
        .await
        .map_err(|_| StatusCode::UNAUTHORIZED)?;

    if user.id != idea.creator_id {
        return Err(StatusCode::FORBIDDEN);
    }

    sqlx::query!("DELETE FROM ideas WHERE id = ?1", id)
        .execute(&state.db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(ApiResponse {
        success: true,
        data: Some(()),
        message: Some("Idea deleted successfully".to_string()),
        error: None,
    }))
}
