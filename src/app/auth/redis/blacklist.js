const redis = require("redis")

module.exports = redis.createClient({
    prefix: "black-list:"
})