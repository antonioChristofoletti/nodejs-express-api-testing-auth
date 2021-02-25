const passport = require("passport")
const ErrorBadRequest = require("../errors/errorBadRequest")

module.exports = {
    local: (req, res, next) => {
        passport.authenticate(
            "local",
            { session: false },
            (error, user, info) => {
                if (error) {
                    next(error)
                    return
                }

                if (!user) {
                    next(new ErrorBadRequest(`${info.message}. User email and password.`))
                    return
                }

                req.user = user
                next()
            }
        )(req, res, next)
    },
    bearer: (req, res, next) => {
        passport.authenticate(
            "bearer",
            { session: false },
            (error, user, info) => {
                if (error) {
                    next(error)
                    return
                }

                if (!user) {
                    next(new ErrorBadRequest("Check the token It was sent."))
                    return
                }

                req.token = info.token
                req.user = user
                next()
            }
        )(req, res, next)
    }
}