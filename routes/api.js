const express = require('express');
const app     = express();
const router  = express.Router();
const config  = require('../config');
const MJJS    = require('../common/MJJS');
const code    = require('../common/code');
const http    = require('http');
const Cache   = require('../models/cache');
const USER    = require('./api/user');
const FILE    = require('./api/file');

router.all('*', (req, res, next) => {
	var token     = req.signedCookies.token;
	var loginname = req.signedCookies.loginname;
	if (token && loginname) {
		next();
	} else {
		res.send({
			code: '0001',
			message: code['0001']
		});
	}
});

router.use('/user', USER);
router.use('/file', FILE);

// 所有GET请求处理
// router.get('*', (req, res, next) => {
// 	var token  = req.signedCookies.token,
// 		userId = req.signedCookies.userId;
// 	isUser(token, userId, req, res, function() {
// 		var query    = req.query,
// 			sign     = MJJS.sort(query, token);
// 		query.sign   = sign;
// 		query.userId = userId;
// 		query.token  = token;
// 		var url = req.originalUrl.split('?')[0] + '?' + MJJS.format(query);
// 		if (/\S*(export|download)\S*/.test(req.originalUrl)) {
// 			http.get(config.api+url, function (rs) {
// 				rs.setEncoding('binary');
// 				var Data = '';
// 				rs.on('data', function (data) {
// 					Data += data;
// 				}).on('end', function () {
// 					var type = rs.headers['content-type'];
// 					var obj = { 'Content-Type': type };
// 					if (!/\S*json\S*/.test(type)) obj['Content-Disposition'] = rs.headers['content-disposition'];
// 					res.writeHead(200, obj);
// 					res.write(Data, 'binary');
// 					res.end();
// 				});
// 			});
// 		} else {
// 			MJJS.http.get(url, function(data, rs) {
// 				res.cookie('token', token, config.cookieCtrl);
// 				res.cookie('userId', userId, config.cookieCtrl);
// 				res.send(data);
// 			}, function(err) {
// 				res.send(err);
// 			});
// 		}
// 	});
// });

module.exports = router;
