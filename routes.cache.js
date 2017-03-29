var config = require('./config');

var base64 = function(method, url) {
	var str = [method, url].join(':');
	var key = new Buffer(str).toString('base64');
	return key;
}

if (config.noLo) {
	var redis  = require('redis');
	var client = redis.createClient(config.redis);
	module.exports = function (fn, isCache) {
		var cache = isCache || true;
		if (!cache) {
			return function(req, res, next) {
				return fn.call(null, req, res, next);
			}
		} else {
			var expiredTime = config.cacheExpiredTime || 5000;
			return function (req, res, next) {
				var send = res.send;
				var method = req.method;
				// var url = req.originalUrl.replace(/(\?\S+)/, '');
				var url = req.originalUrl;
				var query;
				if (method === 'GET') {
					query = req.query;
				} else {
					query = req.body;
				}
				var key = base64(method, url);
				client.get(key, function (err, value) {
					if (err) {
						return next(err);
					}
					if (value) {
						var data = value;
						try {
							data = JSON.parse(data);
						} catch (err) {
							console.log(err);
						}

						console.log('Read data from redis.');

						return res.send(data);
					}

					res.send = function (data) {
						client.setex(key, expiredTime, JSON.stringify(data));
						return send.call(this, data);
					}

					return fn.call(null, req, res, next);
				});
			}
		}
	}
} else {
	module.exports = function(fn) {
		return function(req, res, next) {
			return fn.call(null, req, res, next);
		}
	}
}