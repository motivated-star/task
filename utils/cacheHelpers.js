const redisClient = require('../config/redisClient');

// Get data from cache
const getCache = async (key) => {
  const cachedData = await redisClient.get(key);
  return cachedData ? JSON.parse(cachedData) : null;
};

// Set data in cache with optional TTL (default: 1 hour)
const setCache = async (key, value, ttl = 3600) => {
  await redisClient.set(key, JSON.stringify(value), { EX: ttl });
};

// Invalidate all cache keys matching a base pattern
// This assumes you name keys like `properties:city=delhi` or `properties:*`
const invalidateCache = async (basePattern) => {
  try {
    const response = await fetch(`https://<your-upstash-id>.upstash.io/v1/keys/${basePattern}*`, {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      },
    });

    const { result } = await response.json();
    for (const key of result) {
      await redisClient.del(key);
    }
  } catch (error) {
    console.error('Failed to invalidate Redis keys:', error);
  }
};

// Generate a cache key string from base and object query
const generateCacheKey = (base, params = {}) => {
  const sortedParams = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
  return `${base}:${sortedParams}`;
};

module.exports = {
  getCache,
  setCache,
  invalidateCache,
  generateCacheKey
};
