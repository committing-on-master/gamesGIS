module.exports = [
    {
        name: "in-memory",
        type: "sqlite",
        database: ":memory:",
        synchronize: true,
        entities: [__dirname + "\\dist\\src\\data-layer\\models\\*.dao.js"],
        logging: ["query", "error", "info", "log"]
    },
    {
        name: "production",
        type: "sqlite",
        database: "database/test.db",
        // dropSchema: true,
        // synchronize: true,
        entities: [__dirname + "\\dist\\src\\data-layer\\models\\*.dao.js"],
        logging: ["query", "error", "info", "log"]
    }
]