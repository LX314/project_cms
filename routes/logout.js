const express = require('express');
const router  = express.Router();
const config  = require('../config');
const MJJS    = require('../common/MJJS');

router.get('/', (req, res, next) => {
	var token     = req.signedCookies.token;
	var loginname = req.signedCookies.loginname;
	res.clearCookie('token');
	res.clearCookie('loginname');
	res.redirect(config.link.index);
	// if (token) {
	// 	res.redirect(config.link.index);
	// } else {
	// 	res.redirect(config.link.index);
	// }
});

module.exports = router;
