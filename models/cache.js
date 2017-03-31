const config = require('../config');
const redis  = require('redis');
const client = redis.createClient(config.redis);

module.exports = {
	get: function(opts) {
		var key = opts.key,
			cb  = opts.cb;
		if (key && cb) {
			console.log('查询信息!');
			client.get(key, function (err, data) {
				if (err) {
					console.log('查询信息失败!');
					return cb(err);
				}
				if (data) {
					console.log('查询信息成功!');
					data = JSON.parse(data);
					return cb(null, data);
				} else {
					console.log('信息不存在!');
					return cb(1);
				}
			});
		} else {
			cb && cb(1);
		}
	},
	save: function(opts) {
		var key     = opts.key,
			data    = opts.data,
			expired = opts.expired || 86400,
			cb      = opts.cb;
		if (key && data && cb) {
			console.log('设置信息!');
			client.setex(key, expired, JSON.stringify(data), function(err, o) {
				if (err) {
					console.log('设置信息失败!');
					return cb(err);
				}
				console.log('设置信息成功!');
				return cb(o);
			});
		} else {
			cb && cb(1);
		}
	}
};