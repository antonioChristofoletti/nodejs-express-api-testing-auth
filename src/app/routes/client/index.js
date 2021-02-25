const ClientSerializer = require("../../../infrastructure/serialize/clientSerializer")

const ClientController = require("../../controller/clientController")
const Client = require("../../model/client")

const authRouteMiddleware = require("../../auth/authRouteMiddleware")

const router = require("express").Router()

router.options("/", (req, res) => {
    res.set("Acess-Control-Allow-Methods", "GET, POST, PATCH, DELETE")
    res.set("Acess-Control-Allow-Headers", "Content-type")
})

router.get("/", authRouteMiddleware.bearer, (req, res, next) => {
    ClientController.getAll()
        .then(result => {
            const serializer = new ClientSerializer(res.getHeader("Content-type"))
            res.status(200).send(serializer.serialize(result))
        })
        .catch(error => next(error))
})

router.get("/:id", authRouteMiddleware.bearer, (req, res, next) => {
    ClientController.getClient(req.params.id)
        .then(result => {
            const serializer = new ClientSerializer(res.getHeader("Content-type"))
            res.status(200).send(serializer.serialize(result))
        })
        .catch(error => next(error))
})

router.post("/", authRouteMiddleware.bearer, (req, res, next) => {
    const client = new Client(req.body)

    ClientController.add(client)
        .then(result => {
            const serializer = new ClientSerializer(res.getHeader("Content-type"))
            res.status(201).send(serializer.serialize(result))
        })
        .catch(error => next(error))
})

router.patch("/:id", (req, res, next) => {
    const reqBody = req.body
    reqBody.id = req.params.id

    const client = new Client(reqBody)

    ClientController.update(client)
        .then(_ => {
            res.status(200).send()
        })
        .catch(error => next(error))
})

router.delete("/:id", (req, res, next) => {
    ClientController.delete(req.params.id)
        .then(_ => {
            const serializer = new ClientSerializer(res.getHeader("Content-type"))
            res.status(200).end()
        })
        .catch(error => next(error))
})

module.exports = router