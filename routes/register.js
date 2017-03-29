const express = require('express');
const router  = express.Router();
const config  = require('../config');
const MJJS    = require('../common/MJJS');
const File    = require('../models/file');
const crypto  = require('crypto');
const User    = require('../models/user');

const formidable = require('formidable');

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
	// 检查头像是否上传
	var form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.uploadDir = config.dir.upload;
	MJJS.http.mkdir(form.uploadDir, function() {
		let files = [];
		form.on('file', function(filed, file) {
			if (file.size) files.push([filed, file]);
		});
		form.parse(req, function(err, fields) {
			var name      = fields.name,
				password  = fields.password,
				passwordR = fields.passwordR;
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
			if (err) {
				console.log(err);
				da.code = '0100';
				da.message = code[da.code];
				return res.send(da);
			}
			if (!files.length) {
				da.code = '0003';
				da.message = code[da.code];
				return res.send(da);
			}
			File.upload('user', name, files, function(len, urls) {
				if (len) {
					// 生成密码的 md5 值
					var md5      = crypto.createHash('md5'),
						emailRE  = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,
						phoneRE  = /^1(3|4|5|7|8)\d{9}$/;
					
					password = md5.update(password).digest('hex');
					var newUser  = {
							name:     name,
							password: password,
							image: urls[0]
						};
						if (emailRE.test(name)) newUser.email = name;
						if (phoneRE.test(name)) newUser.mobile = name;
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
				} else {
					da.code = '0002';
					da.message = code[da.code];
					return res.send(da);
				}
			});
		});
	});
});

module.exports = router;
