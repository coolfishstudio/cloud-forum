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
    res.render('singin', {});
};
//登录
exports.login = function(req, res){
    res.render('login', {});
};