module.exports = class ErrorBase extends Error {
    constructor(message, code) {
        super()

        this._message = message
        this._code = code
    }

    get message() {
        return this._message
    }

    get code() {
        return this._code
    }
}