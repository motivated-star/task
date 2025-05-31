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
    const result = await redisClient.keys(`${basePattern}*`);

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
