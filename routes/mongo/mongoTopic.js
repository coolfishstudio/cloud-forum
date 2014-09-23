var topicColl = require('./mongo').getCollection('forum_topic');

exports.insert = function(topicObj, callback){
	topicColl.insert(topicObj, callback);
};

exports.update = function(topicID, topicObj, callback){
	topicColl.findAndModify({_id: topicID.toLowerCase()}, [], {$set: topicObj}, {new: true}, callback);
};

exports.remove = function(topicID, callback){
	topicColl.remove({_id: topicID}, callback);
};

exports.getAll = function(pageNum, page, callback){
	topicColl.find().sort({'createTimestamp':-1}).limit(pageNum).skip(pageNum * (page - 1)).toArray(callback);
};

exports.getById = function(topicID, callback){
	topicColl.findOne({_id:topicID},callback);
};