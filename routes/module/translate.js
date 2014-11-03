var http = require('http'),
    querystring = require("querystring"),
    config = require('../../config');

//翻译
exports.translate = function(from, to, q, callback){
    var params = {
        client_id: config.CLIENT.ID,
        from: from || 'auto',
        to: to || 'auto',
        q: q || ''
    };
    var data = querystring.stringify(params);
    var options = {
        host: 'openapi.baidu.com',
        port: 80,
        path: '/public/2.0/bmt/translate?' + data,
        method: 'GET'
    };
    var req = http.request(options, function(res){
        res.setEncoding('utf8');
        res.body = '';
        res.on('data', function(data) {
            res.body += data;
        });
        res.on('end', function() {
            info = JSON.parse(res.body);
            var err = null;
            if(info.error_msg){
                err = info.error_msg;
            }
            callback(err, res.body);
        });
        res.on('error', function(err) {
            callback(err, {});
        });
    });
    req.write(data);
    req.end();
};

