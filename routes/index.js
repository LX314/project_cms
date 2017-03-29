const express = require('express');
const router  = express.Router();
const config  = require('../config');
const crypto  = require('crypto');
const User    = require('../models/user');
const Mongo   = require('../models/mongo');


router.get('/', (req, res, next) => {
	res.render('index', {
		config: config,
		title: '首页'
	});
});

module.exports = router;
