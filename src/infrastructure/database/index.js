const sqlite3 = require("sqlite3").verbose()
const connection = new sqlite3.Database("db.sqlite")
const schemas = require("./schemas")
const { promisify } = require("util")

const connectionRun = promisify(connection.run).bind(connection)

module.exports = {
    connection,
    runSchemas: _ => {
        return new Promise(async (resolve, reject) => {
            console.info("Running Database Schemas")
            try {
                for (const [key, content] of Object.entries(schemas)) {
                    console.info(`Schema ${key}`)
                    await connectionRun(content.schema)
                }
                resolve()
            } catch (error) {
                reject(`Error Creating schemas. Error: ${error}`)
            }
        })
    }
}