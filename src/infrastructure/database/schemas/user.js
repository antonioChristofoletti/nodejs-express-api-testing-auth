module.exports = {
    schema: `
    CREATE TABLE IF NOT EXISTS User (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        passHash VARCHAR(255) NOT NULL
    )
`
}