import dotenv from "dotenv"
import express from "express"
import { configure, getLogger } from "log4js";
import path from "path"

// Загрузили конфигу в глобальную переменную process
dotenv.config({path: "./config/.env"});

// Крутим логгер
configure("./config/log4js.json");
// const logger = getLogger();

// Стартуем express.js
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (request, response) => {
    response.sendFile(path.resolve(__dirname, "spa/index.html"));
    //response.send('Hello world!');

});
app.listen(port, () => console.log(`Running on port ${port}`));