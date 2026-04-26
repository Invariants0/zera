import { contractApiClient } from './api';

export interface RegisterAssetParams {
  assetId: string;
  metadataUri: string;
  creator: string;
  isPrivate: boolean;
  name?: string;
  description?: string;
  imageUrl?: string;
}

export interface AssignOwnershipParams {
  assetId: string;
  newOwner: string;
}

export interface TransferOwnershipParams {
  assetId: string;
  from: string;
  to: string;
  price?: string;
}

export interface VerifyOwnershipParams {
  assetId: string;
  claimedOwner: string;
}

export interface ContractResponse {
  success: boolean;
  transactionHash?: string;
  message: string;
  data?: any;
}

export const registerAsset = async (params: RegisterAssetParams): Promise<ContractResponse> => {
  const response = await contractApiClient.post('/contract/register-asset', params);
  return response.data as ContractResponse;
};

export const assignOwnership = async (params: AssignOwnershipParams): Promise<ContractResponse> => {
  const response = await contractApiClient.post('/contract/assign-ownership', params);
  return response.data as ContractResponse;
};

export const transferOwnership = async (params: TransferOwnershipParams): Promise<ContractResponse> => {
  const response = await contractApiClient.post('/contract/transfer-ownership', params);
  return response.data as ContractResponse;
};

export const verifyOwnership = async (params: VerifyOwnershipParams): Promise<ContractResponse> => {
  const response = await contractApiClient.post('/contract/verify-ownership', params);
  return response.data as ContractResponse;
};

export const assetExists = async (assetId: string): Promise<boolean> => {
  const response = await contractApiClient.get(`/contract/asset-exists/${assetId}`);
  const payload = response.data as ContractResponse;
  return Boolean(payload.data?.exists);
};

export const getAssetFromContract = async (assetId: string): Promise<any> => {
  const response = await contractApiClient.get(`/contract/asset/${assetId}`);
  return (response.data as ContractResponse).data;
};

export const verifyAsset = async (assetId: string): Promise<ContractResponse> => {
  const response = await contractApiClient.get(`/contract/verify-asset/${assetId}`);
  return response.data as ContractResponse;
};
