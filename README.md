# Example Chat REST API

--------------------------------------------------------------------------------

## Description

These endpoints allow access to and modification of database resources using HTTP verbs. The available endpoints are described at [Endpoints](#endpoints).

GET requests are straightforward and return JSON representations of the rows requested. Filtering, pagination, and sorting options are available for GET requests that return more than a single resource. For more information, see [Query Options](#query-options).

POST and PUT requests must be made to a URL that contains the parent id, which is then automatically set on the new child row. These requests return the new or modified resource. POST requests should send raw 'application/json' type data to the API endpoints, with each key in this object corresponding to an SQL table attribute you want to populate or modify. The value associated with each key are what get inserted into the Postgres table. Attributes are inserted as is and never modified.

DELETE requests are dangerous and do not ask for confirmation. This should be enforced in the application using the API if this behavior is desired. DELETE requests return the row instance that was deleted.

## Endpoints

### Auditlog

```
GET /auditlog
GET /auditlog/:pk
DELETE /auditlog/:pk
```

### Message

```
GET /message
POST /message
GET /message/:pk
PUT /message/:pk
DELETE /message/:pk
```

## Query Options

The following query strings are available to sort, filter, and provide pagination of resources requested via the API.

### Filtering

Queries can by made on any field in the model using =, <, >, >=, <= symbols. Incorrectly formatted queries are ignored. Queries currently will not work on fields named 'sort', 'fields', 'limit', or 'offset'. Use `&` for queries with logical AND, use `,` for logical OR.

```
GET /message?username=Taylor
GET /message?created_at>2016-03-01&update_at<=2016-04-01
GET /message?created_at>2016-03-01,created_at=2016-04-01
```

### Sorting

Sort in reverse by name, then by start time.

```
GET /message?sort=-username,created_at
```

### Field selection

```
GET /message?fields=username,pk
```

### Pagination

Use limit and offset. The default limit is 20, default offset is 0.

```
GET /message?offset=10&limit=5
```

### Column metadata

Get metadata about columns in table samples

```
GET /message?meta
```

### Distinct values

Get distinct combinations of sample_type and event_id

```
GET /message?fields=username&distinct
```

--------------------------------------------------------------------------------

# Development

## Requirements

This application requires an installation of Node.js and NPM compatible with v6.0.0 and v3.8.6, respectively. All node package dependancies are documented in the `package.json` file and can be installed using the `npm install` command from the terminal. A running copy of Redis is required to store user session information. Apache is also required for configuring the reverse proxy in production.

## References

- [Github repository](https://github.com/raytula/hakai-api)
- [.env file configuration](https://www.npmjs.com/package/dotenv)
- [Koa.js documentation](http://koajs.com/)
- [Knex.js documentation](http://knexjs.org/)

## Installation and Configuration

To run a local version of the service:

- Clone the repo from [github.com/tayden/example-chat-api](https://github.com/tayden/example-chat-api)

- Create a `.env` file in the example-chat-api directory and fill in the following variables

```ini
PORT=8999
DATABASE_URL=your postgres database connection string
LOG_LEVEL={debug|info|warn|error}
DEBUG={true|false}
```

- Install node requirements from `package.json` using `npm install`
- Run the server with `npm start`

The API endpoints will now be available at <http://localhost:8999>. It is often useful to use a tool like [Postman](https://www.getpostman.com/) to test the endpoints. Running the project locally will enable you to access all endpoints without needing an authorization header.

The package.json file also contains a number of scripts to run with PM2, which is a production process manager for Node applications. PM2 can watch the process and restart if it crashes or restart if source files are changed. It allows the API to run continuously as a background process.

To run the project using PM2, first install it globally with `npm install -g pm2`.

### Codebase

The project makes extensive use of Koa, generator functions, and the knex.js database abstraction library. Anyone working on this project should become familiar with these libraries. An understanding to co.js will also be useful, since Koa makes heavy use of this package to provide ES6 async/await-like functionality.

All the generic endpoints define a bunch of middlewares for the request to run through before hitting the function called `action_handler.js`. The action handler accepts an object with attributes set by the middlewares and knows how to construct a SQL query from those attributes. These action objects are then stored in the auditlog table if the query executes successfully. Get queries are not stored by default. This may allow for 'undo/redo' functionality to be implemented at a later date.

## Authors

Taylor Denouden, taylordenouden@gmail.com

_Copyright (c) 2016 Taylor Denouden. All Rights Reserved._
