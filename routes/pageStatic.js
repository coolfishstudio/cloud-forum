var user = require('./module/user'),
    async = require('async'),
    tool = require('./util/tool');

//跳转到静态工具页面
exports.gotoStatic = function(req, res){
    res.render('singin', {});
};
