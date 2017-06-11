"use strict";

// Use the agentClient
const agentClient = require("../index").agentClient;

// Create agentClient instance
const agent = new agentClient({
    agentHost: "172.17.11.102"
});

// Call GET_HEALTH
agent.getContainers(function (err, data) {
    console.log(JSON.stringify(data));
});

