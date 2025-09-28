import { LRUCache } from 'lru-cache';

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export function rateLimit(options: Options = {}) {
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  });

  return {
    check: (limit: number, token: string) =>
      new Promise<{ success: boolean; limit: number; remaining: number; reset: Date }>((resolve) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;
        const reset = new Date(Date.now() + (options.interval || 60000));

        return resolve({
          success: !isRateLimited,
          limit,
          remaining: isRateLimited ? 0 : limit - currentUsage,
          reset,
        });
      }),
  };
}
