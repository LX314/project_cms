const mongodb = require('../config.db');
module.exports = {
	// 存储用户信息
	save: function(data, cb) {
		// 打开数据库
		console.log('链接数据库!');
		mongodb.open(function(err, db) {
			if (err) return cb(err);
			console.log('链接数据库成功!');
			// 读取 token 集合
			console.log('读取用户信息!');
			mongodb.collection('token', function (err, collection) {
				// 错误, 返回 err 信息
				if (err) {
					console.log('读取用户信息失败!');
					mongodb.close();
					console.log('断开数据库链接!');
					return cb(err);
				}
				console.log('读取用户信息成功!');
				// 将用户数据插入 token 集合
				collection.insert(data, {
					safe: true
				}, function(err, o) {
					mongodb.close();
					if (err) return cb(err);
					console.log('用户信息插入成功!');
					// 成功, err 为 null, 并返回存储后的用户文档
					cb(null, o.ops[0]);
				});
			});
		});
	},
	// 读取用户信息
	get: function(token, cb) {
		// 打开数据库
		console.log('链接数据库!');
		mongodb.open(function(err, db) {
			if (err) return cb(err);
			console.log('链接数据库成功!');
			//读取 token 集合
			console.log('读取用户信息!');
			mongodb.collection('token', function (err, collection) {
				// 错误, 返回 err 信息
				if (err) {
					console.log('读取用户信息失败!');
					mongodb.close();
					console.log('断开数据库链接!');
					return cb(err);
				}
				// 查询对应名称的用户数据
				console.log('查询对应名称的用户数据!');
				collection.findOne({
					token: token
				}, function(err, data) {
					mongodb.close();
					if (err) return cb(err);
					console.log('查询用户数据成功!');
					// 成功, err 为 null, 并返回存储后的用户文档
					cb(null, data);
				});
			});
		});
	}
};