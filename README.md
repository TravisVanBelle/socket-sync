# SocketSync

A simple library for Socket.io. Easily create non-authoritative
servers that maintain game state across clients.

## How it works

In non-authoritative servers, each client is responsible for maintaining their own state. The server's only job is to keep all clients updated and informed about each other's states.

SocketSync works by providing an API for clients to send their state to the server and get the states of the other clients.

This library does this by working with two types of data:

* User data: Each player's own state that gets updated when needed. (Ex. position).
* Instant data: A notification that an event occurred, with corresponding data. (Ex. a bullet was shot).


## Getting started

Include `sync.js` in your project. Look at `index.js` for an example of how to
initialize the library before using the following API.

## Usage

This library provides a series of endpoints that clients can emit or listen for
on the Socket.io object after making a connection.

### Emit

#### `join(data)`

The client joins the room and becomes part of the instance. Pass in initial user data as a parameter.

#### `disconnect()`

The client leaves the room and user data is destroyed.

#### `sendUpdate(data)`

The client sends an updated state to the server.

#### `requestUpdate()`

The client notifies the server that it wishes to obtain an updated state.

#### `sendInstant(data)`

The client sends data to the server that will be immediately broadcast to all other connected clients. This data is not maintained by the server as part of the state.

### Listen for


#### `getUpdate(data)`

The server sends the updated instance data to the client.

#### `getInstant(data)`

The server sends an instant data object for all clients to handle.
