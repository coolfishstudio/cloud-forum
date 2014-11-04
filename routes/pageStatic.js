var user = require('./module/user'),
    async = require('async'),
    topic = require('./module/topic'),
    tool = require('./util/tool'),
    integral = require('./module/integral'),
    config = require('../config');

//跳转到首页页面
exports.gotoIndex = function(req, res){
	var userInfo = '';
	if(!req.session || !req.session.user){
		userInfo = '';
	}else{
		userInfo = req.session.user;	
	}
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
    info.isOpen = true;
	async.series({
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
        findUserInfo: function(done){
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
            info.isOpen = true;
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
            topic.getCount({userId : userInfo._id,isOpen : true}, function(err, info){
                userInfo.topicCount = info;
                done(err);
            });
        }
    }, function(err){
        res.render('index', { titleName: config.NAME ,user : userInfo, topicList : topicList, count : count, currentPage : page, currentType : type, userIntegral : userIntegral});  
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

//获取站点状态
exports.getSite = function(req, res){
    var siteInfo = {};
    async.series({
        //获取总人数
        getUsersCount : function(done){
            user.getCount({},function(err, info){
                siteInfo.usersCount = info;
                done(err);
            });
        },       
        //获取总贴数
        getTopicsCount : function(done){
            topic.getCount({},function(err, info){
                siteInfo.topicsCount = info;
                done(err);
            });
        }
    }, function(err){
        if(err){
            res.send({status: -1, content: err});
        }else{
            res.send({status: 0, content: siteInfo});
        }      
    });
};
