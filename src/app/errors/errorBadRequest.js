const ErrorBase = require("./errorBase")

module.exports = class ErrorBadRequest extends ErrorBase {
    constructor(message) {
        super(message, 400)
    }
}