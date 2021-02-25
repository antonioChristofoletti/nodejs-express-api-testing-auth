module.exports = class Utils {
    constructor() {
        throw new Error(`The class ${this.constructor.name} can not be instanced`)
    }
}