use crate::config::Config;
use crate::error::{AppError, Result};
use sqlx::{Pool, Sqlite, sqlite::SqlitePoolOptions};

pub type DbPool = Pool<Sqlite>;

pub async fn create_pool(config: &Config) -> Result<DbPool> {
    // Create SQLite database directory if it doesn't exist
    let db_path = config.database_url.trim_start_matches("sqlite:");
    if let Some(parent) = std::path::Path::new(db_path).parent() {
        std::fs::create_dir_all(parent).map_err(|e| {
            AppError::InternalServerError(format!("Failed to create database directory: {}", e))
        })?;
    }

    let pool = SqlitePoolOptions::new()
        .max_connections(10)
        .connect(&config.database_url)
        .await
        .map_err(|e| {
            AppError::InternalServerError(format!("Failed to connect to database: {}", e))
        })?;

    // Run migrations if needed
    // sqlx::migrate!("./migrations").run(&pool).await?;

    Ok(pool)
}
