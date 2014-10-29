var async = require('async'),
	fs = require("fs"),
    config = require('../config.js');

//imgSaveToFile
exports.imgSaveToFile = function(req, res){
	var path = '';
	console.log('[0]',req.files.file);
	async.series({
		getUrl:function(done){
			console.log('[1]:',!/image/.test(req.files.mimetype),req.files.file.mimetype);
			if(!/image/.test(req.files.file.mimetype)){
				path = req.files.file.path;
				done('上传的不是图片格式，请检查');
			}else{
				console.log('[img]:',req.files.file);
				path = req.files.file.path;
				path = path.replace(config.FILEPATH,'');
				path = path.replace('public/','');
				done();
			}
		}
	},function(err){
		console.log('--',err,path);
		if(err){
			fs.unlink(path);
            res.send({status: -1, content: err});
        }else{
            res.send({status:0, url:path});
        } 
	});	
};