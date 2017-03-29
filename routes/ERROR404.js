var express = require('express');
var router  = express.Router();

router.all('*', function(req, res, next) {
	res.status(404).render('ERROR404', {
		title: '对不起！您访问的页面丢失了！',
		listMenu: req.session.listMenu
	});
});

module.exports = router;
