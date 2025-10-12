use std::net::SocketAddr;

use crate::db;
use axum::Router;
use dotenvy::dotenv;
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::SqlitePool;
use tracing::{error, info};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

#[derive(Clone)]
pub struct AppState {
    pub pool: SqlitePool,
}

pub async fn init() -> anyhow::Result<(AppState, SocketAddr)> {
    // 加载环境变量（.env.example）
    dotenv().ok();

    // 初始化日志与追踪（tracing）
    tracing_subscriber::registry()
        .with(EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()))
        .with(tracing_subscriber::fmt::layer())
        .init();

    // 读取基础配置（数据库地址、端口）
    // 本地开发
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "sqlite://watoukuang.db?mode=rw".to_string());
    // 服务器
    // let database_url = std::env::var("DATABASE_URL")
    //     .unwrap_or_else(|_| "sqlite:///app/data/watoukuang.db?mode=rw".to_string());
    let port: u16 = std::env::var("PORT")
        .ok()
        .and_then(|s| s.parse().ok())
        .unwrap_or(8181);

    // 建立数据库连接池
    let pool: SqlitePool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;

    // 执行数据库迁移
    db::migrate(&pool).await?;

    let state = AppState { pool };
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    info!("initialized with addr=http://{}", addr);
    Ok((state, addr))
}

// 构建应用路由（类型为 Router<AppState>，尚未挂载具体 State 实例）
pub fn new() -> Router<AppState> {
    let router = crate::router::build_router();
    crate::bootstrap::configure_router(router)
}

// 启动 HTTP 服务（内部挂载全局 State）
pub async fn start(addr: SocketAddr, state: AppState) -> anyhow::Result<()> {
    let app = new().with_state(state);
    info!("starting server on http://{}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await.map_err(|e| {
        error!(error = %e, "server error");
        e.into()
    })
}
