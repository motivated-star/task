const redisClient = require('../config/redisClient');

const getCache = async (key) => {
  const cachedData = await redisClient.get(key);
  return cachedData ? JSON.parse(cachedData) : null;
};

const setCache = async (key, value, ttl = 3600) => {
  await redisClient.set(key, JSON.stringify(value), { EX: ttl });
};


const invalidateCache = async (basePattern) => {
  try {
    const response = await fetch(`https://definite-anteater-44163.upstash.io/v1/keys/${basePattern}*`, {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      },
    });

    const { result } = await response.json();
    if (Array.isArray(result)) {
      for (const key of result) {
        await redisClient.del(key);
      }
    } else {
      console.error("Expected an array of keys but got:", result);
    }
  } catch (error) {
    console.error('Failed to invalidate Redis keys:', error);
  }
};

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
