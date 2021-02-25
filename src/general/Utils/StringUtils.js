const Utils = require("./Utils")

module.exports = class StringUtils extends Utils {
    constructor() { super() }

    static isString(text) {
        return typeof text === "string"
    }

    static makeInline(text) {
        return text.replace(/\s+/g, " ")
    }

    static removeUnderlineInAttributeName(obj) {
        const newObj = { ...obj }

        Object.keys(newObj)
            .filter(key => key.startsWith("_"))
            .forEach(key => {
                const newKey = key.replace(/^_/g, "")

                newObj[newKey] = newObj[key]

                delete newObj[key]
            })

        return newObj
    }
}