var topic = require('./module/topic'),
	user = require('./module/user'),
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
	var topicInfo = {};
	async.series({
    	//获取话题信息,修改浏览纪录次数
        findTopicList: function(done){
        	topic.getById(topicId, function(err, info){
        		topic.update(info._id, {visitQuantity: info.visitQuantity + 1},function(err,dbTopic){
	        		dbTopic.lastTime = tool.getDateDiff(dbTopic.lastTimestamp);
	        		topicInfo = dbTopic;
	        		done(err);
	        	});	
			});
        },
        //获取对应的用户信息
        findUserInfo: function(done){
            user.getById(topicInfo.userId, function(err, dbUserInfo){
                topicInfo.userName = dbUserInfo.name;
                topicInfo.userHeadSrc = dbUserInfo.headSrc;
                done(err);
            });
        }  
    }, function(err){
        res.render('topic/read', { titleName: topicInfo.title + ' -- ' +config.NAME, user: userInfo, topicInfo : topicInfo});
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
	var isOpen = !!parseInt(req.body.isOpen);//是否公开

	async.series({
    	//发帖
        createTopic: function(done){
        	topic.insert({
        		title : title,
        		content : content,
        		tag : tag,
        		isOpen : isOpen,
        		userId : userInfo._id
        	}, function(err, info){
        		done(err);
        	});
        }
    }, function(err){
        if(err){
            res.send({status: -1, content: err});
        }else{
            res.send({status: 0, content: '发帖成功。'});
        }      
    });
};

//将某话题置顶(取消置顶)
exports.getTop = function(req, res){
	if(!req.session || !req.session.user){
		return res.send({status: -2, content: '非法操作'});
	}
	var topicId = req.params.topicId;
	var type = parseInt(req.params.type) || 0;
	async.series({
		//获取个数
		findTopicCount : function(done){
			topic.getCount({
				isTop:true
			}, function(err,info){
				console.log(err,'-=-=',info);
				if(info >= config.LIMIT.INDEXTOPNUM && !!type){
					done('最多有' + config.LIMIT.INDEXTOPNUM + '个置顶');
				}else{
					done(err);
				}
			});
		},
    	//修改话题属性
        updateTopic: function(done){
        	topic.handle(topicId, {isTop : !!type}, function(err, info){
        		done(err);
        	});
        }
    }, function(err){
        if(err){
            res.send({status: -1, content: err});
        }else{
            res.send({status: 0, content: (!!type ? '':'取消')+'置顶操作成功。'});
        }      
    });
};

//将某话题加精(取消加精)
exports.getGood = function(req, res){
	if(!req.session || !req.session.user){
		return res.send({status: -2, content: '非法操作'});
	}
	var topicId = req.params.topicId;
	var type = parseInt(req.params.type) || 0;
	async.series({
    	//修改话题属性
        updateTopic: function(done){
        	topic.handle(topicId, {isGood : !!type}, function(err, info){
        		done(err);
        	});
        }
    }, function(err){
        if(err){
            res.send({status: -1, content: err});
        }else{
            res.send({status: 0, content: (!!type ? '':'取消')+'加精操作成功。'});
        }      
    });
};

//将某话题废弃(找回)
exports.getWaste = function(req, res){
	if(!req.session || !req.session.user){
		return res.send({status: -2, content: '非法操作'});
	}
	var topicId = req.params.topicId;
	var type = parseInt(req.params.type) || 0;
	async.series({
    	//修改话题属性
        updateTopic: function(done){
        	topic.handle(topicId, {isWaste : !!type}, function(err, info){
        		done(err);
        	});
        }
    }, function(err){
        if(err){
            res.send({status: -1, content: err});
        }else{
            res.send({status: 0, content: (!!type ? '删除':'找回')+'操作成功。'});
        }      
    });
};
