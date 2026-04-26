use reqwest::multipart;
use std::path::PathBuf;
use std::time::Duration;
use tokio::fs;
use tokio::time::sleep;

use crate::models::ApiUploadResponse;

const REQUEST_TIMEOUT: Duration = Duration::from_secs(15);
const MAX_RETRIES: u32 = 1;

pub struct IpfsClient {
    api_token: String,
    base_url: String,
    http_client: reqwest::Client,
}

impl IpfsClient {
    pub fn new() -> Result<Self, String> {
        dotenv::dotenv().ok();
        let api_token = std::env::var("PINATA_JWT")
            .map_err(|_| "PINATA_JWT not found in environment".to_string())?;

        let http_client = reqwest::Client::builder()
            .timeout(REQUEST_TIMEOUT)
            .build()
            .map_err(|e| format!("Failed to create HTTP client: {}", e))?;

        Ok(Self {
            api_token,
            base_url: "https://api.pinata.cloud".to_string(),
            http_client,
        })
    }

    pub fn validate_cid(&self, cid: &str) -> Result<(), String> {
        if cid.is_empty() {
            return Err("CID cannot be empty".to_string());
        }
        if !cid.starts_with("bafy") && !cid.starts_with("Qm") {
            return Err(format!("Invalid CID format: {}", cid));
        }
        Ok(())
    }

    #[allow(dead_code)]
    pub async fn upload_file_with_retry(&self, file_path: PathBuf) -> Result<String, String> {
        let mut last_error = String::new();

        for attempt in 0..=MAX_RETRIES {
            match self.upload_file_attempt(&file_path).await {
                Ok(cid) => return Ok(cid),
                Err(e) => {
                    last_error = e;
                    if attempt < MAX_RETRIES {
                        sleep(Duration::from_secs(1)).await;
                    }
                }
            }
        }

        Err(last_error)
    }

    #[allow(dead_code)]
    async fn upload_file_attempt(&self, file_path: &PathBuf) -> Result<String, String> {
        if !file_path.exists() {
            return Err(format!("File not found: {:?}", file_path));
        }

        let file_name = file_path
            .file_name()
            .ok_or_else(|| "Invalid file name".to_string())?
            .to_string_lossy()
            .to_string();

        let file_bytes = fs::read(file_path)
            .await
            .map_err(|e| format!("Failed to read file: {}", e))?;

        let part = multipart::Part::bytes(file_bytes)
            .file_name(file_name)
            .mime_str("application/octet-stream")
            .map_err(|e| format!("Failed to set MIME type: {}", e))?;

        let form = multipart::Form::new().part("file", part);

        let response = self
            .http_client
            .post(format!("{}/pinning/pinFileToIPFS", self.base_url))
            .header("Authorization", format!("Bearer {}", self.api_token))
            .multipart(form)
            .send()
            .await
            .map_err(|e| format!("Upload request failed: {}", e))?;

        if !response.status().is_success() {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            return Err(format!("Upload failed with status {}: {}", status, body));
        }

        let upload_response: ApiUploadResponse = response
            .json()
            .await
            .map_err(|e| format!("Failed to parse response: {}", e))?;

        Ok(upload_response.cid)
    }

    #[allow(dead_code)]
    pub async fn upload_bytes_with_retry(
        &self,
        file_bytes: Vec<u8>,
        file_name: String,
    ) -> Result<String, String> {
        self.upload_bytes_with_retry_private(file_bytes, file_name, false).await
    }

    pub async fn upload_bytes_with_retry_private(
        &self,
        file_bytes: Vec<u8>,
        file_name: String,
        is_private: bool,
    ) -> Result<String, String> {
        let mut last_error = String::new();

        for attempt in 0..=MAX_RETRIES {
            match self.upload_bytes_attempt_private(&file_bytes, &file_name, is_private).await {
                Ok(cid) => return Ok(cid),
                Err(e) => {
                    last_error = e;
                    if attempt < MAX_RETRIES {
                        sleep(Duration::from_secs(1)).await;
                    }
                }
            }
        }

        Err(last_error)
    }

    #[allow(dead_code)]
    async fn upload_bytes_attempt(
        &self,
        file_bytes: &[u8],
        file_name: &str,
    ) -> Result<String, String> {
        self.upload_bytes_attempt_private(file_bytes, file_name, false).await
    }

    async fn upload_bytes_attempt_private(
        &self,
        file_bytes: &[u8],
        file_name: &str,
        is_private: bool,
    ) -> Result<String, String> {
        let part = multipart::Part::bytes(file_bytes.to_vec())
            .file_name(file_name.to_string())
            .mime_str("application/octet-stream")
            .map_err(|e| format!("Failed to set MIME type: {}", e))?;

        let mut form = multipart::Form::new().part("file", part);

        // Add metadata for private files
        if is_private {
            let metadata = serde_json::json!({
                "name": file_name,
                "keyvalues": {
                    "private": "true"
                }
            });
            form = form.text("pinataMetadata", metadata.to_string());
        }

        let response = self
            .http_client
            .post(format!("{}/pinning/pinFileToIPFS", self.base_url))
            .header("Authorization", format!("Bearer {}", self.api_token))
            .multipart(form)
            .send()
            .await
            .map_err(|e| format!("Upload request failed: {}", e))?;

        if !response.status().is_success() {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            return Err(format!("Upload failed with status {}: {}", status, body));
        }

        let upload_response: ApiUploadResponse = response
            .json()
            .await
            .map_err(|e| format!("Failed to parse response: {}", e))?;

        Ok(upload_response.cid)
    }

    pub async fn fetch_file_with_retry(
        &self,
        cid: &str,
        output_path: Option<PathBuf>,
    ) -> Result<PathBuf, String> {
        let mut last_error = String::new();

        for attempt in 0..=MAX_RETRIES {
            match self.fetch_file_attempt(cid, output_path.clone()).await {
                Ok(path) => return Ok(path),
                Err(e) => {
                    last_error = e;
                    if attempt < MAX_RETRIES {
                        sleep(Duration::from_secs(1)).await;
                    }
                }
            }
        }

        Err(last_error)
    }

    async fn fetch_file_attempt(
        &self,
        cid: &str,
        output_path: Option<PathBuf>,
    ) -> Result<PathBuf, String> {
        self.validate_cid(cid)?;

        let gateways = vec![
            format!("https://{}.ipfs.w3s.link", cid),
            format!("https://ipfs.io/ipfs/{}", cid),
        ];

        let mut last_error = String::new();

        for gateway_url in gateways {
            match self.http_client.get(&gateway_url).send().await {
                Ok(response) if response.status().is_success() => {
                    let bytes = response
                        .bytes()
                        .await
                        .map_err(|e| format!("Failed to read response: {}", e))?;

                    let output = output_path.clone().unwrap_or_else(|| {
                        PathBuf::from(format!("downloaded_{}", cid))
                    });

                    fs::write(&output, bytes)
                        .await
                        .map_err(|e| format!("Failed to write file: {}", e))?;

                    return Ok(output);
                }
                Ok(response) => {
                    last_error = format!(
                        "Gateway {} returned status {}",
                        gateway_url,
                        response.status()
                    );
                }
                Err(e) => {
                    last_error = format!("Gateway {} failed: {}", gateway_url, e);
                }
            }
        }

        Err(format!("All gateways failed. Last error: {}", last_error))
    }

    #[allow(dead_code)]
    pub async fn fetch_bytes_with_retry(&self, cid: &str) -> Result<Vec<u8>, String> {
        let mut last_error = String::new();

        for attempt in 0..=MAX_RETRIES {
            match self.fetch_bytes_attempt(cid).await {
                Ok(bytes) => return Ok(bytes),
                Err(e) => {
                    last_error = e;
                    if attempt < MAX_RETRIES {
                        sleep(Duration::from_secs(1)).await;
                    }
                }
            }
        }

        Err(last_error)
    }

    #[allow(dead_code)]
    async fn fetch_bytes_attempt(&self, cid: &str) -> Result<Vec<u8>, String> {
        self.validate_cid(cid)?;

        let gateways = vec![
            format!("https://{}.ipfs.w3s.link", cid),
            format!("https://ipfs.io/ipfs/{}", cid),
        ];

        let mut last_error = String::new();

        for gateway_url in gateways {
            match self.http_client.get(&gateway_url).send().await {
                Ok(response) if response.status().is_success() => {
                    let bytes = response
                        .bytes()
                        .await
                        .map_err(|e| format!("Failed to read response: {}", e))?
                        .to_vec();

                    return Ok(bytes);
                }
                Ok(response) => {
                    last_error = format!(
                        "Gateway {} returned status {}",
                        gateway_url,
                        response.status()
                    );
                }
                Err(e) => {
                    last_error = format!("Gateway {} failed: {}", gateway_url, e);
                }
            }
        }

        Err(format!("All gateways failed. Last error: {}", last_error))
    }

    pub async fn verify_cid(&self, cid: &str) -> Result<bool, String> {
        self.validate_cid(cid)?;

        let gateways = vec![
            format!("https://{}.ipfs.w3s.link", cid),
            format!("https://ipfs.io/ipfs/{}", cid),
        ];

        for gateway_url in gateways {
            if let Ok(response) = self.http_client.head(&gateway_url).send().await {
                if response.status().is_success() {
                    return Ok(true);
                }
            }
        }

        Ok(false)
    }
}
