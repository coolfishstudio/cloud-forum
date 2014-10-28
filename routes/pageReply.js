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
	var topicId = req.body.topicId;
	var content = req.body.content;
    var userIntegral = 0;
	async.series({
    	//发言
        createTopic: function(done){
        	reply.insert({
        		topicId : topicId,
        		content : content,
        		userId : userInfo._id
        	}, function(err, info){
        		done(err);
        	});
        },
        //获取话题信息,修改浏览纪录次数
        findTopicList: function(done){
            topic.getById(topicId, function(err, info){
                topic.update(info._id, {replyQuantity: info.replyQuantity + 1},function(err,dbTopic){
                    done(err);
                }); 
            });
        },
        //增加经验
        findIntegral : function(done){
            integral.getById(userInfo._id,function(err, info){
                integral.update(info._id,{integral : info.userIntegral + config.INTEGRAL.REPLY},function(err,info){
                    done(err);
                });
            });
        }
    }, function(err){
        if(err){
            res.send({status: -1, content: err});
        }else{
            res.send({status: 0, content: '评论成功。'});
        }      
    });
};
