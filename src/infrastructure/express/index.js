const express = require("express")
const bodyParser = require("body-parser")
const ErrorSerializer = require("../serialize/errorSerializer")
const ErrorNotAcceptable = require("../../app/errors/errorNotAcceptable")
const { allowedFormats, defaultFormat } = require("../serialize/serializer")
const ErrorBase = require("../../app/errors/errorBase")

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//External Access Handler
app.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*")
    next()
})

//Content-Type Handler
app.use((req, res, next) => {
    const headerAccept = req.header("Accept")
    const requestFormat = headerAccept === "*/*" ? defaultFormat : headerAccept
    const hasType = allowedFormats.map(item => item.type).filter(item => item === requestFormat)[0]

    if (!hasType) {
        const allowedTypesText = allowedFormats.map(item => item.type)
        res.setHeader("Content-Type", defaultFormat)
        throw new ErrorNotAcceptable(`The 'Accept' is not supported. Try using: ${allowedTypesText}`)
    }

    res.setHeader("Content-Type", requestFormat)
    next()
})

app.use('/api/client', require('../../app/routes/client'))
app.use('/api/user', require('../../app/routes/user'))

//Error Handler
app.use((error, req, res, next) => {
    const serializer = new ErrorSerializer(res.getHeader("Content-type"))

    const isInheritedFromErrorBase = error instanceof ErrorBase
    const isCode500 = error.code === 500

    const code = isInheritedFromErrorBase && !isCode500 ? error.code : 500
    const message = isInheritedFromErrorBase && !isCode500 ? error.message : "unexpected Internal Error"

    console.error(error)

    res.status(code).send(serializer.serialize({
        code,
        message
    }))
})

module.exports = app