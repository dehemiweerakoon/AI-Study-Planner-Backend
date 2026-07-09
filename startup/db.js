const mongoose = require("mongoose");
const winston = require("winston");
const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
});

module.exports = function () {
    mongoose
        .connect(process.env.DATABASE_URL) // auto matically create a database
        .then(() => logger.info("Connected to the Database"))
        .catch((error) => {
        logger.error(error);
        });
};
