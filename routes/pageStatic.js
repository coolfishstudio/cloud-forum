var user = require('./module/user'),
    async = require('async'),
    topic = require('./module/topic'),
    config = require('../config');

//跳转到首页页面
exports.gotoIndex = function(req, res){
	var userInfo = '';
	if(!req.session || !req.session.user){
		userInfo = '';
	}else{
		userInfo = req.session.user;	
	}
	var page = req.body.page || 1;
	async.series({
    	//获取列表信息
        findTopicList: function(done){
        	topic.getAll(config.INDEXPAGENUM, page, function(err, info){
        		console.log(err,'-=-=-=',info);
        		done(err);
        	});
        }
    }, function(err){
        res.render('index', { titleName: config.NAME ,user : userInfo});  
    })


	
};

//跳转到静态工具页面
exports.gotoStatic = function(req, res){
	var toolName = req.params.toolName;
	var name = req.query.name;
	var userInfo = '';
	if(!req.session || !req.session.user){
		userInfo = '';
	}else{
		userInfo = req.session.user;	
	}
    res.render('static/' + toolName, {titleName : name + ' -- ' + config.NAME, user : userInfo});
};
