module.exports = {
    schema: `
    CREATE TABLE IF NOT EXISTS Client (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100)
    )
`
}