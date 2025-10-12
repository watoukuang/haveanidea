use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Deserialize, Serialize, FromRow)]
pub struct BinlogAfter {
    pub id: i64,
    pub plt: String,
    pub name: String,
    pub img: Option<String>,
    pub account: String,
    pub social: String,
    pub remark: Option<String>,
    pub created: i64,
    pub updated: i64,
    pub yn: i32,
    pub state: i32,
}
