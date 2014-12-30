var relationColl = require('./mongo').getCollection('forum_relation');
var tool = require('../util/tool');

/*关注*/
exports.insert = function(relationObj, callback){
	relationObj._id = tool.generateUUID();
	relationObj.createTimestamp = new Date().getTime();
	relationObj.createDate = tool.getThisTime();
	relationColl.insert(relationObj, callback);
};

exports.update = function(relationID, relationObj, callback){
	relationObj.updateDate = tool.getThisTime();
	relationColl.findAndModify({_id: relationID.toLowerCase()}, [], {$set: relationObj}, {new: true}, callback);
};

exports.remove = function(relationID, callback){
	relationColl.remove({_id: relationID}, callback);
};

exports.getAll = function(pageNum, page, callback){
	relationColl.find().sort({'createTimestamp':-1}).limit(pageNum).skip(pageNum * (page - 1)).toArray(callback);
};

exports.getById = function(relationID, callback){
	relationColl.findOne({_id:relationID},callback);
};