const winston = require("winston");


module.exports = function (err, req, res, next) {
    // logger.error(err.message,err);
    const logger = winston.createLogger({
        level: "info",
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
        transports: [
            // new winston.transports.File({ filename: "error.log", level: "warn" }),
            new winston.transports.File({ filename: "app.log", level: "info" }),
        ],
    });
    logger.error(err.message, err);
    console.error(err);

    res.status(500).send('Something Failed');
}