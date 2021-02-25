const ErrorBadRequest = require("../../app/errors/errorBadRequest")
const NumberUtils = require("../Utils/NumberUtils")
const StringUtils = require("../Utils/StringUtils")

module.exports = {
    checkStringEmpty(fieldName, string) {
        if (typeof string !== "string") {
            throw new ErrorBadRequest(`The field ${fieldName} needs be a string`)
        }

        const removedExtraSpacesString = StringUtils.makeInline(string).trim() 

        if (string === undefined || string === null || removedExtraSpacesString.length === 0) {
            throw new ErrorBadRequest(`The field ${fieldName} can not be empty`)
        }
    },

    checkStringMiniumLength(fieldName, string, minimumSize) {
        const removedExtraSpacesString = StringUtils.makeInline(string).trim() 

        if (removedExtraSpacesString.length < minimumSize) {
            throw new ErrorBadRequest(`The field ${fieldName} needs to be bigger or equals than ${minimumSize} size`)
        }
    },

    checkStringMaximumLength(fieldName, string, maximumSize) {
        const removedExtraSpacesString = StringUtils.makeInline(string).trim() 

        if (removedExtraSpacesString.length > maximumSize) {
            throw new ErrorBadRequest(`The field ${fieldName} needs to be smaller or equals than ${maximumSize} size`)
        }
    },

    checkInteger(fieldName, value) {
        if(!NumberUtils.isInteger(value)) {
            throw new ErrorBadRequest(`The field ${fieldName} needs to be a integer number`)
        }
    },

    checkNumberHigherThan0(fieldName, value) {
        if(value <= 0) {
            throw new ErrorBadRequest(`The field ${fieldName} needs to be a integer number`)
        }
    }
}