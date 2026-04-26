use axum::{
    extract::{Multipart, Path, Query},
    http::StatusCode,
    Json,
};
use std::path::PathBuf;
use serde::Deserialize;

use crate::ipfs::IpfsClient;
use crate::models::*;

#[derive(Deserialize)]
pub struct UploadQuery {
    #[serde(default)]
    private: bool,
}

pub async fn health() -> Json<HealthOutput> {
    Json(HealthOutput {
        status: "healthy".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
    })
}

pub async fn upload(
    Query(query): Query<UploadQuery>,
    mut multipart: Multipart,
) -> (StatusCode, Json<UploadOutput>) {
    let client = match IpfsClient::new() {
        Ok(c) => c,
        Err(e) => {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(UploadOutput {
                    success: false,
                    cid: None,
                    gateway: None,
                    is_private: None,
                    error: Some(e),
                }),
            );
        }
    };

    // Extract file from multipart
    let mut file_bytes: Option<Vec<u8>> = None;
    let mut file_name: Option<String> = None;

    while let Some(field) = multipart.next_field().await.unwrap_or(None) {
        if let Some(name) = field.file_name() {
            file_name = Some(name.to_string());
        }
        match field.bytes().await {
            Ok(data) => {
                file_bytes = Some(data.to_vec());
            }
            Err(_) => continue,
        }
    }

    let bytes = match file_bytes {
        Some(b) => b,
        None => {
            return (
                StatusCode::BAD_REQUEST,
                Json(UploadOutput {
                    success: false,
                    cid: None,
                    gateway: None,
                    is_private: None,
                    error: Some("No file provided".to_string()),
                }),
            );
        }
    };

    let name = file_name.unwrap_or_else(|| "file".to_string());
    let is_private = query.private;

    match client
        .upload_bytes_with_retry_private(bytes, name, is_private)
        .await
    {
        Ok(cid) => {
            let gateway = if is_private {
                format!("https://gateway.pinata.cloud/ipfs/{}", cid)
            } else {
                format!("https://{}.ipfs.w3s.link", cid)
            };
            (
                StatusCode::OK,
                Json(UploadOutput {
                    success: true,
                    cid: Some(cid),
                    gateway: Some(gateway),
                    is_private: Some(is_private),
                    error: None,
                }),
            )
        }
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(UploadOutput {
                success: false,
                cid: None,
                gateway: None,
                is_private: None,
                error: Some(e),
            }),
        ),
    }
}

pub async fn fetch(Path(cid): Path<String>) -> (StatusCode, Json<FetchOutput>) {
    let client = match IpfsClient::new() {
        Ok(c) => c,
        Err(e) => {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(FetchOutput {
                    success: false,
                    path: None,
                    error: Some(e),
                }),
            );
        }
    };

    let output_path = PathBuf::from(format!("downloads/{}", cid));

    // Ensure downloads directory exists
    if let Err(e) = tokio::fs::create_dir_all("downloads").await {
        return (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(FetchOutput {
                success: false,
                path: None,
                error: Some(format!("Failed to create downloads directory: {}", e)),
            }),
        );
    }

    match client
        .fetch_file_with_retry(&cid, Some(output_path))
        .await
    {
        Ok(path) => (
            StatusCode::OK,
            Json(FetchOutput {
                success: true,
                path: Some(path.to_string_lossy().to_string()),
                error: None,
            }),
        ),
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(FetchOutput {
                success: false,
                path: None,
                error: Some(e),
            }),
        ),
    }
}

pub async fn verify(Path(cid): Path<String>) -> (StatusCode, Json<VerifyOutput>) {
    let client = match IpfsClient::new() {
        Ok(c) => c,
        Err(e) => {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(VerifyOutput {
                    success: false,
                    reachable: None,
                    error: Some(e),
                }),
            );
        }
    };

    match client.verify_cid(&cid).await {
        Ok(reachable) => (
            StatusCode::OK,
            Json(VerifyOutput {
                success: true,
                reachable: Some(reachable),
                error: None,
            }),
        ),
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(VerifyOutput {
                success: false,
                reachable: None,
                error: Some(e),
            }),
        ),
    }
}
