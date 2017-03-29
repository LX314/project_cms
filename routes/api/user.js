const express = require('express');
const router  = express.Router();
const config  = require('../../config');
const MJJS    = require('../../common/MJJS');
const Cache   = require('../../models/cache');

router.all('/getUserInfo', (req, res, next) => {
	var token  = req.signedCookies.token;
	Cache.get({
		key: token,
		cb: function(e, o) {
			if (e) return res.redirect(config.link.logout);
			res.send(o);
		}
	});
});


module.exports = router;