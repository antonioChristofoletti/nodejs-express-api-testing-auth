const ErrorBase = require("./errorBase")

module.exports = class ErrorInternalServer extends ErrorBase {
    constructor(message) {
        super(message, 500)
    }
}