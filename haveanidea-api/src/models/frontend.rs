use serde::{Deserialize, Serialize};

// Frontend-aligned models matching watoukuang-ui/types.ts

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CexItemMsg {
    pub title: String,
    pub created: i64, // epoch seconds
    pub href: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CexItem {
    pub id: i64,
    pub name: String,
    pub icon: String,
    pub bg_color: String,
    pub messages: Vec<CexItemMsg>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct KolItem {
    pub id: i64,
    pub name: String,
    pub avatar: String,
    pub description: String,
    pub url: String,
    pub platform: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TwitterItem {
    pub id: i64,
    pub name: String,
    pub icon: String,
    pub bg_color: String,
    pub messages: String,
    pub created: i64, // epoch seconds
}
