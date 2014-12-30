var async = require('async'),
	fs = require("fs"),
    config = require('../config.js');

//imgSaveToFile
exports.imgSaveToFile = function(req, res){
	var path = '';
	async.series({
		getUrl:function(done){
			path = req.files.file.path;
			if(!/image/.test(req.files.file.mimetype)){
				done('上传的不是图片格式，请检查');
			}else{
				console.log('[img]:',req.files.file);
				if(req.files.file.size > 1000000){
					done('上传图片过大，请换张小的。');
				}
				path = path.replace(config.FILEPATH,'');
				path = path.replace('public/','');
				done();
			}
		}
	},function(err){
		if(err){
			fs.unlink(path);
            res.send({status: -1, content: err});
        }else{
            res.send({status:0, url:path});
        } 
	});	
};