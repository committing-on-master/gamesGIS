module.exports = [
    {
        name: "in-memory",
        type: "sqlite",
        database: ":memory:",
        synchronize: true,
        entities: [__dirname + "\\dist\\src\\data-layer\\models\\*.dao.js"],
        logging: ["query", "error", "info", "log"],
        migrations: [__dirname + "\\dist\\migrations\\*.js"],
        cli: {
            "migrationsDir": __dirname + "\\dist\\migrations",
        },
    },
    {
        name: "develop",
        type: "sqlite",
        database: "database/test.db",
        // dropSchema: true,
        synchronize: true,
        entities: ["./src/data-layer/models/*.dao.ts"],
        logging: ["query", "error", "info", "log"],
        migrations: ["./migrations/*.ts"],
        cli: {
            "migrationsDir": "./migrations",
        },
    },
];
