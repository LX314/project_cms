/*const mongodb = require('../config.db');
const config  = require('../config');
const crypto  = require('crypto');
const Mongo   = require('../models/mongo');
const oss     = require('ali-oss');
const co      = require('co');
const fs      = require('fs');

// 建立 Aliyun 服务
const client  = new oss({
	accessKeyId:     'GpZWobG4z8wptff3',
	accessKeySecret: 'wrUkxTdTL3NIAYGT6knByLGkaPvK8R',
	bucket: 'mj-public',
	region: 'oss-cn-shanghai'
});

// 单文件上传
function uploadFile(path, dir, name, cb, er) {
	co(function* () {
		var stream = fs.createReadStream(path);
		console.log('======== 读取临时文件 %s ========', name);
		var result = yield client.putStream('cms/' + config.dir.env + '/'+ dir + '/' + name, stream);
		cb(result.url.replace('mj-public.oss-cn-shanghai.aliyuncs.com', 'mj-public.weimob.com'));
	}).catch(function (err) {
		console.log(err);
		er(err);
	});
}

// 文件操作(阿里云)
module.exports = {
	// 上传文件
	upload: (dirName, user, files, success) => {
		var md5  = crypto.createHash('md5'),
			dir  = md5.update(user).digest('hex'),
			len  = files.length,
			sn   = 0,
			en   = 0,
			urls = [],
			data = [];
		for (let i = 0; i < len; i++) {
			let file = files[i][1];
			let path = file.path;
			let name = path.match(/upload_[^\s]+/i)[0];
			uploadFile(path, (dirName? dirName + '/': '')+dir, name, function(url) {
				++sn;
				urls.push(url);
				data.push({ user: user, url: url, createTime: new Date()*1 });
				fs.unlinkSync(path);
				console.log('======== 临时文件 %s 已清除 ========', name);
				if (len === sn) {
					Mongo.save('userImage', data, function (err, user) {
						if (err) ++en;
						success && success(len, urls);
					});
				}
			}, function(err) {
				++sn;
				++en;
				if (len === sn) {
					success && success(len, urls);
				}
			});
		}
	},
	// 删除文件
	delete: function(path, success) {
		co(function* () {
			var find = yield client.list({
				prefix: 'wd/',
				delimiter: '/'
			});
			let list = find.objects;
			if (list) {
				let arr = [];
				for (var i = 0; i < list.length; i++) {
					arr.push(list[i].name);
				}
				co(function* () {
					var del = yield client.deleteMulti(arr);
					cb(del);
				}).catch(function (err) {
					console.log(err);
				});
			}
		}).catch(function (err) {
			console.log(err);
		});
	}
};*/