var user = require('./module/user'),
    async = require('async'),
    topic = require('./module/topic'),
    tool = require('./util/tool'),
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
	var topicList = [];
	async.series({
    	//获取列表信息
        findTopicList: function(done){
        	topic.getAll(config.INDEXPAGENUM, page, function(err, info){
        		for(var i = 0; i < info.length; i++){
        			info[i].lastTime = tool.getDateDiff(info[i].lastTimestamp);
        		}
        		topicList = info;
        		done(err);
        	});
        },
        //获取对应的用户信息
        findUserInfo: function(done){
            var iterator = function(topicInfo, eachFinish){
                user.getById(topicInfo.userId, function(err, dbUserInfo){
                    console.log('[dbUserInfo]',dbUserInfo);
                    user.getById(topicInfo.lastUser, function(err, dbLastUserInfo){
                        console.log('[dbUserInfo]',dbLastUserInfo);
                        eachFinish();
                    });   
                });
            };
            async.forEach(topicList, iterator, function(err){
                done(err);
            });
        }
    }, function(err){
        res.render('index', { titleName: config.NAME ,user : userInfo, topicList : topicList });  
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
