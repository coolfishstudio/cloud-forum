var user = require('./module/user'),
    async = require('async'),
    config = require('../config');

//跳转到话题页面
exports.gotoTopic = function(req, res){
	var user = '';
	if(!req.session || !req.session.user){
		user = '';
	}else{
		user = req.session.user;	
	}
	res.render('topic/read', { titleName: config.NAME , user: user});
};

