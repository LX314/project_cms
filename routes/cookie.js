const express = require('express');
const router  = express.Router();
const config  = require('../config');
const crypto  = require('crypto');
const Cache   = require('../models/cache');

router.get('*', (req, res, next) => {
	var token    = req.signedCookies.token;
	var username = req.signedCookies.username;
	if (token && username) {
		Cache.get({
			key: token,
			cb: function(e, o) {
				return e? res.redirect(config.link.logout)
				: next();
			}
		});
	} else {
		return res.redirect(config.link.login);
	}
});

module.exports = router;
