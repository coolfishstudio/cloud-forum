var config = require('../../config');//获取config.js下的配置信息文件内容
var mongoskin = require('mongoskin');//加在mongoskin的模块，封装后的mongodb
var db = null;

exports.getCollection = function(collectionName){
	if (!db) {
		db = mongoskin.db(config.MONGO_URI + '?auto_reconnect=true&poolSize=3',
			{numberOfRetries: 1, retryMiliSeconds: 500, safe: true, native_parser: true},
			{socketOptions: {timeout: 5000}});
	}
	return db.collection(collectionName);
};

exports.ObjectID = mongoskin.ObjectID;