const express = require('express');
const app     = express();
const router  = express.Router();
const config  = require('../config');
const MJJS    = require('../common/MJJS');
const http    = require('http');
const Cache   = require('../models/cache');
const USER    = require('./api/user');
const FILE    = require('./api/file');


router.use('/user', USER);
router.use('/file', FILE);

// 所有GET请求处理
router.get('*', function(req, res, next) {
	var token  = req.signedCookies.token,
		userId = req.signedCookies.userId;
	isUser(token, userId, req, res, function() {
		var query    = req.query,
			sign     = MJJS.sort(query, token);
		query.sign   = sign;
		query.userId = userId;
		query.token  = token;
		var url = req.originalUrl.split('?')[0] + '?' + MJJS.format(query);
		if (/\S*(export|download)\S*/.test(req.originalUrl)) {
			http.get(config.api+url, function (rs) {
				rs.setEncoding('binary');
				var Data = '';
				rs.on('data', function (data) {
					Data += data;
				}).on('end', function () {
					var type = rs.headers['content-type'];
					var obj = { 'Content-Type': type };
					if (!/\S*json\S*/.test(type)) obj['Content-Disposition'] = rs.headers['content-disposition'];
					res.writeHead(200, obj);
					res.write(Data, 'binary');
					res.end();
				});
			});
		} else {
			MJJS.http.get(url, function(data, rs) {
				res.cookie('token', token, config.cookieCtrl);
				res.cookie('userId', userId, config.cookieCtrl);
				res.send(data);
			}, function(err) {
				res.send(err);
			});
		}
	});
});

// 文件上传
// router.post('/contract/uploadFile', function(req, res, next) {
// 	var token  = req.signedCookies.token,
// 		userId = req.signedCookies.userId;
// 	isUser(token, userId, req, res, function() {
// 		var formidable = require('formidable');
// 		var form = new formidable.IncomingForm(),
// 			body = req.body,
// 			sign = MJJS.sort(body, token);
// 		body.sign   = sign;
// 		body.userId = userId;
// 		body.token  = token;
// 		form.keepExtensions = true;
// 		form.uploadDir = __dirname.replace('routes', 'upload');
// 		console.log(form.uploadDir);
// 		MJJS.http.mkdir(form.uploadDir, function() {
// 			form.parse(req, function(err, fields, files) {
// 				MJJS.http.file(req.originalUrl, body, files, function(data) {
// 					res.send(data);
// 				}, function(err) {
// 					res.send(err);
// 				});
// 			});
// 		});
// 	});
// });

// 所有POST请求处理
// router.post('*', function(req, res, next) {
// 	var token  = req.signedCookies.token,
// 		userId = req.signedCookies.userId;
// 	isUser(token, userId, req, res, function() {
// 		var isLogout = req.path.indexOf('logout') > -1,
// 			body     = req.body,
// 			sign     = MJJS.sort(body, token);
// 		body.sign    = sign;
// 		body.userId  = userId;
// 		body.token   = token;
// 		MJJS.http.post(req.originalUrl, body, function(data) {
// 			if (!isLogout) {
// 				res.cookie('token', token, config.cookieCtrl);
// 				res.cookie('userId', userId, config.cookieCtrl);
// 			}
// 			res.send(data);
// 		}, function(err) {
// 			res.send(err);
// 		});
// 	});
// });

module.exports = router;
