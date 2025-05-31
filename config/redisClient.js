const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.UPSTASH_REDIS_REST_URL, 
});

redisClient.on('error', (err) => console.error('Redis Error:', err));

redisClient.connect();

module.exports = redisClient;
