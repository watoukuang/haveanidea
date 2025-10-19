use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use chrono::{DateTime, Utc};
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, Clone, FromRow)]
pub struct User {
    pub id: i64,
    pub wallet_address: String,
    pub email: Option<String>,
    pub username: Option<String>,
    pub avatar_url: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct CreateUser {
    #[validate(length(min = 42, max = 42))]
    pub wallet_address: String,
    #[validate(email)]
    pub email: Option<String>,
    #[validate(length(min = 1, max = 50))]
    pub username: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct IdeaMessage {
    pub title: String,
    pub created: i64,
    pub href: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LaunchParams {
    #[serde(rename = "priceEth")]
    pub price_eth: Option<f64>,
    #[serde(rename = "fundingGoalEth")]
    pub funding_goal_eth: Option<f64>,
    #[serde(rename = "revenueSharePct")]
    pub revenue_share_pct: Option<i32>,
    pub contacts: Option<LaunchContacts>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LaunchContacts {
    pub twitter: Option<String>,
    pub discord: Option<String>,
    pub telegram: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone, FromRow)]
pub struct Idea {
    pub id: i64,
    #[serde(rename = "type")]
    pub idea_type: Option<String>,
    pub name: String,
    pub icon: String,
    pub bg_color: Option<String>,
    pub messages: String, // JSON string of Vec<IdeaMessage>
    pub category: Option<String>,
    pub chain: Option<String>,
    pub deployer: Option<String>,
    pub launch: Option<String>, // JSON string of LaunchParams
    pub creator_id: i64,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct CreateIdea {
    #[validate(length(min = 1, max = 200))]
    pub name: String,
    #[validate(length(min = 1, max = 2000))]
    pub description: String,
    pub icon: String,
    pub bg_color: Option<String>,
    pub category: Option<String>,
    #[serde(rename = "type")]
    pub idea_type: Option<String>,
    pub chain: Option<String>,
    pub tags: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct UpdateIdea {
    #[validate(length(min = 1, max = 200))]
    pub name: Option<String>,
    #[validate(length(min = 1, max = 2000))]
    pub description: Option<String>,
    pub icon: Option<String>,
    pub bg_color: Option<String>,
    pub category: Option<String>,
    #[serde(rename = "type")]
    pub idea_type: Option<String>,
    pub chain: Option<String>,
    pub tags: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct UpdateLaunchParams {
    pub price_eth: Option<f64>,
    pub funding_goal_eth: Option<f64>,
    pub revenue_share_pct: Option<i32>,
    pub twitter: Option<String>,
    pub discord: Option<String>,
    pub telegram: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct IdeaResponse {
    pub id: i64,
    #[serde(rename = "type")]
    pub idea_type: Option<String>,
    pub name: String,
    pub icon: String,
    pub bg_color: Option<String>,
    pub messages: Vec<IdeaMessage>,
    pub category: Option<String>,
    pub chain: Option<String>,
    pub deployer: Option<String>,
    pub launch: Option<LaunchParams>,
}

impl From<Idea> for IdeaResponse {
    fn from(idea: Idea) -> Self {
        let messages: Vec<IdeaMessage> = serde_json::from_str(&idea.messages).unwrap_or_default();
        let launch: Option<LaunchParams> = idea.launch
            .and_then(|l| serde_json::from_str(&l).ok());

        Self {
            id: idea.id,
            idea_type: idea.idea_type,
            name: idea.name,
            icon: idea.icon,
            bg_color: idea.bg_color,
            messages,
            category: idea.category,
            chain: idea.chain,
            deployer: idea.deployer,
            launch,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AuthClaims {
    pub sub: String, // wallet_address
    pub exp: usize,
    pub iat: usize,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthRequest {
    pub wallet_address: String,
    pub signature: String,
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: User,
}
