const express = require('express');
const router  = express.Router();
const config  = require('../config');
const crypto  = require('crypto');
const User    = require('../models/user');
const Mongo   = require('../models/mongo');
const React   = require('react');
const Router  = require('react-router');


router.get('/', (req, res, next) => {
	res.render('index', {
		config: config,
		title: '首页'
	});
});

module.exports = router;
