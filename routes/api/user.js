const express = require('express');
const router  = express.Router();
const config  = require('../../config');
const MJJS    = require('../../common/MJJS');
const Cache   = require('../../models/cache');
const User    = require('../../models/user');

router.all('/getUserInfo', (req, res, next) => {
	var token  = req.signedCookies.token;
	Cache.get({
		key: token,
		cb: function(e, o) {
			if (e) return res.redirect(config.link.logout);
			User.get(o.user, function(err, user) {
				res.send({
					code: '0000',
					data: {
						name: user.name,
						image: user.image,
						email: user.email,
						mobile: user.mobile || ''
					},
					message: '成功!'
				});
			});
		}
	});
});


module.exports = router;