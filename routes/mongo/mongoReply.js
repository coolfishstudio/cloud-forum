var replyColl = require('./mongo').getCollection('forum_reply');

exports.insert = function(replyObj, callback){
	replyColl.insert(replyObj, callback);
};

exports.update = function(replyID, replyObj, callback){
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