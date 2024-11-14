# Chat app
Chat app is an API for creating chat rooms and sending messages to other members of the room via websockets.


## Pre-requirements

1) Node.js and Docker

## Running the app locally
1) Start the database with `docker compose up db`
2) Migrate the database with `yarn run migrate:deploy`
3) Install dependencies with `yarn install`
4) Start the dev server with `yarn run start:dev`
5) The API will run on http://localhost:5000


## Running the app with docker compose
1) Run `docker compose up` 
2) The API will run on http://localhost:5000
