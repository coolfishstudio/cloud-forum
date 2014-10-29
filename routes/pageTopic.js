var topic = require('./module/topic'),
	user = require('./module/user'),
    reply = require('./module/reply'),
    integral = require('./module/integral'),
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
    var page = req.query.page || 1;
    var replyList = {};
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
            	if(userInfo != '' && userInfo.name == dbUserInfo.name){
            		topicInfo.user = true;
            	}else{
            		topicInfo.user = false;
            	}
                if(userInfo != '' && userInfo.power == 'a'){
                   topicInfo.power = true;
                }else{
                    topicInfo.power = false; 
                }
                topicInfo.userName = dbUserInfo.name;
                topicInfo.userHeadSrc = dbUserInfo.headSrc;
                topicInfo.userCreateTimestamp = dbUserInfo.createTimestamp;
                done(err);
            });
        },
        findTopicCount : function(done){
            topic.getCount({userId : topicInfo.userId,isOpen : true}, function(err, info){
                topicInfo.topicCount = info;
                done(err);
            });
        },
        //获取评论
        findReply : function(done){
            reply.getAllByTopicId(config.LIMIT.REPLYPAGENUM, page, {topicId: topicInfo._id}, function(err, dbReply){
                replyList = dbReply;
                done(err);
            });
        },
        //获取评论对应的用户信息
        findReplyUserInfo: function(done){
            var iterator = function(replyInfo, eachFinish){
                user.getById(replyInfo.userId, function(err, dbUserInfo){
                    if(topicInfo.user){
                        replyInfo.user = true;
                    }else{
                        if(userInfo != '' && userInfo.name == dbUserInfo.name){
                            replyInfo.user = true;
                        }else{
                            replyInfo.user = false;
                        }
                    }
                    replyInfo.userName = dbUserInfo.name;
                    replyInfo.userHeadSrc = dbUserInfo.headSrc;
                    replyInfo.replyTime = tool.getDateDiff(replyInfo.createTimestamp);
                    eachFinish(); 
                });
            };
            async.forEach(replyList, iterator, function(err){
                done(err);
            });
        }
    }, function(err){
        res.render('topic/read', { titleName: topicInfo.title + ' -- ' +config.NAME, user: userInfo, topicInfo : topicInfo, replyList : replyList});
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
	if(!req.session || !req.session.user){
        return res.send({status: -2, content: '非法操作'});
    }
    var userInfo = req.session.user;
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
        },
        findIntegral : function(done){
            integral.getById(userInfo._id,function(err, info){
                integral.update(userInfo._id,{integral : info.integral + config.INTEGRAL.POSTING},function(err,info){
                    done(err);
                });
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

//将某话题私密(取消私密)
exports.getOpen = function(req, res){
    if(!req.session || !req.session.user){
        return res.send({status: -2, content: '非法操作'});
    }
    var topicId = req.params.topicId;
    var type = parseInt(req.params.type) || 0;
    async.series({
        //修改话题属性
        updateTopic: function(done){
            topic.handle(topicId, {isOpen : !!type}, function(err, info){
                done(err);
            });
        }
    }, function(err){
        if(err){
            res.send({status: -1, content: err});
        }else{
            res.send({status: 0, content: (!!type ? '公开':'私密')+'操作成功。'});
        }      
    });
};
