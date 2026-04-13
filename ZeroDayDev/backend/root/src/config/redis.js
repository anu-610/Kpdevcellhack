// Fake Redis client using in-memory storage

const store = {};

const redisClient = {
  async connect() {
    console.log(" Using in-memory Redis (no real Redis connected)");
  },

  async lpush(key, value) {
    if (!store[key]) store[key] = [];
    store[key].unshift(value);
  },

  async rpush(key, value) {
    if (!store[key]) store[key] = [];
    store[key].push(value);
  },

  async lrange(key, start, end) {
    if (!store[key]) return [];
    return store[key].slice(start, end + 1);
  },

  async del(key) {
    delete store[key];
  }
};

module.exports = redisClient;