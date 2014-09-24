var topicColl = require('./mongo').getCollection('forum_topic');
var tool = require('../util/tool');

exports.insert = function(topicObj, callback){
	topicObj._id = tool.generateUUID();
	topicObj.createTimestamp = new Date().getTime();
	topicObj.createDate = tool.getThisTime();
	topicColl.insert(topicObj, callback);
};

exports.update = function(topicID, topicObj, callback){
	topicObj.updateDate = tool.getThisTime();
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