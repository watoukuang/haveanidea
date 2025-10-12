use std::net::SocketAddr;

use tracing::error;

mod db;
mod models;
mod service;
mod utils;
mod app;
mod bootstrap;
mod router;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let (state, addr): (app::AppState, SocketAddr) = app::init().await?;
    app::start(addr, state).await.map_err(|e| {
        error!(error = %e, "server error");
        e
    })
}
