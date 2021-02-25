const ErrorNotFound = require("../errors/errorNotFound")
const DaoUtils = require("./daoUtils")

const excludedFields = ["id"]

module.exports = class UserDao {
    constructor() {
        throw new Error(`The class ${this.constructor.name} can not be instanced`)
    }

    static _get(where) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = `SELECT * FROM User ${where ? `WHERE ${where}` : ""}`
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

    static getUser(user) {
        if(user.id) {
            return this._get(`id='${user.id}'`)
        }

        if(user.email) {
            return this._get(`email='${user.email}'`)
        }
    }

    static add(user) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = "INSERT INTO user (user, email, passHash) VALUES (?, ?, ?)"
                const result = await DaoUtils.insert(query, user, excludedFields)

                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    }
}