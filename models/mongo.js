const mongodb = require('../config.db');
const config  = require('../config');
const Cache   = require('../models/cache');

module.exports = {
	// 存储用户信息
	save: function(form, data, cb) {
		// 打开数据库
		console.log('链接数据库!');
		mongodb.open(function(err, db) {
			if (err) return cb(err);
			console.log('链接数据库成功!');
			// 读取 库表 集合
			console.log('读取库表!');
			mongodb.collection(form, function (err, collection) {
				// 错误, 返回 err 信息
				if (err) {
					console.log('读取库表失败!');
					mongodb.close();
					console.log('断开数据库链接!');
					return cb(err);
				}
				console.log('读取库表成功!');
				// 将数据插入 库表 集合
				collection.insert(data, { safe: true }, function(err, da) {
					mongodb.close();
					if (err) return cb(err);
					console.log('数据插入成功!');
					// 成功, err 为 null, 并返回存储后的数据
					cb(null, da.ops);
				});
			});
		});
	},
	// 读取用户信息
	get: function(form, data, cb) {
		// 打开数据库
		console.log('链接数据库!');
		mongodb.open(function(err, db) {
			if (err) return cb(err);
			console.log('链接数据库成功!');
			//读取 库表 集合
			console.log('读取数据信息!');
			mongodb.collection(form, function (err, collection) {
				// 错误, 返回 err 信息
				if (err) {
					console.log('读取数据失败!');
					mongodb.close();
					console.log('断开数据库链接!');
					return cb(err);
				}
				// 查询对应名称的用户数据
				console.log('查询对应名称的数据!');
				collection.findOne(data, function(err, da) {
					mongodb.close();
					if (err) return cb(err);
					console.log('查询数据成功!');
					// 成功, err 为 null, 并返回存储后的用户文档
					cb(null, da);
				});
			});
		});
	}
};