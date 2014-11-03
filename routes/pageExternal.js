var translate = require('./module/translate'),
    async = require('async'),
    config = require('../config');

//翻译
exports.getTranslate = function(req, res){
    var from = req.query.from || 'auto';
    var to =  req.query.to || 'auto';
    var q = req.query.query || '';
    translate.translate(from, to, q, function(err ,info){
        console.log(info);
        if(info.error_code == '52001'){
            return res.send({status: -1, content: '超时'});
        }
        if(info.error_code == '52002'){
            return res.send({status: -1, content: '翻译系统错误'});
        }
        if(info.error_code == '52003'){
            return res.send({status: -1, content: '未授权的用户'});
        }
        res.send({status: 0, content: unescape(info.replace(/\\/g,'%'))});
    });
};


