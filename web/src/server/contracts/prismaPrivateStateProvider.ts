import { prisma } from '@/lib/prisma';

export interface PrivateStateProvider<T> {
  get(stateId: string): Promise<T | null>;
  set(stateId: string, state: T): Promise<void>;
  remove(stateId: string): Promise<void>;
  setContractAddress(contractAddress: string): void;
}

export function createPrismaPrivateStateProvider<T>(contextId: string): PrivateStateProvider<T> {
  let currentContractAddress: string | null = null;

  return {
    async get(stateId: string): Promise<T | null> {
      const id = `${contextId}:${stateId}:${currentContractAddress ?? 'global'}`;
      const record = await prisma.privateState.findUnique({
        where: { id },
      });
      if (!record) return null;
      return JSON.parse(record.data) as T;
    },

    async set(stateId: string, state: T): Promise<void> {
      const id = `${contextId}:${stateId}:${currentContractAddress ?? 'global'}`;
      await prisma.privateState.upsert({
        where: { id },
        update: { data: JSON.stringify(state) },
        create: { id, data: JSON.stringify(state) },
      });
    },

    async remove(stateId: string): Promise<void> {
      const id = `${contextId}:${stateId}:${currentContractAddress ?? 'global'}`;
      await prisma.privateState.deleteMany({
        where: { id },
      });
    },

    setContractAddress(contractAddress: string): void {
      currentContractAddress = contractAddress;
    },
  };
}
