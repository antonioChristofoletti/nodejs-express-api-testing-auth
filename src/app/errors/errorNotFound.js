const ErrorBase = require("./errorBase")

module.exports = class ErrorNotFound extends ErrorBase {
    constructor(message) {
        super(message, 404)
    }
}