const Utils = require("./Utils")

module.exports = class NumberUtils extends Utils {
    constructor() { super() }

    static isInteger(value) {
        const regex = /^-?[0-9]+$/
        return regex.test(value)
    }
}