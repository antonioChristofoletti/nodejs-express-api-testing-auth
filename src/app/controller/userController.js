const UserDao = require("../dao/userDao")
const ErrorBadRequest = require("../errors/errorBadRequest")
const { checkStringEmpty, checkStringMaximumLength, checkStringMiniumLength, checkInteger, checkNumberHigherThan0 } = require("../../general/validations/commonValidations");
const bcrypt = require("bcrypt");
const StringUtils = require("../../general/Utils/StringUtils");

module.exports = class UserController {
    constructor() {
        throw new Error(`The class ${this.constructor.name} can not be instanced`)
    }

    static async validate(user, isInsert = true) {
        if (!isInsert) {
            this.validateID(user.id)
        }

        const newObj = StringUtils.removeUnderlineInAttributeName(user)
        Object.entries(newObj)
            .filter(([key, _]) => key !== "id")
            .forEach(([key, value]) => {
                checkStringEmpty(key, value)
                checkStringMiniumLength(key, value, 10)
                checkStringMaximumLength(key, value, 100)
            })

        const foundUser = await UserDao.getUser(user.email)
        if (foundUser) {
            throw new ErrorBadRequest("The e-mail used already was inserted.")
        }
    }

    static validateID(id) {
        checkInteger("id", id)
        checkNumberHigherThan0("id", id)
    }

    static setPassHash(user) {
        user.passHash = bcrypt.hashSync(user.passHash, 12)
    }

    static add(user) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.validate(user, true)

                this.setPassHash(user)

                const result = await UserDao.add(user)

                resolve(result)
            } catch (error) {
                console.log("------------")
                reject(error)
            }
        })
    }

    static getUser(user) {
        return UserDao.getUser(user.email)
    }
}