type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

type RateLimitOptions = {
  windowMs: number;
  maxRequests: number;
};

export const checkRateLimit = (
  key: string,
  { windowMs, maxRequests }: RateLimitOptions
): { allowed: boolean; retryAfterMs: number } => {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  store.set(key, entry);
  return { allowed: true, retryAfterMs: 0 };
};
