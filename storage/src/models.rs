use serde::{Deserialize, Serialize};

// Pinata API response structure
#[derive(Serialize, Deserialize, Debug)]
pub struct ApiUploadResponse {
    #[serde(rename = "IpfsHash")]
    pub cid: String,
}

#[derive(Serialize, Deserialize)]
pub struct UploadOutput {
    pub success: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cid: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub gateway: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_private: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct FetchOutput {
    pub success: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub path: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct VerifyOutput {
    pub success: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub reachable: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct HealthOutput {
    pub status: String,
    pub version: String,
}
