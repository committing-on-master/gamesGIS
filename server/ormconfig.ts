module.exports = [
    {
        name: "in-memory",
        type: "sqlite",
        database: ":memory:",
        synchronize: true,
        entities: [__dirname + "\\dist\\src\\data-layer\\models\\*.db.js"],
        logging: ["query", "error", "info", "log"]
    },
    {
        name: "production",
        type: "sqlite",
        database: "test.db",
        // dropSchema: true,
        entities: [__dirname + "\\dist\\src\\data-layer\\models\\*db.js"],
        logging: ["query", "error", "info", "log"]
    }
]