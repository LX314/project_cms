const express = require('express');
const router  = express.Router();
const config  = require('../config');
const eventproxy = require('eventproxy');
const crypto  = require('crypto');
const Cache   = require('../models/cache');
const Code    = require('../common/code');
const proxy   = require('../proxy');
const User    = proxy.User;

// router.get('/', User.isNotLogin);
router.get('/', (req, res, next) => {
	res.render('login', {
		config: config,
		title: '登录'
	});
});


router.post('/', (req, res, next) => {
	var body      = req.body,
		loginname = body.loginname,
		password  = body.password;

	var da = {
		code: '9999',
		message: '数据异常!',
		data: null
	};

	var ep = new eventproxy();
	ep.fail(next);
	ep.on('login_error', function (code) {
		da.message = Code[code];
		res.send(da);
	});

	// 验证信息的正确性
	if ([loginname, password].some((_) => { return _ === ''; })) {
		ep.emit('prop_err', '0002');
		return;
	}

	// 生成密码的 hash 值
	const passhash = crypto.createHmac('sha256', config.passSecret).update(password).digest('hex');
	
	// 正则校验
	var emailRE  = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,
		nameRE     = /^([a-zA-Z0-9_-])+$/,
		phoneRE    = /^1(3|4|5|7|8)\d{9}$/,
		passwordRE = /^[A-Za-z0-9]{6,20}$/,		// 6-20位字母数字组合
		isLetter   = /[A-Za-z]+/,
		isNumber   = /[\d]+/;

	var getUser   = User.getUserByLoginName;

	if (emailRE.test(loginname)) getUser = User.getUserByMail;

	// 检查用户名是否已经存在
	getUser(loginname, function (err, user) {
		if (err) {
			return next(err);
		}

		if (!user) {
			return ep.emit('0003');
		}

		if (passhash != user.password) {
			return ep.emit('0004');
		}

		var token = crypto.createHmac('sha256', config.passSecret).update(user.accessToken+ new Date()*1).digest('hex');

		Cache.save({
			key: token,
			data: { loginname: user.loginname },
			cb: function(o) {
				res.cookie('token', token, config.cookieCtrl);
				res.cookie('loginname', user.loginname, config.cookieCtrl);
				res.redirect(config.link.index)
			}
		});
	});
});


module.exports = router;
