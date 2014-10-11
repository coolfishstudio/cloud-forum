var user = require('./module/user'),
    async = require('async'),
    config = require('../config');

//跳转到话题页面
exports.gotoTopic = function(req, res){
	res.render('topic/read', { titleName: config.NAME });
};

