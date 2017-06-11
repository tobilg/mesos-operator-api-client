"use strict";

// Use the masterClient
const masterClient = require("../index").masterClient;

// Create masterClient instance
const eventsClient = new masterClient({
    masterHost: "172.17.11.102"
});

// Wait for "subscribed" event
eventsClient.on("subscribed", function () {
    console.log("Subscribed to the Mesos Operator API events!");
    // Call GET_AGENTS
    eventsClient.getAgents(function (err, data) {
        console.log("Got result for GET_AGENTS");
        console.log(JSON.stringify(data));
    });
    // Do a reconcile after 3000ms. Demo!
    setTimeout(function () {
        eventsClient.reconcile();
    }, 3000);
});

// Wait for "unsubscribed" event
eventsClient.on("unsubscribed", function () {
    console.log("Unsubscribed from the Mesos Operator API events!");
});

// Catch error events
eventsClient.on("error", function (errorObj) {
    console.log("Got an error");
    console.log(JSON.stringify(errorObj));
});

// Wait for "reconciled" event
eventsClient.on("reconciled", function (stateObj) {
    console.log("Got reconcile");
    console.log(JSON.stringify(stateObj));
});

// Log SUBSCRIBED event
eventsClient.on("SUBSCRIBED", function (eventObj) {
    console.log("Got SUBSCRIBED");
    console.log(JSON.stringify(eventObj));
});

// Log TASK_ADDED event
eventsClient.on("TASK_ADDED", function (eventObj) {
    console.log("Got TASK_ADDED");
    console.log(JSON.stringify(eventObj));
});

// Log TASK_UPDATED event
eventsClient.on("TASK_UPDATED", function (eventObj) {
    console.log("Got TASK_UPDATED");
    console.log(JSON.stringify(eventObj));
});

// Log AGENT_ADDED event
eventsClient.on("AGENT_ADDED", function (eventObj) {
    console.log("Got AGENT_ADDED");
    console.log(JSON.stringify(eventObj));
});

// Log AGENT_REMOVED event
eventsClient.on("AGENT_REMOVED", function (eventObj) {
    console.log("Got AGENT_REMOVED");
    console.log(JSON.stringify(eventObj));
});

// Subscribe to Mesos Operator API events
eventsClient.subscribe();

// Unsubscribe after 10sec. Demo!
setTimeout(function () {
    eventsClient.unsubscribe();
}, 10000);
