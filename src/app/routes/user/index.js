const router = require("express").Router()

const UserSerializer = require("../../../infrastructure/serialize/userSerializer")
const authRouteMiddleware = require("../../auth/authRouteMiddleware")
const { createTokenJWT } = require("../../auth/authStrategy")
const UserController = require("../../controller/userController")
const User = require("../../model/user")

router.options("/", (req, res) => {
    res.set("Acess-Control-Allow-Methods", "POST")
    res.set("Acess-Control-Allow-Headers", "Content-type")
})

router.route("/login").post(
    authRouteMiddleware.local,
    (req, res, next) => {
        try {
            const user = req.user
            const token = createTokenJWT(user)
            res.set("Authorization", token)
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    })

router.post("/", (req, res, next) => {
    const user = new User(req.body)

    UserController.add(user)
        .then(result => {
            const serializer = new UserSerializer(res.getHeader("Content-type"))
            res.status(201).send(serializer.serialize(result))
        })
        .catch(error => next(error))
})

module.exports = router