var topicColl = require('./mongo').getCollection('forum_topic');
var tool = require('../util/tool');

exports.insert = function(topicObj, callback){
	topicObj._id = tool.generateUUID();
	topicObj.createTimestamp = new Date().getTime();
	topicObj.updateTimestamp = new Date().getTime();
	topicObj.createDate = tool.getThisTime();
	topicObj.visitQuantity = 1;//点击量
	topicObj.replyQuantity = 0;//回复量
	topicColl.insert(topicObj, callback);
};

exports.update = function(topicID, topicObj, callback){
	topicObj.updateTimestamp = new Date().getTime();
	topicColl.findAndModify({_id: topicID.toLowerCase()}, [], {$set: topicObj}, {new: true}, callback);
};

exports.remove = function(topicID, callback){
	topicColl.remove({_id: topicID}, callback);
};

exports.getAll = function(pageNum, page, callback){
	topicColl.find().sort({'updateTimestamp':-1}).limit(pageNum).skip(pageNum * (page - 1)).toArray(callback);
};

exports.getById = function(topicID, callback){
	topicColl.findOne({_id:topicID},callback);
};