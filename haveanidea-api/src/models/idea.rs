use serde::{Deserialize, Serialize};
use sqlx::FromRow;


#[derive(Debug, Serialize, Deserialize, Clone, FromRow)]
pub struct Idea {
    pub id: i64,
    pub title: String,
    pub description: String,
    pub icon_hash: String,
    pub tags: Option<String>,
    pub chain: Option<String>,
    pub deployer: Option<String>,
    pub created: Option<String>,
    pub crowdfunding_mode: Option<String>,
}
