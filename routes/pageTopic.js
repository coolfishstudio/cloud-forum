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
    var userIntegral = 0;
	async.series({
    	//获取话题信息,修改浏览纪录次数
        findTopicList: function(done){
        	topic.getById(topicId, function(err, info){
        		topic.update(info._id, {visitQuantity: info.visitQuantity + 1},function(err,dbTopic){
	        		dbTopic.lastTime = tool.getDateDiff(dbTopic.lastTimestamp);
                    topicInfo = dbTopic;
                    if(userInfo != '' && userInfo._id == topicInfo.userId){
                        topicInfo.user = true;
                    }else{
                        topicInfo.user = false;
                    }
                    topicInfo.handle_up_t = false;//点赞
                    topicInfo.handle_up_f = false;//取消点赞
                    if(userInfo != '' && userInfo.name != topicInfo.userId){
                        var re = new RegExp('' + userInfo._id + '');
                        if(topicInfo.ups){
                            if(re.test(topicInfo.ups.join(','))){
                                topicInfo.handle_up_t = true;
                            }else{
                                topicInfo.handle_up_f = true;
                            }
                        }
                        topicInfo.handle_up_f = true;
                    }
	        		done(err);
	        	});	
			});
        },
        //获取对应的用户信息
        findUserInfo: function(done){
            user.getById(topicInfo.userId, function(err, dbUserInfo){
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
        findIntegral : function(done){
            integral.getById(topicInfo.userId,function(err, info){
                userIntegral = info.integral || 0;
                done(err);
            });
        },
        findTopicCount : function(done){
            var tempInfo = {};
            if(req.session.user && topicInfo.userId != req.session.user._id){
                tempInfo.isOpen = true;
            }
            tempInfo.userId = topicInfo.userId;
            topic.getCount(tempInfo, function(err, info){
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
        res.render('topic/read', { titleName: topicInfo.title + ' -- ' +config.NAME, user: userInfo, topicInfo : topicInfo, replyList : replyList,userIntegral : userIntegral});
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
	var title = tool.removeHTMLTag(req.body.title);
    if('' == title){
        res.send({status: -1, content: '标题含有非法参数。'});
    }
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
    var topicInfo = {};
	async.series({
    	//修改话题属性
        updateTopic: function(done){
        	topic.handle(topicId, {isWaste : !!type}, function(err, info){
                topicInfo = info;
        		done(err);
        	});
        },
        //修改经验
        findIntegral : function(done){
            integral.getById(topicInfo.userId,function(err, info){
                var tempIntegral = ((info.integral - config.INTEGRAL.DELTOPIC) > 0 ? (info.integral - config.INTEGRAL.DELTOPIC) : 0);
                integral.update(topicInfo.userId,{integral : tempIntegral},function(err,info){
                    done(err);
                });
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

//顶贴(取消顶贴)
exports.getUp = function(req, res){
    if(!req.session || !req.session.user){
        return res.send({status: -2, content: '非法操作'});
    }
    var topicId = req.params.topicId;
    var type = parseInt(req.params.type) || 0;
    var upsList = [];
    async.series({
        //获取话题信息
        findTopicList: function(done){
            topic.getById(topicId, function(err, info){
                if(info.userId == req.session.user._id){//去掉自己
                    done('骚年，给自己点赞可不好哦。');
                }else{
                    upsList = info.ups || [];
                    if(type){//点赞
                        var re = new RegExp('' + req.session.user._id + '');
                        if(re.test(upsList.join(','))){
                            done('骚年，重复点赞可不好哦。');
                        }else{
                            upsList.push(req.session.user._id);
                            done(err);
                        }
                    }else{//取消
                        var re = new RegExp('' + req.session.user._id + '');
                        if(re.test(upsList.join(','))){
                            var str = (upsList.join(',') + ',').replace(req.session.user._id + ',','');
                            upsList = (str == '') ? [] : (str.substring(0,str.length-1).split(','));
                            done(err);
                        }else{
                            done('骚年，你还没有点赞呢。');
                        }
                    }
                }
            });
        },
        //修改话题属性
        updateTopic: function(done){
            topic.handle(topicId, {ups : upsList}, function(err, info){
                done(err);
            });
        }
    }, function(err){
        if(err){
            res.send({status: -1, content: err});
        }else{
            res.send({status: 0, content: (!!type ? '':'取消')+'点赞操作成功。'});
        }      
    });
};

// //踩贴(取消踩贴)
// exports.getDown = function(req, res){
//     if(!req.session || !req.session.user){
//         return res.send({status: -2, content: '非法操作'});
//     }
//     var topicId = req.params.topicId;
//     var type = parseInt(req.params.type) || 0;
//     var downsList = [];
//     async.series({
//         //获取话题信息
//         findTopicList: function(done){
//             topic.getById(topicId, function(err, info){
//                 if(info.userId == req.session.user._id){//去掉自己
//                     done('骚年，你居然觉得自己写的很烂么。');
//                 }else{
//                     downsList = info.ups;
//                     if(type){
//                         var re = new RegExp('' + req.session.user._id + '');
//                         console.log(downsList,'---',re.test(downsList.join(',')));
//                         if(re.test(downsList.join(','))){
//                             done('骚年，重复踩贴可不好哦。');
//                         }else{
//                             downsList.push(req.session.user._id);
//                             done(err);
//                         }
//                     }else{//取消
//                         var re = new RegExp('' + req.session.user._id + '');
//                         if(re.test(downsList.join(','))){
//                             var str = (downsList.join(',') + ',').replace(req.session.user._id + ',','');
//                             downsList = str.substring(0,str.length-1).split(',')
//                             done(err);
//                         }else{
//                             done('骚年，你还没有踩贴呢。');
//                         }
//                     }
//                 }
//             });
//         },
//         //修改话题属性
//         updateTopic: function(done){
//             topic.handle(topicId, {downs : downsList}, function(err, info){
//                 done(err);
//             });
//         }
//     }, function(err){
//         if(err){
//             res.send({status: -1, content: err});
//         }else{
//             console.log(downsList);
//             res.send({status: 0, content: (!!type ? '':'取消')+'踩贴操作成功。'});
//         }      
//     });
// };

//跳转到首页页面
exports.getTopicByUser = function(req, res){
    if(!req.session || !req.session.user){
        return res.send({status: -2, content: '非法操作'});
    }
    var userId = req.params.id;
    var page = req.query.page || 1;
    var type = req.query.type || 'all';
    var topicList = [];
    var count = 0;
    var info = {};
    var userIntegral = 0;
    if('jp' == type){
        info.isGood = true;
    }else if('all' != type){
        info.tag = type;
    }
    info.userId = userId;
    var userInfo = {};
    if(userId != req.session.user._id){
        info.isOpen = true;
    }
    async.series({
        //获取用户信息
        findUserInfo : function(done){
            user.getById(userId,function(err,info){
                userInfo = info;
                done(err);
            });
        },
        //获取列表信息
        findTopicList: function(done){
            topic.getAll(config.LIMIT.INDEXPAGENUM, page, info, function(err, info){
                for(var i = 0; i < info.length; i++){
                    info[i].lastTime = tool.getDateDiff(info[i].lastTimestamp);
                }
                topicList = info;
                done(err);
            });
        },
        //获取对应的用户信息
        findUserList: function(done){
            var iterator = function(topicInfo, eachFinish){
                user.getById(topicInfo.userId, function(err, dbUserInfo){
                    topicInfo.userName = dbUserInfo.name;
                    topicInfo.userHeadSrc = dbUserInfo.headSrc;
                    user.getById(topicInfo.lastUser, function(err, dbLastUserInfo){
                        topicInfo.lastUserName = dbLastUserInfo.name;
                        topicInfo.lastUserHeadSrc = dbLastUserInfo.headSrc;
                        eachFinish();
                    });   
                });
            };
            async.forEach(topicList, iterator, function(err){
                done(err);
            });
        },
        //获取总数
        findCount : function(done){
            info.isWaste = false;
            topic.getCount(info, function(err, info){
                count = Math.ceil(info/config.LIMIT.INDEXPAGENUM);
                done(err);
            });
        },
        findIntegral : function(done){
            if(!req.session || !req.session.user){
                done();
            }else{
                integral.getById(userInfo._id,function(err, info){
                    userIntegral = info.integral || 0;
                    done(err);
                });
            }
        },
        findTopicCount : function(done){
            var tempInfo = {};
            if(userId != req.session.user._id){
                tempInfo.isOpen = true;
            }
            tempInfo.userId = userInfo._id;
            topic.getCount(tempInfo, function(err, info){
                userInfo.topicCount = info;
                done(err);
            });
        }
    }, function(err){
        // console.log('titleName:', config.NAME ,'user :', userInfo, 'topicList :', topicList, 'count :', count, 'currentPage :', page, 'currentType :', type, 'userIntegral :', userIntegral);
        res.render('user/infoList', { titleName: config.NAME ,user : userInfo, topicList : topicList, count : count, currentPage : page, userIntegral : userIntegral,userId:userId});  
    })
};


//跳转到精品页面
exports.getTopicByGood = function(req, res){
    if(!req.session || !req.session.user){
        return res.send({status: -2, content: '非法操作'});
    }
    var userId = req.params.id;
    var page = req.query.page || 1;
    var topicList = [];
    var count = 0;
    var info = {};
    var userIntegral = 0;
    info.isGood = true;
    info.userId = userId;
    var userInfo = {};
    if(userId != req.session.user._id){
        info.isOpen = true;
    }
    async.series({
        //获取用户信息
        findUserInfo : function(done){
            user.getById(userId,function(err,info){
                userInfo = info;
                done(err);
            });
        },
        //获取列表信息
        findTopicList: function(done){
            topic.getAll(config.LIMIT.INDEXPAGENUM, page, info, function(err, info){
                for(var i = 0; i < info.length; i++){
                    info[i].lastTime = tool.getDateDiff(info[i].lastTimestamp);
                }
                topicList = info;
                done(err);
            });
        },
        //获取对应的用户列表信息
        findUserList: function(done){
            var iterator = function(topicInfo, eachFinish){
                user.getById(topicInfo.userId, function(err, dbUserInfo){
                    topicInfo.userName = dbUserInfo.name;
                    topicInfo.userHeadSrc = dbUserInfo.headSrc;
                    user.getById(topicInfo.lastUser, function(err, dbLastUserInfo){
                        topicInfo.lastUserName = dbLastUserInfo.name;
                        topicInfo.lastUserHeadSrc = dbLastUserInfo.headSrc;
                        eachFinish();
                    });   
                });
            };
            async.forEach(topicList, iterator, function(err){
                done(err);
            });
        },
        //获取总数
        findCount : function(done){
            info.isWaste = false;
            topic.getCount(info, function(err, info){
                count = Math.ceil(info/config.LIMIT.INDEXPAGENUM);
                done(err);
            });
        },
        findIntegral : function(done){
            if(!req.session || !req.session.user){
                done();
            }else{
                integral.getById(userInfo._id,function(err, info){
                    userIntegral = info.integral || 0;
                    done(err);
                });
            }
        },
        findTopicCount : function(done){
            var tempInfo = {};
            if(userId != req.session.user._id){
                tempInfo.isOpen = true;
            }
            tempInfo.userId = userInfo._id;
            topic.getCount(tempInfo, function(err, info){
                userInfo.topicCount = info;
                done(err);
            });
        }
    }, function(err){
        // console.log('titleName:', config.NAME ,'user :', userInfo, 'topicList :', topicList, 'count :', count, 'currentPage :', page, 'currentType :', type, 'userIntegral :', userIntegral);
        res.render('user/infoList', { titleName: config.NAME ,user : userInfo, topicList : topicList, count : count, currentPage : page, userIntegral : userIntegral,userId:userId});  
    })
};


