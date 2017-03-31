const mongoose = require('mongoose');
const config   = require('../config');

mongoose.Promise = global.Promise;
mongoose.connect(config.db, {
	server: { poolSize: 20 }
}, function (err) {
	if (err) process.exit(1);
});

// models
require('./user');

exports.User = mongoose.model('User');