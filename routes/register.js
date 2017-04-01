const express = require('express');
const router  = express.Router();
const config  = require('../config');
const MJJS    = require('../common/MJJS');
const File    = require('../models/file');
const eventproxy = require('eventproxy');
const crypto  = require('crypto');
const Code    = require('../common/code');
const proxy   = require('../proxy');
const User    = proxy.User;

const formidable = require('formidable');

// 注册界面
router.get('/', (req, res, next) => {
	// res.render('register', {
	res.render('register2', {
		config: config,
		title: '注册',
		user: req.session.user
	});
});

// 用户注册
router.post('/', (req, res, next) => {
	var body      = req.body,
		loginname = body.loginname,
		password  = body.password,
		passwordR = body.passwordR,
		email     = body.email;

	var md5        = crypto.createHash('md5'),
		emailRE    = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,
		nameRE     = /^([a-zA-Z0-9_-])+$/,
		phoneRE    = /^1(3|4|5|7|8)\d{9}$/,
		passwordRE = /^[A-Za-z0-9]{6,20}$/,		// 6-20位字母数字组合
		isLetter   = /[A-Za-z]+/,
		isNumber   = /[\d]+/;

	var da = {
		code: '9999',
		message: '数据异常',
		data: null
	};

	var ep = new eventproxy();
	ep.fail(next);
	ep.on('prop_err', function (code) {
		da.message = Code[code];
		res.send(da);
	});

	// 验证信息的正确性
	if ([loginname, password, passwordR, email].some((_) => { return _ === ''; })) {
		return ep.emit('prop_err', '0021');
	}

	// 检验用户名是否正确
	if (!nameRE.test(loginname)) {
		return ep.emit('prop_err', '0022');
	}

	// 检验密码是否正确
	if (!passwordRE.test(password) || (!isLetter.test(password) || !isNumber.test(password))) {
		return ep.emit('prop_err', '0023');
	}

	// 检验用户两次输入的密码是否一致
	if (passwordR != password) {
		return ep.emit('prop_err', '0024');
	}

	// 检验邮箱是否正确
	if (!emailRE.test(email)) {
		return ep.emit('prop_err', '0025');
	}

	// 正则校验
	var emailRE  = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,
		nameRE     = /^([a-zA-Z0-9_-])+$/,
		phoneRE    = /^1(3|4|5|7|8)\d{9}$/,
		passwordRE = /^[A-Za-z0-9]{6,20}$/,		// 6-20位字母数字组合
		isLetter   = /[A-Za-z]+/,
		isNumber   = /[\d]+/;

	// 检查用户名是否已经存在
	User.getUsersByQuery({'$or': [
		{ 'loginname': loginname },
		{ 'email': email }
	]}, {}, function (err, users) {
		if (err) {
			return next(err);
		}
		if (users.length) {
			return ep.emit('prop_err', '0026');
		}

		const passhash = crypto.createHmac('sha256', config.passSecret).update(password).digest('hex');
		const avatar   = User.createAvatar();
		// ep.done(function () {
			User.addUser(loginname, passhash, email, avatar, false, function (err) {
				if (err) {
					da.code = '0027';
					da.message = Code[da.code];
					return res.send(da);
				}
				da.code = '0000';
				da.message = '注册成功!';
				res.send(da);
			});
		// });
	});
});

module.exports = router;
