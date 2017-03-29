'use strict';

const express      = require('express');
const path         = require('path');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const config       = require('./config');
const routes       = require('./config.routes');
const session      = require('express-session');
const MongoStore   = require('connect-mongo')(session);
const settings     = require('./config.db');
const swig         = require('swig');

// 创建项目实例
const app = express();

app.disable('x-powered-by');

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + config.views);	// 设置views目录
app.set('config', config);

app.use(logger('dev'));

app.use(session({
	secret: config.cookieSecret + '.secret',
	key: config.db.db,
	resave: true,
	cookie: { maxAge: config.cookieExpiredTime },
	name: 'mjcms.session',
	saveUninitialized: true,
	store: new MongoStore({
		url: 'mongodb://localhost/' + config.db.db
	})
}));

// 定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cookie解析]
app.use(cookieParser(config.cookieSecret));

const oneDay = 86400000;
app.use(express.static(__dirname + config.static, {
	maxAge: oneDay
}));

// 配置路由
routes(app);

module.exports = app;
