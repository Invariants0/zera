/**
 * MOCK BACKEND RESPONSES
 * 
 * This file provides mock data responses for development and testing.
 * Replace these with actual API calls when backend is ready.
 */

import type { Asset } from '../services/assets';
import type { Collection } from '../services/collections';
import type { Activity, RegistryEntry } from '../services/marketplace';

// Mock Assets
export const mockAssets: Asset[] = [
  {
    id: "asset-001",
    title: "Quantum Core Alpha",
    description: "A rare digital artifact from the quantum realm",
    creator: "0xKael",
    owner: "0xKael",
    price: "2.4 ZERA",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    badges: ["verified"],
    verified: true,
    private: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "asset-002",
    title: "Neon Nexus Orb",
    description: "Private ownership with ZK proofs",
    creator: "Institutional Vault",
    owner: "0x7F...3A19",
    price: "15.0 ZERA",
    imageUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80",
    badges: ["private"],
    verified: true,
    private: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "asset-003",
    title: "Cyber Punk Genesis",
    description: "First edition cyberpunk collection",
    creator: "0xArtist",
    owner: "0xCollector",
    price: "5.8 ZERA",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
    badges: ["verified"],
    verified: true,
    private: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock Collections
export const mockCollections: Collection[] = [
  {
    id: "col-001",
    name: "Mutant Ape Yacht Club",
    description: "Premium digital collectibles",
    creator: "0xYugaLabs",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&fit=crop",
    verified: true,
    floor: "11.2 ETH",
    volume: "4.5K ETH",
    change: "+12%",
    itemCount: 10000,
    createdAt: new Date().toISOString(),
  },
];

// Mock Activity
export const mockActivity: Activity[] = [
  {
    id: "act-001",
    type: "mint",
    assetId: "asset-001",
    assetTitle: "Quantum Core Alpha",
    from: "0x0000...0000",
    to: "0xKael...3A19",
    timestamp: "2 mins ago",
  },
  {
    id: "act-002",
    type: "sale",
    assetId: "asset-002",
    assetTitle: "Neon Nexus Orb",
    from: "0x7F...3A19",
    to: "0x2B...9C44",
    price: "15.0 ZERA",
    timestamp: "15 mins ago",
  },
  {
    id: "act-003",
    type: "transfer",
    assetId: "asset-003",
    assetTitle: "Cyber Punk Genesis",
    from: "0xArtist...1234",
    to: "0xCollector...5678",
    timestamp: "1 hour ago",
  },
];

// Mock Registry
export const mockRegistry: RegistryEntry[] = [
  {
    id: "ZRA-8492",
    creator: "0x7F...3A19",
    verification: "Verified",
    ownership: "Provable",
    compliance: "KYC-Tier-1",
    updated: "2 mins ago",
  },
  {
    id: "ZRA-1102",
    creator: "0x2B...9C44",
    verification: "Pending",
    ownership: "Private",
    compliance: "Unrestricted",
    updated: "1 hour ago",
  },
  {
    id: "ZRA-9934",
    creator: "Institution-A",
    verification: "Verified",
    ownership: "Provable",
    compliance: "Reg-D",
    updated: "5 hours ago",
  },
];

// Helper to simulate API delay
export const simulateDelay = (ms: number = 500) =>
  new Promise(resolve => setTimeout(resolve, ms));
