var express = require('express');
var router  = express.Router();
var config  = require('../../config');
var MJJS    = require('../../common/MJJS');

// 线索列表
router.get('/', (req, res, next) => {
	res.render('clue/index', {
		config: config,
		title: '线索列表-线索管理',
		listMenu: req.session.listMenu
	});
});
// 创建线索
router.get('/add', (req, res, next) => {
	MJJS.permit(req, res, '/clue/add') &&
	res.render('clue/add', {
		config: config,
		title: '线索录入-线索管理',
		listMenu: req.session.listMenu
	});
});
// 编辑线索
router.get('/edit/:id', (req, res, next) => {
	MJJS.permit(req, res, '/clue/update') &&
	res.render('clue/add', {
		config: config,
		title: '线索编辑-线索管理',
		listMenu: req.session.listMenu
	});
});
// 查看线索
router.get('/view/:id', (req, res, next) => {
	var query = { customerCode: req.params.id };
	MJJS.permit(req, res, '/clue/info') &&
	MJJS.valid('/clue/info', query, req, res, next, function(data) {
		res.render('clue/view', {
			config: config,
			title: '线索查看-线索管理',
			info: data,
			listMenu: req.session.listMenu
		});
	});
});
//编辑线索

module.exports = router;
