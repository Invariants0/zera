# Create Asset Flow Documentation

## Overview
The Create Asset page allows users to mint digital assets on the Midnight blockchain with the following features:
- **Public Images**: Images are uploaded to IPFS without encryption for public display
- **Encrypted Files**: Optional files are encrypted before IPFS upload
- **Purchase with tNight**: All transactions use Midnight's native tNight token
- **Download After Purchase**: Encrypted files can only be downloaded after purchase

## Architecture

### 1. Asset Creation Flow

```
User Input → Encrypt File → Upload to IPFS → Create Metadata → Register on Midnight
```

#### Step-by-Step Process:

1. **User Provides Asset Details**
   - Asset name (required)
   - Description (optional)
   - Image file (required, public)
   - Attachment file (optional, encrypted)

2. **Image Upload (Public)**
   - Image is uploaded to IPFS **without encryption**
   - Returns IPFS CID for public access
   - Used for marketplace display

3. **File Encryption & Upload (Private)**
   - File is encrypted using AES-GCM (256-bit)
   - Generates unique encryption key and IV
   - Encrypted file uploaded to IPFS
   - Encryption metadata stored in asset metadata

4. **Metadata Creation**
   ```json
   {
     "name": "Asset Name",
     "description": "Asset description",
     "image": "ipfs://Qm...",
     "file": "ipfs://Qm...",
     "encryption": {
       "image": null,
       "file": {
         "algorithm": "AES-GCM",
         "key": "base64-encoded-key",
         "iv": "base64-encoded-iv",
         "originalName": "document.pdf",
         "originalType": "application/pdf"
       }
     },
     "creator": "wallet-address",
     "network": "midnight"
   }
   ```

5. **Blockchain Registration**
   - Metadata uploaded to IPFS
   - Asset registered on Midnight smart contract
   - Transaction recorded in database

### 2. Purchase Flow

```
Buyer Clicks Purchase → Transfer tNight → Update Ownership → Record Purchase → Enable Download
```

#### Purchase Process:

1. **Buyer Initiates Purchase**
   - Must be connected with Midnight wallet
   - Cannot purchase own assets
   - Sees "Purchase for X tNight" button

2. **tNight Transfer**
   - Calls `/api/assets/[id]/transfer` endpoint
   - Transfers ownership via Midnight smart contract
   - Payment in tNight from buyer to seller

3. **Database Update**
   - Asset ownership updated in database
   - Purchase record created in `Purchase` table
   - Activity log created

4. **Download Access Granted**
   - Purchase button replaced with "Download Asset File"
   - User can now decrypt and download the file

### 3. Download Flow

```
User Clicks Download → Fetch Encrypted File → Decrypt with Key → Download to Device
```

#### Download Process:

1. **Verify Purchase**
   - Check if user is owner OR has purchased
   - Retrieve encryption metadata from IPFS

2. **Fetch Encrypted File**
   - Download encrypted file from IPFS using CID
   - File is still encrypted at this point

3. **Client-Side Decryption**
   - Use stored encryption key and IV
   - Decrypt using Web Crypto API (AES-GCM)
   - Create downloadable blob

4. **Download to Device**
   - Create temporary download link
   - Trigger browser download
   - Clean up temporary resources

## Database Schema

### Purchase Table
```prisma
model Purchase {
  id        String   @id @default(cuid())
  userId    String
  assetId   String
  price     String
  txHash    String?
  createdAt DateTime @default(now())

  @@unique([userId, assetId])
  @@index([userId])
  @@index([assetId])
}
```

## API Endpoints

### POST /api/purchases
Record a new purchase after successful transfer.

**Request:**
```json
{
  "userId": "wallet-address",
  "assetId": "asset-123",
  "price": "100 tNight",
  "txHash": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Purchase recorded successfully",
  "purchase": { ... }
}
```

### GET /api/purchases?userId=...&assetId=...
Check if a user has purchased an asset.

**Response:**
```json
{
  "success": true,
  "hasPurchased": true,
  "purchase": { ... }
}
```

### POST /api/assets/[id]/transfer
Transfer asset ownership (includes payment).

**Request:**
```json
{
  "from": "seller-address",
  "to": "buyer-address",
  "price": "100 tNight"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Asset ownership transferred",
  "transactionHash": "0x...",
  "data": { ... }
}
```

## Security Considerations

### Encryption
- **AES-GCM 256-bit**: Industry-standard authenticated encryption
- **Unique Keys**: Each file gets a unique encryption key
- **Random IVs**: Initialization vectors are cryptographically random
- **Client-Side**: Encryption happens in browser before upload

### Access Control
- **Owner Check**: Users cannot purchase their own assets
- **Purchase Verification**: Download requires proof of purchase
- **Blockchain Verification**: Ownership verified on-chain

### Privacy
- **Images Public**: Marketplace needs to display images
- **Files Private**: Content files remain encrypted until purchase
- **Metadata On-Chain**: Only IPFS CID stored on blockchain
- **Keys in Metadata**: Encryption keys stored in IPFS metadata (accessible after purchase)

## User Experience

### Asset Creator
1. Upload image and optional file
2. Image shows preview immediately
3. File is encrypted automatically
4. Both uploaded to IPFS
5. Asset registered on Midnight
6. Success screen shows transaction details

### Asset Buyer
1. Browse marketplace (sees public images)
2. Click asset to view details
3. See "Purchase for X tNight" button
4. Click to purchase (wallet transaction)
5. After purchase, "Download Asset File" appears
6. Click to decrypt and download file

### Asset Owner
1. Cannot see purchase button on own assets
2. Can download files immediately
3. Can transfer ownership to others
4. Can verify ownership with ZK proof

## File Types Supported

### Images (Public)
- JPEG, PNG, GIF, WebP
- Max size: 50MB
- Displayed in marketplace

### Files (Encrypted)
- Any file type
- Max size: 50MB
- Encrypted before upload
- Downloadable after purchase

## Future Enhancements

1. **Bulk Downloads**: Download multiple purchased assets
2. **Streaming**: Stream large encrypted files
3. **Resale**: Allow buyers to resell purchased assets
4. **Royalties**: Automatic creator royalties on resales
5. **Bundles**: Package multiple assets together
6. **Time-Limited Access**: Rental/subscription models
7. **Watermarking**: Add buyer watermarks to downloads
8. **Preview**: Limited preview before purchase

## Testing

### Test Create Asset
```bash
npm run test:create-asset
```

### Test Purchase Flow
```bash
npm run test:purchase
```

### Test Download
```bash
npm run test:download
```

## Troubleshooting

### "Failed to upload to IPFS"
- Check IPFS service is running
- Verify NEXT_PUBLIC_IPFS_API_URL in .env
- Check file size limits

### "Purchase failed"
- Ensure wallet has sufficient tNight
- Verify wallet is connected
- Check network connection

### "Download failed"
- Verify purchase was successful
- Check encryption metadata exists
- Ensure IPFS file is accessible

### "Cannot decrypt file"
- Verify encryption keys in metadata
- Check file was encrypted correctly
- Ensure browser supports Web Crypto API
