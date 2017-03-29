const express = require('express');
const router  = express.Router();
const config  = require('../../config');
const MJJS    = require('../../common/MJJS');
const File    = require('../../models/file');
const code    = require('../../common/code');

const formidable = require('formidable');

router.post('/upload', (req, res, next) => {
	// var token  = req.signedCookies.token;
	var username  = req.signedCookies.username;
	var form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.uploadDir = config.dir.upload;
	MJJS.http.mkdir(form.uploadDir, function() {
		var da = {
			code: '9999',
			message: '数据异常!',
			data: null
		};
		var files = [],
			l     = 0;
		form.on('file', function(filed, file) {
			if (file.size) {
				++l;
				files.push([filed, file]);
			}
		});
		form.parse(req, function(err, fields) {
			if (err) {
				console.log(err);
				da.code = '0100';
				da.message = code[da.code];
				return res.send(da);
			}
			if (!l) {
				da.code = '0103';
				da.message = code[da.code];
				return res.send(da);
			}
			File.upload(username, files, function(len, urls) {
				var slen = urls.length;
				if (len) {
					if (len === slen) {
						da.code = '0000';
						da.message = '文件上传成功!';
						da.data = urls;
						return res.send(da);
					} else {
						da.code = '0102';
						da.message = code[da.code];
						da.data = urls;
						return res.send(da);
					}
				} else {
					da.code = '0101';
					da.message = code[da.code];
					return res.send(da);
				}
			});
		});
	});
});


module.exports = router;