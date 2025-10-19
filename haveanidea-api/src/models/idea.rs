use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use chrono::{DateTime, Utc};
use validator::Validate;


#[derive(Debug, Serialize, Deserialize, Clone, FromRow)]
pub struct Idea {
    pub id: i64,
    #[serde(rename = "type")]
    pub title: Option<String>,
    pub description: String,
    pub icon: String,
    pub bg_color: Option<String>,
    pub messages: String, // JSON string of Vec<IdeaMessage>
    pub category: Option<String>,
    pub chain: Option<String>,
    pub deployer: Option<String>,
    pub launch: Option<String>, // JSON string of LaunchParams
    pub creator_id: Option<i64>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
