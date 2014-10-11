var user = require('./module/user'),
    async = require('async'),
    config = require('../config');

//跳转到静态工具页面
exports.gotoIndex = function(req, res){
	res.render('index', { titleName: config.NAME });
};

//跳转到静态工具页面
exports.gotoStatic = function(req, res){
	var toolName = req.params.toolName;
	var name = req.query.name;
	console.log(toolName,'--=-=-=-=-=-=-=-',name);
    res.render('static/' + toolName, {titleName : name + ' -- ' + config.NAME});
};
