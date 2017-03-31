const models  = require('../models');
const User    = models.User;
const uuid    = require('node-uuid');

/**
 * 根据用户名列表查找用户列表
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {Array} names 用户名列表
 * @param {Function} cb 回调函数
 */
exports.getUsersByNames = function(names, cb) {
	if (names.length === 0) {
		return cb(null, []);
	}
	User.find({ loginname: { $in: names } }, cb);
};

/**
 * 根据登录名查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} loginName 登录名
 * @param {Function} cb 回调函数
 */
exports.getUserByLoginName = function (loginName, cb) {
	User.findOne({ 'loginname': new RegExp('^'+loginName+'$', 'i') }, cb);
};

/**
 * 根据用户ID，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} id 用户ID
 * @param {Function} cb 回调函数
 */
exports.getUserById = function (id, cb) {
	if (!id) {
		return cb();
	}
	User.findOne({_id: id}, cb);
};

/**
 * 根据邮箱，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} email 邮箱地址
 * @param {Function} cb 回调函数
 */
exports.getUserByMail = function (email, cb) {
	User.findOne({ email: email }, cb);
};

/**
 * 根据用户ID列表，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {Array} ids 用户ID列表
 * @param {Function} cb 回调函数
 */
exports.getUsersByIds = function (ids, cb) {
	User.find({ '_id': {'$in': ids} }, cb);
};

/**
 * 根据关键字，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {String} query 关键字
 * @param {Object} opt 选项
 * @param {Function} cb 回调函数
 */
exports.getUsersByQuery = function (query, opt, cb) {
	User.find(query, '', opt, cb);
};

exports.addUser = function (loginname, password, email, avatar, active, cb) {
	var user         = new User();
	user.name        = loginname;
	user.loginname   = loginname;
	user.password    = password;
	user.email       = email;
	user.avatar      = avatar;
	user.active      = active || false;
	user.accessToken = uuid.v4();

	user.save(cb);
};

var createAvatar = function () {
	return '/img/avatar/' + Math.ceil(Math.random()*5) + '.png';
};
exports.createAvatar = createAvatar;

exports.getAvatar = function (user) {
	return user.avatar || createAvatar(user);
};