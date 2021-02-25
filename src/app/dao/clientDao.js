const ErrorNotFound = require("../errors/errorNotFound")
const DaoUtils = require("./daoUtils")

const excludedFields = ["id"]

module.exports = class ClientDao {
    constructor() {
        throw new Error(`The class ${this.constructor.name} can not be instanced`)
    }

    static add(client) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = "INSERT INTO client (name) VALUES (?)"
                const result = await DaoUtils.insert(query, client, excludedFields)

                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    }

    static _get(where) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = `SELECT * FROM client ${where ? `WHERE ${where}` : ""}`
                const result = await DaoUtils.get(query)

                if (result.length === 0) {
                    resolve(null)
                }

                if (result.length === 1) {
                    resolve(result[0])
                } 

                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    }

    static getAll() {
        return this._get()
    }

    static getClient(id) {
        return this._get(`id=${id}`)
    }

    static delete(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = "DELETE FROM Client WHERE id =?"
                await DaoUtils.runQuery(query, id)

                resolve()
            } catch (error) {
                reject(error)
            }
        })
    }

    static update(client) {
        return new Promise(async (resolve, reject) => {
            try {
                await DaoUtils.update("client", client, excludedFields)

                resolve()
            } catch (error) {
                reject(error)
            }
        })
    }
}