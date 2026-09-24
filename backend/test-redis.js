const Redis = require('ioredis');

const redis = new Redis('redis://default:t6qwHukrg2n38vBmXciyqj5bt60L02id@twig-night-wheel-48951.db.redis.io:16175');

redis.on('error', (err) => console.error('Redis error:', err.message));

redis.ping()
  .then(res => { console.log('Redis:', res); process.exit(0); })
  .catch(err => { console.error('Error:', err.message); process.exit(1); });
