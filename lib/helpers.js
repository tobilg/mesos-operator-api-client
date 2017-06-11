"use strict";

const http = require("http");
const winston = require("winston");

const masterCalls = require("./master/masterCalls");
const agentCalls = require("./agent/agentCalls");

module.exports = {

    getLogger: function(path, fileName, logLevel) {

        const logger = new (winston.Logger)({
            transports: [
                new (winston.transports.Console)({ level: logLevel || "error" }),
                new (require("winston-daily-rotate-file"))({
                    filename: (path && fileName ? path + "/" + fileName : "logs/mesos-operator-api.log"),
                    level: logLevel || "error",
                    prepend: true,
                    json: false
                })
            ]
        });

        return logger;

    },

    getSupportedMasterApiCalls: function () {
        let calls = [];
        Object.getOwnPropertyNames(masterCalls).forEach(function (apiCall) {
            if (masterCalls[apiCall].supported) {
                calls.push(apiCall);
            }
        });
        return calls;
    },

    getSupportedAgentApiCalls: function () {
        let calls = [];
        Object.getOwnPropertyNames(agentCalls).forEach(function (apiCall) {
            if (agentCalls[apiCall].supported) {
                calls.push(apiCall);
            }
        });
        return calls;
    },

    getFunctionNameFromApiCalls: function (apiCall) {
        let lcApiCall = apiCall.toLowerCase();
        let functionName = "";
        let temp = lcApiCall.split("_");
        let i = 0;
        temp.forEach(function (namePart) {
            if (i === 0) {
                functionName += namePart;
            } else {
                functionName += namePart.substring(0, 1).toUpperCase() + namePart.substring(1, namePart.length);
            }
            i++;
        });
        return functionName;
    },

    getEventNameFromApiMethod: function (apiCall) {
        let lcApiMethod = apiCall.toLowerCase();
        let eventName = "received_";
        let temp = lcApiMethod.split("_");
        temp.forEach(function (namePart) {
            eventName += "_" + namePart;
        });
        return eventName;
    },

    doRequest: function (payload, callback) {

        let self = this;

        let req = http.request(self.requestTemplate, function (res) {

            // Set encoding
            res.setEncoding("utf8");

            // Buffer for the response body
            let body = "";

            res.on("data", function (chunk) {
                body += chunk;
            });

            // Watch for errors of the response
            res.on("error", function (e) {
                callback({ message: "There was a problem with the response: " + e.message }, null);
            });

            res.on("end", function () {
                if (res.statusCode !== 200) {
                    callback({ message: "Request was not accepted properly. Reponse status code was '" + res.statusCode + "'. Body was '" + body + "'." }, null);
                } else {
                    callback(null, { statusCode: res.statusCode, body: body });
                }
            });

        });

        // Watch for errors of the request
        req.on("error", function (e) {
            callback({ message: "There was a problem with the request: " + e.message }, null);
        });

        // Write data to request body
        req.write(JSON.stringify(payload));

        // End request
        req.end();

    },

    isFunction: function(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    }

};