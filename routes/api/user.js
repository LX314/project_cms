const express = require('express');
const router  = express.Router();
const config  = require('../../config');
const MJJS    = require('../../common/MJJS');
const eventproxy = require('eventproxy');
const Cache   = require('../../models/cache');
const proxy   = require('../../proxy');
const User    = proxy.User;
const Level   = require('../../common/level');

router.all('/getUserInfo', (req, res, next) => {
	var token  = req.signedCookies.token;

	var ep = new eventproxy();
	ep.fail(next);
	ep.on('user_error', function (code) {
		da.message = Code[code];
		res.send(da);
	});

	Cache.get({
		key: token,
		cb: function(e, o) {
			if (e) return res.redirect(config.link.logout);
			User.getUserByLoginName(o.loginname, function (err, user) {
				if (err) {
					return next(err);
				}
				if (!user) {
					return ep.emit('0003');
				}
				res.send({
					code: '0000',
					data: {
						loginname: user.loginname,
						avatar: user.avatar,
						email: user.email,
						level: user.level || 0,
						levelName: Level[user.level] || Level[0]
					},
					message: '成功!'
				});

			});
		}
	});
});


module.exports = router;