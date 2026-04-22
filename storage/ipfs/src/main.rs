use axum::{
    routing::{get, post},
    Router,
};
use std::net::SocketAddr;
use tokio::net::TcpListener;

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
        .route("/verify/:cid", get(handlers::verify));

    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "10000".to_string())
        .parse::<u16>()
        .unwrap_or(10000);

    let addr = SocketAddr::from(([0, 0, 0, 0], port));

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
