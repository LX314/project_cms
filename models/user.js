const mongoose  = require('mongoose');
const BaseModel = require("./base_model");
const Schema    = mongoose.Schema;

const UserSchema = new Schema({
	name:         { type: String },						// 昵称
	loginname:    { type: String },						// 登录名
	password:     { type: String },						// 密码
	email:        { type: String },						// 邮箱
	mobile:       { type: String },						// 手机
	url:          { type: String },						// 个人主页
	location:     { type: String },						// 地区
	signature:    { type: String },						// 签名
	profile:      { type: String },						// 个人信息
	avatar:       { type: String },						// 头像
	profileImage: { type: String },						// 个人信息图片

	level:        { type: Number, default: 0 },			// 等级 (默认: 0)
	levelName:    { type: String },						// 等级名称
	active:       { type: Boolean, default: false },	// 是否激活
	freeze:       { type: Boolean, default: false },	// 账号冻结

	createTime:   { type: Date, default: Date.now },	// 创建时间
	updateTime:   { type: Date, default: Date.now },	// 更新时间
	accessToken:  { type: String }						// 账户Token
});

UserSchema.plugin(BaseModel);

UserSchema.virtual('avatar_url').get(function() {
	var url = this.avatar || ('/img/avatar/' + Math.ceil(Math.random()*5) + '.png');
	return url;
});

UserSchema.index({ loginname: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });

UserSchema.pre('save', function(next){
	var now = new Date();
	this.updateTime = now;
	next();
});

mongoose.model('User', UserSchema);