use axum::http::Method;
use backend::config::Config;
use backend::{db, routes};
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Load configuration from environment
    let config = Config::from_env();

    // Initialize logging
    tracing_subscriber::registry()
        .with(tracing_subscriber::fmt::layer())
        .init();

    tracing::info!("Starting Event Groups API");
    tracing::debug!("Using config: {:?}", config);

    // Create database connection pool
    let db_pool = db::create_pool(&config).await?;

    // Set up CORS
    let cors = CorsLayer::new()
        .allow_methods([
            Method::GET,
            Method::POST,
            Method::PUT,
            Method::DELETE,
            Method::OPTIONS,
        ])
        .allow_headers(Any)
        .allow_origin(Any);

    // Build the application with routes
    let app = routes::create_router(db_pool)
        .layer(TraceLayer::new_for_http())
        .layer(cors);

    // Start the server
    let addr = format!("{}:{}", config.server_host, config.server_port).parse::<SocketAddr>()?;

    tracing::info!("Listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();

    Ok(())
}
