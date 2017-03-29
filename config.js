const env      = process.env.NODE_ENV || 'localhost';
const cookieExpiredTime = 60000 * 30;
const cacheExpiredTime  = 86400 * 30;
const config = {
	// 本地环境
	localhost: {
		ip: 'localhost',
		static: '/public',
		views: '/views',
		link: {
			index:  'http://localhost:3100',
			login:  'http://localhost:3100/login',
			logout: 'http://localhost:3100/logout'
		}
	},
	// DEV环境
	development: {
		ip: '10.12.80.197',
		static: '/public/build',
		views: '/views/build',
		link: {
			index:  'http://cms.dev.mjmobi.com',
			login:  'http://cms.dev.mjmobi.com/login',
			logout: 'http://cms.dev.mjmobi.com/logout'
		}
	},
	// PRD环境
	production: {
		ip: '10.10.80.188',
		static: '/public/build',
		views: '/views/build',
		link: {
			index:  'http://cms.mjmobi.com',
			login:  'http://cms.mjmobi.com/login',
			logout: 'http://cms.mjmobi.com/logout'
		}
	}
};
const currentConfig = config[env];

module.exports = currentConfig;
module.exports.cookieSecret = 'cms.mjmobi.com';
module.exports.cacheExpiredTime = cacheExpiredTime;
module.exports.env     = env;
module.exports.debug   = (env == 'development');
module.exports.noLocal = (env != 'localhost');

// 常用文件夹
module.exports.dir = {
	upload: __dirname + '/upload'
};

// MongonDB 配置
module.exports.db = {
	db: 'cms',
	host: 'localhost',
	port: 27017
};
// Redis 配置
module.exports.redis = {
	host: '127.0.0.1',
	port: 6379
};

// cookie过期时间 30分钟
module.exports.cookieExpiredTime = cookieExpiredTime;
// cookie签名
module.exports.cookieCtrl = {
	httpOnly: true,
	signed: true,
	maxAge: cookieExpiredTime
};
module.exports.title = '盟聚CMS';