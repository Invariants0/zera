/**
 * Witness Provider for Zera Asset Registry Contract
 *
 * Witnesses are private inputs that users provide to the contract.
 * They are NOT publicly revealed on-chain but are used to generate zero-knowledge proofs.
 *
 * The Zera contract uses two witnesses:
 * 1. creatorSecretKey: 32-byte secret for asset creation (derives creatorPublicKey internally)
 * 2. ownerSecretKey: 32-byte secret for ownership operations (derives ownerPublicKey internally)
 */

import type { WitnessContext } from '@midnight-ntwrk/compact-runtime';

/**
 * Create a 32-byte hash from an arbitrary string
 * Used to generate deterministic secret keys for testing
 *
 * @param input - String input to hash
 * @returns 32-byte Uint8Array
 */
export function createHash(input: string): Uint8Array {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const padded = new Uint8Array(32);
  padded.set(data.slice(0, Math.min(32, data.length)));
  return padded;
}

/**
 * Generate cryptographically random 32 bytes
 * Used for secure witness generation in production
 *
 * @returns 32-byte random Uint8Array
 */
export function generateRandomSecret(): Uint8Array {
  if (typeof globalThis !== 'undefined' && globalThis.crypto) {
    return globalThis.crypto.getRandomValues(new Uint8Array(32));
  }
  // Fallback for Node.js
  const crypto = require('crypto');
  return new Uint8Array(crypto.randomBytes(32));
}

/**
 * Witness provider for a specific user/actor
 * Stores the creator and owner secrets for an identity
 */
export class UserWitnesses {
  private _creatorSecret: Uint8Array;
  private _ownerSecret: Uint8Array;

  // Public witness functions (required for Contract constructor)
  readonly creatorSecretKey: (context: WitnessContext<unknown, unknown>) => [unknown, Uint8Array];
  readonly ownerSecretKey: (context: WitnessContext<unknown, unknown>) => [unknown, Uint8Array];

  constructor(creatorSecret?: Uint8Array, ownerSecret?: Uint8Array) {
    // Use provided secrets or generate random ones
    this._creatorSecret = creatorSecret || generateRandomSecret();
    this._ownerSecret = ownerSecret || generateRandomSecret();

    // Bind witness functions to this instance
    this.creatorSecretKey = (context: WitnessContext<unknown, unknown>): [unknown, Uint8Array] => {
      return [context.privateState, this._creatorSecret];
    };

    this.ownerSecretKey = (context: WitnessContext<unknown, unknown>): [unknown, Uint8Array] => {
      return [context.privateState, this._ownerSecret];
    };
  }

  /**
   * Get the witnesses object for contract deployment
   * Returns an object with witness functions ready for the contract
   *
   * @returns Witnesses object compatible with Contract constructor
   */
  getWitnesses() {
    return {
      creatorSecretKey: this.creatorSecretKey,
      ownerSecretKey: this.ownerSecretKey,
    };
  }

  /**
   * Get creator secret key (for debugging/testing only)
   * @returns 32-byte creator secret
   */
  getCreatorSecret(): Uint8Array {
    return this._creatorSecret;
  }

  /**
   * Get owner secret key (for debugging/testing only)
   * @returns 32-byte owner secret
   */
  getOwnerSecret(): Uint8Array {
    return this._ownerSecret;
  }

  /**
   * Display secrets as hex strings (for logging)
   * @returns Object with hex-encoded secrets
   */
  displaySecrets() {
    return {
      creatorSecretKey: Buffer.from(this._creatorSecret).toString('hex'),
      ownerSecretKey: Buffer.from(this._ownerSecret).toString('hex'),
    };
  }
}

/**
 * Create test witnesses using deterministic seeds
 * Useful for reproducible testing
 *
 * @param userId - Identifier for the user (e.g., "alice", "bob")
 * @returns UserWitnesses instance with deterministic secrets
 */
export function createTestWitnesses(userId: string): UserWitnesses {
  const creatorSecret = createHash(`${userId}-creator-secret-key`);
  const ownerSecret = createHash(`${userId}-owner-secret-key`);
  return new UserWitnesses(creatorSecret, ownerSecret);
}

/**
 * Create production witnesses with random secrets
 * Each call generates different secrets
 *
 * @returns UserWitnesses instance with random secrets
 */
export function createProductionWitnesses(): UserWitnesses {
  return new UserWitnesses();
}

/**
 * Helper to derive public keys from secrets
 * This mimics what the contract does internally via persistentHash()
 *
 * @param secretKey - 32-byte secret
 * @param prefix - Prefix string for the hash context
 * @returns 32-byte public key derived from secret
 */
export function derivePublicKey(secretKey: Uint8Array, prefix: string): Uint8Array {
  // In production, this would use the actual persistentHash algorithm
  // For testing, we create a deterministic derivation
  const encoder = new TextEncoder();
  const prefixBytes = encoder.encode(prefix);
  const combined = new Uint8Array(prefixBytes.length + secretKey.length);
  combined.set(prefixBytes);
  combined.set(secretKey, prefixBytes.length);

  // Simple hash-like derivation for testing
  const hash = new Uint8Array(32);
  for (let i = 0; i < combined.length; i++) {
    hash[i % 32] ^= combined[i];
  }
  return hash;
}

/**
 * Derive creator public key from secret
 * Mirrors contract's deriveCreatorPublicKey() circuit
 *
 * @param creatorSecret - 32-byte creator secret
 * @returns 32-byte creator public key
 */
export function deriveCreatorPublicKey(creatorSecret: Uint8Array): Uint8Array {
  return derivePublicKey(creatorSecret, 'zera:creator:pubkey');
}

/**
 * Derive owner public key from secret
 * Mirrors contract's deriveOwnerPublicKey() circuit
 *
 * @param ownerSecret - 32-byte owner secret
 * @returns 32-byte owner public key
 */
export function deriveOwnerPublicKey(ownerSecret: Uint8Array): Uint8Array {
  return derivePublicKey(ownerSecret, 'zera:pk:v1');
}

/**
 * Multi-witness provider for test scenarios with multiple users
 */
export class MultiUserWitnesses {
  private witnesses: Map<string, UserWitnesses> = new Map();

  /**
   * Add a user's witnesses
   *
   * @param userId - Unique identifier for the user
   * @param userWitnesses - UserWitnesses instance for that user
   */
  addUser(userId: string, userWitnesses: UserWitnesses): void {
    this.witnesses.set(userId, userWitnesses);
  }

  /**
   * Get a user's witnesses
   *
   * @param userId - User identifier
   * @returns UserWitnesses instance or undefined if not found
   */
  getUser(userId: string): UserWitnesses | undefined {
    return this.witnesses.get(userId);
  }

  /**
   * Create and add a test user
   *
   * @param userId - User identifier
   * @returns Created UserWitnesses instance
   */
  createTestUser(userId: string): UserWitnesses {
    const userWitnesses = createTestWitnesses(userId);
    this.addUser(userId, userWitnesses);
    return userWitnesses;
  }

  /**
   * List all registered users
   *
   * @returns Array of user IDs
   */
  listUsers(): string[] {
    return Array.from(this.witnesses.keys());
  }
}
