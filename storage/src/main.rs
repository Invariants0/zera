use axum::{
    routing::{get, post},
    Router,
};
use std::net::SocketAddr;
use tokio::net::TcpListener;
use tower_http::cors::{Any, CorsLayer};

mod handlers;
mod ipfs;
mod models;

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();

    let app = Router::new()
        .route("/health", get(handlers::health))
        .route("/upload", post(handlers::upload))
        .route("/fetch/:cid", get(handlers::fetch))
        .route("/verify/:cid", get(handlers::verify))
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods(Any)
                .allow_headers(Any),
        );

    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse::<u16>()
        .unwrap_or(8080);

    let host = std::env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
    let addr: SocketAddr = format!("{host}:{port}")
        .parse()
        .expect("failed to parse IPFS server address");

    println!("🚀 ZERA IPFS API Server");
    println!("📡 Listening on: http://{}", addr);
    println!("🔗 Endpoints:");
    println!("   GET  /health");
    println!("   POST /upload");
    println!("   GET  /fetch/:cid");
    println!("   GET  /verify/:cid");

    let listener = TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
