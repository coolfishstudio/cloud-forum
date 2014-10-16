var user = require('./module/user'),
    async = require('async'),
    tool = require('./util/tool');

//跳转到注册页面
exports.gotoSignin = function(req, res){
    res.render('singin', {});
};
//跳转到登录页面
exports.gotoLogin = function(req, res){
    res.render('login', {});
};
//退出跳转到首页面
exports.gotoLogout = function(req, res){
    res.redirect('/');
};
//注册
exports.signin = function(req, res){
	var userName = req.body.userName;
    var passWord = req.body.passWord;
    var email = req.body.email;
    async.series({
    	//查看是否有这个用户
        findUserName: function(done){
        	user.getByEmail(email, function(err, info){
        		if(!err){
                    if(null != info){
                        done('该用户名称已经存在了。');
                    }else{
                        done();
                    }
                }else{
                    done(err);
                }
        	});
        },
        // 注册用户
        regUser: function(done){
            user.insert({
            	email : email,
                name : userName,
                passWord : tool.getMD5(passWord)
            },function(err, info){
                if(!err){
                    req.session.user = info[0];
                    done();
                }else{
                    done(err);
                }
            });
        }
    }, function(err){
        if(err){
            res.send({status: -1, content: err});
        }else{
            res.send({status: 0, content: '注册成功。'});
        }      
    })
};
//登录
exports.login = function(req, res){
    res.render('login', {});
};