const express = require('express');
const router  = express.Router();
const config  = require('../config');
const MJJS    = require('../common/MJJS');
const crypto  = require('crypto');
const User    = require('../models/user');

// 注册界面
router.get('/', (req, res, next) => {
	res.render('register', {
		config: config,
		title: '注册',
		user: req.session.user
	});
});

// 用户注册
router.post('/', (req, res, next) => {
	var body      = req.body,
		name      = body.name,
		password  = body.password,
		passwordR = body.passwordR;
	var da = {
		code: '9999',
		message: '数据异常',
		data: null
	};
	// 检验用户两次输入的密码是否一致
	if (passwordR != password) {
		da.code = '0010';
		da.message = '两次输入的密码不一致!';
		console.log(da);
		return res.send(da);
	}
	// 生成密码的 md5 值
	var md5      = crypto.createHash('md5'),
		password = md5.update(password).digest('hex'),
		newUser  = {
			name:     name,
			password: password
		};
	// 检查用户名是否已经存在
	User.get(name, function(err, user) {
		if (err) {
			console.log(da);
			return res.send(da);
		}
		if (user) {
			da.code = '0009';
			da.message = '用户已存在!';
			console.log(da);
			return res.send(da);
		}
		// 如果不存在则新增用户
		User.save(newUser, function (err, user) {
			if (err) {
				da.code = '0014';
				da.message = '注册失败!';
				console.log(da);
				return res.send(da);
			}
			req.session.user = user;			// 用户信息存入 session
			da.code = '0000';
			da.message = '注册成功!';
			da.data = user;
			console.log(da);
			res.send(da);
		});
	});
});

module.exports = router;
