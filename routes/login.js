const express = require('express');
const router  = express.Router();
const config  = require('../config');
const crypto  = require('crypto');
const User    = require('../models/user');
const Cache   = require('../models/cache');
const code    = require('../common/code');

router.get('/', User.isNotLogin);
router.get('/', (req, res, next) => {
	res.render('login', {
		config: config,
		title: '登录'
	});
});


router.post('/', (req, res, next) => {
	var body     = req.body,
		name     = body.name,
		password = body.password;
	var da = {
		code: '9999',
		message: '数据异常!',
		data: null
	};
	// 生成密码的 md5 值
	var md5      = crypto.createHash('md5'),
		password = md5.update(password).digest('hex');
	// 检查用户是否已经存在
	User.get(name, function(err, user) {
		if (err) {
			console.log(da);
			return res.send(da);
		}
		if (!user) {
			da.code = '0007';
			da.message = code[da.code];
			console.log(da);
			return res.send(da);
		}
		// 检查密码是否一致
		if (user.password != password) {
			da.code = '0008';
			da.message = code[da.code];
			console.log(da);
			return res.send(da);
		}
		// 用户名密码都匹配后, 将用户信息存入 session
		req.session.user = user;			// 用户信息存入 session
		da.code = '0000';
		da.message = '登录成功!';
		console.log(da, user);
		var sha   = crypto.createHash('sha256'),
			token = sha.update(user.name).digest('hex');
		da.data = token;
		Cache.save({
			key: token,
			data: { user: user.name },
			cb: function(o) {
				res.cookie('token', token, config.cookieCtrl);
				res.cookie('username', user.name, config.cookieCtrl);
				res.redirect(config.link.index)
			}
		});
	});
});


module.exports = router;
