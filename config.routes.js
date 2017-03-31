const ERROR404 = require('./routes/ERROR404');
const ERROR500 = require('./routes/ERROR500');

const COOKIE   = require('./routes/cookie');
const LOGOUT   = require('./routes/logout');
const LOGIN    = require('./routes/login');
const REG      = require('./routes/register');	// 注册

const INDEX    = require('./routes/index');
const API      = require('./routes/api');

module.exports = function(app) {
	// 判断用户登录状态
	app.use('/reg', REG);
	app.use('/logout', LOGOUT);
	app.use('/login', LOGIN);
	app.use([
		'/'
	], COOKIE);

	// 主页面
	app.use('/', INDEX);

	// API
	app.use('/api', API);

	// 404 catch-all 处理器 & 500 错误处理器
	app.use(ERROR404);
	app.use(ERROR500);
};
