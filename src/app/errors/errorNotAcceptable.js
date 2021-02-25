const ErrorBase = require("./errorBase")

module.exports = class ErrorNotAcceptable extends ErrorBase {
    constructor(message) {
        super(message, 406)
    }
}