const jwt = require("jsonwebtoken")
const { createHash } = require("crypto")
const blacklist = require("./blacklist")

const { promisify } = require("util")

const asyncBlackListExist = promisify(blacklist.exists).bind(blacklist)
const asyncBlackListSet = promisify(blacklist.set).bind(blacklist)

function getTokenHash(token) {
    return createHash("sha256").update(token).digest("hex")
}

module.exports = {
    add: async (token) => {
        const expireData = jwt.decode(token).exp
        const tokenHash = getTokenHash(token)

        await asyncBlackListSet(tokenHash, "")

        blacklist.expireat(tokenHash, expireData)
    },
    hasToken: async (token) => {
        const tokenHash = getTokenHash(token)
        const result = await asyncBlackListExist(tokenHash)
        return result === 1
    }
}