use axum::Router;
use tower_http::cors::{Any, CorsLayer};

// 配置 Axum 中间件（对任意状态类型的 Router 生效）
pub fn configure_router<S>(router: Router<S>) -> Router<S>
where
    S: Clone + Send + Sync + 'static,
{
    router.layer(CorsLayer::new().allow_origin(Any).allow_methods(Any).allow_headers(Any))
}
