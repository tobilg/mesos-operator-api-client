# mesos-operator-api-client

[![Package version](https://img.shields.io/npm/v/mesos-operator-api-client.svg)](https://www.npmjs.com/package/mesos-operator-api-client) [![Package downloads](https://img.shields.io/npm/dt/mesos-operator-api-client.svg)](https://www.npmjs.com/package/mesos-operator-api-client) [![Package license](https://img.shields.io/npm/l/mesos-operator-api-client.svg)](https://www.npmjs.com/package/mesos-operator-api-client)

A generic client to listen to the Mesos Operator API's events.

## Usage

Install as a dependency like this:

```bash
npm install mesos-operator-api-client --save
```

## Events

### Known Mesos Operator API events

As of the [Mesos Operator API documentation](http://mesos.apache.org/documentation/latest/operator-http-api/) and the [Mesos master.proto](https://github.com/apache/mesos/blob/master/include/mesos/v1/master/master.proto#L477) there are currently the following events:

 * `SUBSCRIBED`
 * `TASK_ADDED`
 * `TASK_UPDATED`
 * `AGENT_ADDED`
 * `AGENT_REMOVED`
 
Those events will be emitted by this client as well if they occur.
 
### Internal events

The Mesos Operator API events slient itself emits the following events:

 * `subscribed`: Is emitted after a successful subscription to the Mesos Operator API.
 * `unsubscribed`: Is emitted after `unsubscribe()` is called.
 * `reconciled`: Is emitted after `reconcile()` is called. This queries the Operator API with a separate call to the `GET_STATE` method.
 * `error`: Is emitted in case of internal or upstream errors.

## Using the client

### Options

You can specify the following properties when instantiating the Mesos Operator API events client:

 * `masterHost`: The Mesos Master hostname (or ip address). Default is `leader.mesos`.
 * `masterPort`: The Mesos Master port. Default is `5050`.
 * `masterProtocol`: The Mesos Operator API protocol (`http` or `https`). Default is `http`.
 * `masterApiUri`: The relative path where the Marathon Event Bus endpoint can be found. Default is `/api/v1`.
 * `masterConnectionTimeout`: The time in milliseconds after which the connection to the Mesos Master is deemed as timed out. Default is `5000`.
 * `eventTypes`: An `array` of event types emitted by Marathon (see above for a list). Default is `["SUBSCRIBED", "TASK_ADDED", "TASK_UPDATED", "AGENT_ADDED", "AGENT_REMOVED"]`.
 * `handlers`: A map object consisting of handler functions for the individual Mesos Operator API events. See [below](#handler-functions) for an explanation. No defaults.

### Methods for events

The Mesos Operator API events client only exposes the `subscribe()` and the `unsubscribe()` methods. You can catch all above events via `on(<eventType>, function (data) { ... }`.

### Supported methods for specific Operator API calls

The `callback(error, data)` function is optional, you need to add it only if you directly want to handle the results. Otherwise, those methods will trigger an event (starting with `received_` appended by the lowercase method name, e.g. for `GET_STATE` is `received_get_state`), which applications can listen to to receive the responses in an asynchronous way.

 * `getHealth(callback)`: This calls the `GET_HEALTH` method.
 * `getFlags(callback)`: This calls the `GET_FLAGS` method.
 * `getVersion(callback)`: This calls the `GET_VERSION` method.
 * `getMetrics(callback)`: This calls the `GET_METRICS` method.
 * `getLoggingLevel(callback)`: This calls the `GET_LOGGING_LEVEL` method.
 * `getState(callback)`: This calls the `GET_STATE` method.
 * `getAgents(callback)`: This calls the `GET_AGENTS` method.
 * `getFrameworks(callback)`: This calls the `GET_FRAMEWORKS` method.
 * `getExecutors(callback)`: This calls the `GET_EXECUTORS` method.
 * `getTasks(callback)`: This calls the `GET_TASKS` method.
 * `getRoles(callback)`: This calls the `GET_ROLES` method.
 * `getWeights(callback)`: This calls the `GET_WEIGHTS` method.
 * `getMaster(callback)`: This calls the `GET_MASTER` method.
 * `getMaintenanceStatus(callback)`: This calls the `GET_MAINTENANCE_STATUS` method.
 * `getMaintenanceSchedule(callback)`: This calls the `GET_MAINTENANCE_SCHEDULE` method.
 * `getQuota(callback)`: This calls the `GET_QUOTA` method.

### Event handler functions

The custom event handler functions can be configured by setting a map object as `handlers` property during the instantiation. Each map object's property represents a event handling function. The property name needs to match on of the Marathon event types from the [list of known Marathon events](#known-marathon-events).

This is an example `handlers` map object:

```javascript
{ // Specify the custom event handlers
    "TASK_ADDED": function (data) {
        console.log("We have a new TASK_ADDED event!");
    },
    "TASK_UPDATED": function (data) {
        console.log("We have a new TASK_UPDATED event!");
    }
}
```

The function arguments are:

 * `data`: The emitted data for the respective event

### Example code

For a complete example, have a look at [examples/example.js](examples/example.js).

```javascript
"use strict";

// Use the MesosOperatorApiClient
const MesosOperatorApiClient = require("mesos-operator-api-client");

// Create MesosOperatorApiClient instance
const eventsClient = new MesosOperatorApiClient({
    masterHost: "172.17.11.101" // Replace with your Mesos Leader hostname or ip address
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
```
