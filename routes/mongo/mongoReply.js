var replyColl = require('./mongo').getCollection('forum_reply');
var tool = require('../util/tool');

exports.insert = function(replyObj, callback){
	replyObj._id = tool.generateUUID();
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