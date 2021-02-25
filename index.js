const db = require("./src/infrastructure/database")
const app = require("./src/infrastructure/express")
const config = require("config")

db.runSchemas()
    .then(_ => {
        app.listen(config.get("api.port"), _ => console.log("The API has started"))
    })
    .catch(error => {
        console.error(`The API can not keep going: ${error}`)
    })