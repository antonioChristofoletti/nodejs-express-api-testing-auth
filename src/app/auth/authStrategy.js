const passport = require("passport")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const config = require("config")

const LocalStrategy = require("passport-local").Strategy
const BearerStrategy = require("passport-http-bearer").Strategy

const ErrorBadRequest = require("../errors/errorBadRequest")
const User = require("../model/user")
const UserController = require("../controller/userController")
const UserDao = require("../dao/userDao")

const blacklistManager = require("./redis/blacklistManager")

const { promisify } = require("util")
const ErrorNotFound = require("../errors/errorNotFound")
const asyncJWTVerify = promisify(jwt.verify).bind(jwt)

passport.use(
    new LocalStrategy({
        usernameField: "email",
        passportField: "password",
        session: false
    }, async (email, password, done) => {
        try {
            const foundUser = await UserController.getUser(new User({ email }))

            if (!foundUser) {
                done(new ErrorBadRequest("The user or the password is invalid."))
            }

            await checkPassword(password, foundUser.passHash)

            done(null, foundUser)
        } catch (error) {
            done(error)
        }
    })
)

passport.use(
    new BearerStrategy(
        async (token, done) => {
            try {
                if (!token) {
                    done(new ErrorBadRequest("Check the token It was sent."))
                    return
                }

                await checkTokenBlackList(token)

                const payLoad = await getPayLoadToken(token)

                const user = await UserDao.getUser(new User({ id: payLoad.id }))

                if(!user) {
                    done(new ErrorNotFound("The user was not found."))
                    return
                }

                done(null, user, { token: token })
            } catch (error) {
                done(error)
            }
        }
    )
)

async function getPayLoadToken(token) {
    try {
        const payLoad = await asyncJWTVerify(token, config.get("auth.privateKey"))
        return payLoad
    } catch (error) {
        throw new ErrorBadRequest(`The token is invalid. Error: ${error.message}`)
    }
}

async function checkTokenBlackList(token) {
    const hasToken = await blacklistManager.hasToken(token)
    if (hasToken) {
        throw new ErrorBadRequest("Token is invalid by logout")
    }
}

async function checkPassword(password, passHash) {
    const validPass = await bcrypt.compare(password, passHash)

    if (!validPass) {
        throw new ErrorBadRequest("The user or the password is invalid.")
    }
}

function createTokenJWT(user) {
    const payload = { id: user.id }

    const jwtKey = config.get("auth.privateKey")
    const expiresIn = config.get("auth.expiresIn")

    const token = jwt.sign(payload, jwtKey, {
        expiresIn: expiresIn
    })

    return token
}

module.exports = {
    createTokenJWT
}