const ErrorNotAcceptable = require("../../app/errors/errorNotAcceptable")
const StringUtils = require("../../general/Utils/StringUtils")

const allowedFormats = [
    {
        type: "application/json",
        serialize: data => JSON.stringify(data),
        default: true
    },
    {
        type: "text/plain",
        serialize: data => data.toString()
    }
]

class Serializer {
    constructor() {
        const className = this.constructor.name

        if (className === "Serializer") {
            throw new Error(`The class ${className} can not be instanced`)
        }
    }

    serialize(data) {
        data = this._filter(data)

        const foundFormat = allowedFormats.filter(item => item.type === this.contentType)

        return foundFormat[0].serialize(data)
    }

    _filter(data) {
        if (Array.isArray(data)) {
            return data.map(dataElement => this._filterElement(dataElement))
        } else {
            return this._filterElement(data)
        }
    }

    _filterElement(data) {
        this.excludedFields.forEach(excludedField => {
            delete data[excludedField]
        })

        return StringUtils.removeUnderlineInAttributeName(data)
    }
}

module.exports = {
    Serializer,
    allowedFormats,
    defaultFormat: allowedFormats.filter(item => item.default)[0].type
}