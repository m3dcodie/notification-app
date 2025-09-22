// Simple in-memory mock for Redis idempotency key storage
const idempotencyStore: Record<string, { status: number; response: any }> = {};

export async function getIdempotencyResult(key: string): Promise<{ status: number; response: any } | undefined> {
  return idempotencyStore[key];
}

export async function setIdempotencyResult(key: string, value: { status: number; response: any }): Promise<void> {
  idempotencyStore[key] = value;
}
