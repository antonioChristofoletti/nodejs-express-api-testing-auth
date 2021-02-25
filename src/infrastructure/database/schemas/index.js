const fs = require("fs")
const path = require("path")
const StringUtils = require("../../../general/Utils/StringUtils")

module.exports = fs.readdirSync(__dirname)
    .filter(file => file !== "index.js")
    .reduce((acc, file) => {
        const loadedModule = require(path.join(__dirname, file))

        loadedModule.schema = StringUtils.makeInline(loadedModule.schema)

        acc[path.basename(file, '.js')] = loadedModule

        return acc
    }, {})