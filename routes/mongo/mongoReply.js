var replyColl = require('./mongo').getCollection('forum_reply');
var tool = require('../util/tool');

/*回复*/
exports.insert = function(replyObj, callback){
	replyObj._id = tool.generateUUID();
	replyObj.ups = [];//赞
	replyObj.downs = [];//损
	replyObj.isWaste = false;//是否废弃
	replyObj.createTimestamp = new Date().getTime();
	replyObj.createDate = tool.getThisTime();
	replyColl.insert(replyObj, callback);
};

exports.update = function(replyID, replyObj, callback){
	replyObj.updateDate = tool.getThisTime();
	replyColl.findAndModify({_id: replyID.toLowerCase()}, [], {$set: replyObj}, {new: true}, callback);
};

exports.remove = function(replyID, callback){
	replyColl.remove({_id: replyID}, callback);
};

exports.getAll = function(pageNum, page, callback){
	replyColl.find().sort({'createTimestamp':-1}).limit(pageNum).skip(pageNum * (page - 1)).toArray(callback);
};

exports.getById = function(replyID, callback){
	replyColl.findOne({_id:replyID},callback);
};

exports.getAllByTopicId = function(pageNum, page, info, callback){
	info.isWaste = false;
	replyColl.find(info).sort({'createTimestamp':-1}).limit(pageNum).skip(pageNum * (page - 1)).toArray(callback);
};

exports.getCount = function(info, callback){
	replyColl.count(info, callback);
};