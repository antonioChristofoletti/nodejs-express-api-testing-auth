const { Serializer } = require("./serializer");

module.exports = class ErrorSerializer extends Serializer {
    constructor(contentType, excludedFields = [], extraFields = []) {
        super()

        this._excludedFields = excludedFields.concat(extraFields)
        this._contentType = contentType
    }

    get excludedFields() {
        return this._excludedFields
    }

    get contentType() {
        return this._contentType
    }
}