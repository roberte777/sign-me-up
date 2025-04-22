use std::env;

#[derive(Debug, Clone)]
pub struct Config {
    pub database_url: String,
    pub server_host: String,
    pub server_port: u16,
}

impl Config {
    pub fn from_env() -> Self {
        // Load .env file if present
        dotenvy::dotenv().ok();

        let database_url =
            env::var("DATABASE_URL").expect("DATABASE_URL must be set in environment variables");

        let server_host = env::var("SERVER_HOST").unwrap_or_else(|_| "127.0.0.1".to_string());

        let server_port = env::var("SERVER_PORT")
            .unwrap_or_else(|_| "3000".to_string())
            .parse::<u16>()
            .expect("SERVER_PORT must be a valid port number");

        Self {
            database_url,
            server_host,
            server_port,
        }
    }
}
