var favorites = require('./module/favorites'),
    topic = require('./module/topic'),
    user = require('./module/user'),
    integral = require('./module/integral'),
    async = require('async'),
    config = require('../config');

//收藏话题页面
exports.createFavorites = function(req, res){
	if(!req.session || !req.session.user){
        return res.send({status: -2, content: '非法操作'});
    }
    var userId = req.session.user._id;
	var topicId = req.params.topicId;
	async.series({
        //找
        findFavorites: function(done){
            favorites.getById({
                userId : userId,
                topicId : topicId
            },function(err, info){
                if(info){
                    done('已收藏');
                }else{
                    done();
                }
            });
        },
    	//收藏
        createFavorites: function(done){
        	favorites.insert({
        		userId : userId,
        		topicId : topicId
        	}, function(err, info){
        		done(err);
        	});
        }
    }, function(err){
        if(err){
            res.send({status: -1, content: err});
        }else{
            res.send({status: 0, content: '收藏成功。'});
        }      
    });
};

//跳转到收藏页面
exports.getTopicByCollection = function(req, res){
    if(!req.session || !req.session.user){
        return res.send({status: -2, content: '非法操作'});
    }
    var userId = req.params.id;
    var page = req.query.page || 1;
    var favoritesList = [];
    var topicList = [];
    var count = 0;
    var info = {};
    var userIntegral = 0;
    info.userId = userId;
    var userInfo = {};
    // if(userId != req.session.user._id){
    //     info.isOpen = true;
    // }
    async.series({
        //获取用户信息
        findUserInfo : function(done){
            user.getById(userId,function(err,_info){
                userInfo = _info;
                done(err);
            });
        },
        //获取收藏列表信息
        findFavoritesList: function(done){
            favorites.getAll(config.LIMIT.INDEXPAGENUM, page, info, function(err, _info){
                favoritesList = _info;
                // console.log('[favoritesList]:',favoritesList);
                done(err);
            });
        },
        //获取列表信息
        findTopicList: function(done){
            var iterator = function(favoritesInfo, eachFinish){
                console.log('[favoritesInfo]',favoritesInfo);
                topic.getById(favoritesInfo.topicId, function(err, dbTopicInfo){
                    // topicInfo.userName = dbUserInfo.name;
                    // topicInfo.userHeadSrc = dbUserInfo.headSrc;
                    // user.getById(topicInfo.lastUser, function(err, dbLastUserInfo){
                    //     topicInfo.lastUserName = dbLastUserInfo.name;
                    //     topicInfo.lastUserHeadSrc = dbLastUserInfo.headSrc;
                        console.log('--',dbTopicInfo);
                        eachFinish();
                    // });   
                });
            };
            async.forEach(favoritesList, iterator, function(err){
                done(err);
            });
        },
        // //获取对应的用户列表信息
        // findUserList: function(done){
        //     // var iterator = function(topicInfo, eachFinish){
        //     //     user.getById(topicInfo.userId, function(err, dbUserInfo){
        //     //         topicInfo.userName = dbUserInfo.name;
        //     //         topicInfo.userHeadSrc = dbUserInfo.headSrc;
        //     //         user.getById(topicInfo.lastUser, function(err, dbLastUserInfo){
        //     //             topicInfo.lastUserName = dbLastUserInfo.name;
        //     //             topicInfo.lastUserHeadSrc = dbLastUserInfo.headSrc;
        //     //             eachFinish();
        //     //         });   
        //     //     });
        //     // };
        //     // async.forEach(topicList, iterator, function(err){
        //     //     done(err);
        //     // });
        // },
        // //获取总数
        // findCount : function(done){
        //     // info.isWaste = false;
        //     // topic.getCount(info, function(err, info){
        //     //     count = Math.ceil(info/config.LIMIT.INDEXPAGENUM);
        //     //     done(err);
        //     // });
        // },
        // //获取积分
        // findIntegral : function(done){
        //     if(!req.session || !req.session.user){
        //         done();
        //     }else{
        //         integral.getById(userInfo._id,function(err, _info){
        //             userIntegral = _info.integral || 0;
        //             done(err);
        //         });
        //     }
        // },
        // //获取用户发帖数
        // findTopicCount : function(done){
        //     var tempInfo = {};
        //     if(userId != req.session.user._id){
        //         tempInfo.isOpen = true;
        //     }
        //     tempInfo.userId = userInfo._id;
        //     topic.getCount(tempInfo, function(err, _info){
        //         userInfo.topicCount = _info;
        //         done(err);
        //     });
        // }
        //获取用户收藏数
    }, function(err){
        // console.log('titleName:', config.NAME ,'user :', userInfo, 'topicList :', topicList, 'count :', count, 'currentPage :', page, 'currentType :', type, 'userIntegral :', userIntegral);
        res.render('user/infoList', { titleName: config.NAME ,user : userInfo, topicList : topicList, count : count, currentPage : page, userIntegral : userIntegral,userId:userId});  
    })
};