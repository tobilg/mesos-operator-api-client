"use strict";

// Use the MesosOperatorApiEventsClient
const MesosOperatorApiEventsClient = require("../index");

// Create MesosOperatorApiEventsClient instance
const eventsClient = new MesosOperatorApiEventsClient({
    masterHost: "172.17.11.102"
});

// Wait for "subscribed" event
eventsClient.on("subscribed", function () {
    console.log("Subscribed to the Mesos Operator API events!");
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

// Subscribe to Mesos Operator API events
eventsClient.subscribe();

// Unsubscribe after 10sec. Demo!
setTimeout(function () {
    eventsClient.unsubscribe();
}, 10000);
