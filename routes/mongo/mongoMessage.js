var messageColl = require('./mongo').getCollection('forum_message');

exports.insert = function(messageObj, callback){
	messageColl.insert(messageObj, callback);
};

exports.update = function(messageID, messageObj, callback){
	messageColl.findAndModify({_id: messageID.toLowerCase()}, [], {$set: messageObj}, {new: true}, callback);
};

exports.remove = function(messageID, callback){
	messageColl.remove({_id: messageID}, callback);
};

exports.getAll = function(pageNum, page, callback){
	messageColl.find().sort({'createTimestamp':-1}).limit(pageNum).skip(pageNum * (page - 1)).toArray(callback);
};

exports.getById = function(messageID, callback){
	messageColl.findOne({_id:messageID},callback);
};