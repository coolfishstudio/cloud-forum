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
    if('default' == userName){
    	return res.send({status: -1, content: '该用户名已经存在了。'});
    }
    async.series({
    	//查看是否有这个用户
        findEmail: function(done){
        	user.getByEmail(email, function(err, info){
        		if(!err){
                    if(null != info){
                        done('该邮箱已经注册过了。');
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
                	info[0].passWord = '';
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
            res.send({status: 0, content: '注册成功。',user: req.session.user});
        }      
    })
};
//登录
exports.login = function(req, res){
    var email = req.body.email;
    var passWord = req.body.passWord;
    var userInfo = {};
    async.series({
        //根据名字去查询
        findUserName: function(done){
            user.getByEmail(email, function(err, info){
                if(!err){
                    if(null != info){
                        userInfo = info;
                        done();
                    }else{
                        done('该帐户不存在，请检查你的输入信息。');
                    }
                }else{
                    done(err);
                }
            });
        },
        //判断找到的数据是否密码一样
        contrastPassword: function(done){
            if(tool.getMD5(passWord) == userInfo.passWord){
            	
            	userInfo.passWord = '';
                req.session.user = userInfo;//用户信息存入 session
                console.log(req.session.user);
                done();
            }else{
                done('密码不正确，请重新输入。');
            }
        }
    },function(err){
        console.log(err);
        if(err){
            res.send({status: -1, content: err});
        }else{
            res.send({status: 0, content: '登录成功。', user: req.session.user});
            // res.render('index');//注册成功后返回主页
        } 
    });
};