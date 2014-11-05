var favorites = require('./module/favorites')
    async = require('async');

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