// const express = require('express');
// const helmet = require('helmet');

// const server = express();
const server = require('./server.js');


// server.use(express.json());
// server.use(helmet());

// endpoints in zoos-Router.js, passed into Server.js, passed into here

const port = 5000;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
