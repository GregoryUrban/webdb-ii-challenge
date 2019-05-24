const express = require('express');
const helmet = require('helmet');

const zoosRouter = require('./zoos/zoos-Router.js');


const server = express();

server.use(helmet());
server.use(express.json());

server.use('/api/zoos', zoosRouter);
const bearsRouter = require('./zoos/bears-Router.js');
server.use('/api/bears', bearsRouter);


module.exports = server;
