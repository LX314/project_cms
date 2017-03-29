const config     = require('./config').db;
const mongodb    = require('mongodb');
const db         = mongodb.Db;
const connection = mongodb.Connection;
const server     = mongodb.Server;
module.exports   = new db(config.db, new server(config.host, config.port), { safe: true });