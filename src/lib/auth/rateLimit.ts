// In-memory token bucket rate limiter for auth endpoints
const tracker = new Map<string, { count: number; expiresAt: number }>();

export function checkRateLimit(
  key: string,
  maxRequests = 10,
  windowMs = 60 * 1000
): { isLimited: boolean; remaining: number } {
  const now = Date.now();
  const record = tracker.get(key);

  if (!record || record.expiresAt < now) {
    tracker.set(key, { count: 1, expiresAt: now + windowMs });
    return { isLimited: false, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    return { isLimited: true, remaining: 0 };
  }

  record.count += 1;
  return { isLimited: false, remaining: maxRequests - record.count };
}
