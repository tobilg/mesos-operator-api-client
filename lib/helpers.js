"use strict";

const http = require("http");
const winston = require('winston');

module.exports = {

    getLogger: function(path, fileName, logLevel) {

        const logger = new (winston.Logger)({
            transports: [
                new (winston.transports.Console)({ level: logLevel || "error" }),
                new (require("winston-daily-rotate-file"))({
                    filename: (path && fileName ? path + "/" + fileName : "logs/mesos-operator-api-events.log"),
                    level: logLevel || "error",
                    prepend: true,
                    json: false
                })
            ]
        });

        return logger;

    },

    isFunction: function(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    }

};