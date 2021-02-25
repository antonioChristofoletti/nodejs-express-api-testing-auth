const { connection } = require("../../infrastructure/database/index")
const { promisify } = require("util")
const ErrorInternalServer = require("../errors/errorInternalServer")
const StringUtils = require("../../general/Utils/StringUtils")

const funGet = promisify(connection.all).bind(connection)

module.exports = class DaoUtils {
    constructor() {
        throw new Error(`The class ${this.constructor.name} can not be instanced`)
    }

    static _prepareObjToQuery(obj, removeFields) {
        let newObj = { ...obj }

        newObj = StringUtils.removeUnderlineInAttributeName(newObj)
        newObj = this._removeFields(newObj, removeFields)

        return newObj
    }

    static _removeFields(obj, removeFields) {
        removeFields.forEach(removeField => {
            delete obj[removeField]
        })

        return obj
    }

    static _prepareUpdate(obj) {
        return Object.entries(obj)
            .map(entry => {
                const [key, value] = entry

                return `${key}=${this._prepareValueToUpdate(value)}`
            })
            .reduce((acc, value) => {
                return `${acc}, ${value}`
            })
    }

    static _prepareValueToUpdate(value) {
        if (StringUtils.isString(value)) {
            return `'${value}'`
        }

        return value
    }

    static runQuery(query, params = []) {
        return new Promise((resolve, reject) => {
            try {
                connection.run(query, params, function (error) {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(this)
                    }
                })
            } catch (error) {
                reject(new ErrorInternalServer(`Error running query. Error: ${error.message}`));
            }
        })
    }

    static insert(query, obj, removeFields) {
        return new Promise(async (resolve, reject) => {
            try {
                const newObj = this._prepareObjToQuery(obj, removeFields)

                const result = await this.runQuery(query, Object.values(newObj))

                obj.id = result.lastID

                resolve(obj)
            } catch (error) {
                reject(new ErrorInternalServer(`Error running insert query. Error: ${error.message}`));
            }
        })
    }

    static get(query, params) {
        return new Promise((resolve, reject) => {
            try {
                const result = funGet(query, params)
                resolve(result)
            } catch (error) {
                reject(new ErrorInternalServer(`Error running query. Error: ${error.message}`));
            }
        })
    }

    static async update(tableName, obj, removeFields) {
        return new Promise(async (resolve, reject) => {
            try {
                const newObj = this._prepareObjToQuery(obj, removeFields)

                const updateCause = this._prepareUpdate(newObj)

                const queryUpdate = `UPDATE ${tableName} SET ${updateCause} WHERE id=${obj.id}`

                await DaoUtils.runQuery(queryUpdate)

                resolve()
            } catch (error) {
                reject(new ErrorInternalServer(`Error running update query. Error: ${error.message}`));
            }
        })
    }
}