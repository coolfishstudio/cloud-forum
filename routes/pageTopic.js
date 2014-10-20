var topic = require('./module/topic'),
    async = require('async'),
    tool = require('./util/tool'),
    config = require('../config');

//跳转到话题页面
exports.gotoTopic = function(req, res){
	var userInfo = '';
	if(!req.session || !req.session.user){
		userInfo = '';
	}else{
		userInfo = req.session.user;	
	}
	var topicId = req.params.topicId;
	topic.getById(topicId, function(err, info){
		console.log(err,'-=-=-=',info);
		info.lastTime = tool.getDateDiff(info.lastTimestamp);
		res.render('topic/read', { titleName: config.NAME, user: userInfo, topicInfo : info});
	});
};

//跳转到发布话题页面
exports.gotoCreateTopic = function(req, res){
	var userInfo = '';
	if(!req.session || !req.session.user){
		userInfo = '';
	}else{
		userInfo = req.session.user;	
	}
	res.render('topic/create', { titleName: config.NAME , user: userInfo});
};

//发布话题页面
exports.createTopic = function(req, res){
	var userInfo = '';
	if(!req.session || !req.session.user){
		userInfo = '';
	}else{
		userInfo = req.session.user;	
	}

	var title = req.body.title;
	var content = req.body.content;
	var tag = req.body.tag;

	async.series({
    	//发帖
        createTopic: function(done){
        	topic.insert({
        		title : title,
        		content : content,
        		tag : tag,
        		userId : userInfo._id
        	}, function(err, info){
        		console.log(err,'-=-=-=',info);
        		done(err);
        	});
        }
    }, function(err){
        if(err){
            res.send({status: -1, content: err});
        }else{
            res.send({status: 0, content: '发帖成功。'});
        }      
    })
};
