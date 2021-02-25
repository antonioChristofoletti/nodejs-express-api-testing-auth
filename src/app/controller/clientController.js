const { checkStringEmpty, checkStringMaximumLength, checkStringMiniumLength, checkInteger, checkNumberHigherThan0 } = require("../../general/validations/commonValidations");
const ClientDao = require("../dao/clientDao");

module.exports = class ClientController {
    constructor() {
        throw new Error(`The class ${this.constructor.name} can not be instanced`)
    }

    static validate(client, insert = true) {
        if (!insert) {
            this.validateID(client.id)
        }

        checkStringEmpty("name", client.name)
        checkStringMiniumLength("name", client.name, 5)
        checkStringMaximumLength("name", client.name, 100)
    }

    static validateID(idClient) {
        checkInteger("id", idClient)
        checkNumberHigherThan0("id", idClient)
    }

    static add(client) {
        return new Promise(async (resolve, reject) => {
            try {
                this.validate(client, true)

                const result = await ClientDao.add(client)

                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    }

    static getAll() {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await ClientDao.getAll()
                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    }

    static getClient(idClient) {
        return new Promise(async (resolve, reject) => {
            try {
                this.validateID(idClient)

                const result = await ClientDao.getClient(idClient)
                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    }

    static delete(idClient) {
        return new Promise(async (resolve, reject) => {
            try {
                checkInteger("id", idClient)

                await ClientDao.getClient(idClient)
                await ClientDao.delete(idClient)

                resolve()
            } catch (error) {
                reject(error)
            }
        })
    }

    static update(client) {
        return new Promise(async (resolve, reject) => {
            try {
                
                this.validate(client, false)

                await ClientDao.getClient(client.id)

                await ClientDao.update(client)

                resolve()
            } catch (error) {
                reject(error)
            }
        })
    }
}