type Bucket = { tokens: number; lastRefill: number };
const buckets = new Map<string, Bucket>();

const CAPACITY = 5;
const WINDOW_MS = 10 * 60 * 1000;

export function allow(ip: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip) ?? { tokens: CAPACITY, lastRefill: now };
  const elapsed = now - bucket.lastRefill;
  if (elapsed > WINDOW_MS) {
    bucket.tokens = CAPACITY;
    bucket.lastRefill = now;
  }
  if (bucket.tokens <= 0) {
    buckets.set(ip, bucket);
    return false;
  }
  bucket.tokens -= 1;
  buckets.set(ip, bucket);
  return true;
}

// For testing purposes - reset all rate limiting state
export function resetRateLimit(): void {
  buckets.clear();
}

