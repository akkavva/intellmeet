const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  lazyConnect: true
});

redis.on('connect', () => {
  console.log('Redis Connected');
});

redis.on('error', (err) => {
  console.log('Redis Error - continuing without cache:', err.message);
});

module.exports = redis;