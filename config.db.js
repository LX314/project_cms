const mongodb    = require('mongodb');
const db         = mongodb.Db;
const server     = mongodb.Server;
module.exports   = new db('cms', new server('localhost', 27017), { safe: true });