const Redis = require('ioredis');
require('dotenv').config();

const redis = new Redis(process.env.REDIS_URL);

redis.on('error', (e) => console.log('redis err:', e.message));

module.exports = redis;
