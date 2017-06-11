"use strict";

const EventEmitter = require("events").EventEmitter;
const util = require("util");

const helpers = require("../helpers");

/**
 * Represents a mesos Event Bus Client
 * @constructor
 * @param {object} options - The option map object.
 */
function AgentClient (options) {

    if (!(this instanceof AgentClient)) {
        return new AgentClient(options);
    }

    // Inherit from EventEmitter
    EventEmitter.call(this);

    let self = this;

    // Add the allowed Operator API methods
    self.allowedApiCalls = helpers.getSupportedAgentApiCalls();

    // Options dict
    self.options = {};

    // mesos endpoint discovery
    self.options.agentHost = options.agentHost || "127.0.0.1";
    self.options.agentPort = parseInt(options.agentPort) || 5051;
    self.options.agentProtocol = options.agentProtocol || "http";
    self.options.agentApiUri = options.agentApiUri || "/api/v1";
    self.options.agentConnectionTimeout = options.agentConnectionTimeout || 5000;

    // Logging
    self.logger = helpers.getLogger((options.logging && options.logging.path ? options.logging.path : null), (options.logging && options.logging.fileName ? options.logging.fileName : null), (options.logging && options.logging.level ? options.logging.level : null));

    // Template for issuing Mesos Scheduler HTTP API requests
    self.requestTemplate = {};

    // Poplate request template
    self.generateRequestTemplate = function () {
        self.requestTemplate = {
            host: self.options.agentHost,
            port: self.options.agentPort,
            path: self.options.agentApiUri,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };
    };

    // Fill the requestTemplate
    self.generateRequestTemplate();

    // Add supported Operator API methods as functions
    self.allowedApiCalls.forEach(function (apiCall) {
        // Add supported methods
        self[helpers.getFunctionNameFromApiCalls(apiCall)] = function (callback) {
            // Populate request body
            const requestBody = {
                "type": apiCall
            };
            // Do the call to the Operator API
            helpers.doRequest.call(self, requestBody, function (error, response) {
                if (error) {
                    // Emit error event
                    self.emit("error", error.message);
                    // Check if callback is added, if so, trigger it
                    if (callback) {
                        callback(error, null);
                    }
                } else {
                    // Parse response
                    let body = JSON.parse(response.body)[apiCall.toLowerCase()];
                    // Emit individual event for method
                    self.emit(helpers.getEventNameFromApiMethod(apiCall), body);
                    // Check if callback is added, if so, trigger it
                    if (callback) {
                        callback(null, body);
                    }
                }
            });
        };
    });

}

// Inherit from EventEmitter
util.inherits(AgentClient, EventEmitter);

module.exports = AgentClient;
