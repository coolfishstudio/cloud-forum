var user = require('./module/user'),
    async = require('async'),
    config = require('../config');

//跳转到静态工具页面
exports.gotoIndex = function(req, res){
	if(!req.session || !req.session.user){
		res.render('index', { titleName: config.NAME, user: ''});
	}else{
		res.render('index', { titleName: config.NAME, user: req.session.user });	
	}
};

//跳转到静态工具页面
exports.gotoStatic = function(req, res){
	var toolName = req.params.toolName;
	var name = req.query.name;
	console.log(toolName,'--=-=-=-=-=-=-=-',name);
    res.render('static/' + toolName, {titleName : name + ' -- ' + config.NAME});
};
