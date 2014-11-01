var reply = require('./module/reply'),
    topic = require('./module/topic'),
    user = require('./module/user'),
    integral = require('./module/integral'),
    async = require('async'),
    tool = require('./util/tool'),
    config = require('../config');


//发表发言页面
exports.createReply = function(req, res){
	if(!req.session || !req.session.user){
        return res.send({status: -2, content: '非法操作'});
    }
    var userInfo = req.session.user;
    var topicInfo = {};
	var topicId = req.body.topicId;
	var content = req.body.content;
    var floor = 0;
	async.series({
        //获取楼数
        getCount: function(done){
            reply.getCount({
                topicId : topicId
            },function(err, info){
                floor = info + 1;
                done(err);
            });
        },
    	//发言
        createReply: function(done){
        	reply.insert({
        		topicId : topicId,
        		content : content,
        		userId : userInfo._id,
                floor : floor
        	}, function(err, info){
        		done(err);
        	});
        },
        //获取话题信息,修改浏览纪录次数
        findTopicList: function(done){
            topic.getById(topicId, function(err, info){
                topic.update(info._id, {
                    replyQuantity : info.replyQuantity + 1,
                    lastUser : userInfo._id,
                    lastTimestamp : new Date().getTime()
                },function(err,dbTopic){
                    topicInfo = dbTopic;
                    done(err);
                }); 
            });
        },
        //增加自己经验
        findIntegral : function(done){
            if(userInfo._id != topicInfo.userId){
                integral.getById(userInfo._id,function(err, info){
                    integral.update(userInfo._id,{integral : info.integral + config.INTEGRAL.REPLY},function(err,info){
                        done(err);
                    });
                });
            }else{
                done();
            }
            
        },
        //增加帖子主人经验
        findTopicIntegral : function(done){
            if(userInfo._id != topicInfo.userId){
                integral.getById(topicInfo.userId,function(err, info){
                    integral.update(topicInfo.userId,{integral : info.integral + config.INTEGRAL.BEREPLY},function(err,info){
                        done(err);
                    });
                });
            }else{
                done();
            }   
        }
    }, function(err){
        if(err){
            res.send({status: -1, content: err});
        }else{
            res.send({status: 0, content: '评论成功。',});
        }      
    });
};

//将某评论废弃(找回)
exports.getWaste = function(req, res){
    if(!req.session || !req.session.user){
        return res.send({status: -2, content: '非法操作'});
    }
    var replyId = req.params.replyId;
    var type = parseInt(req.params.type) || 0;
    async.series({
        //修改评论属性
        updateTopic: function(done){
            reply.update(replyId, {isWaste : !!type}, function(err, info){
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

