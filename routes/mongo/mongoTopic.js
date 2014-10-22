var topicColl = require('./mongo').getCollection('forum_topic');
var tool = require('../util/tool');

exports.insert = function(topicObj, callback){
	topicObj._id = tool.generateUUID();
	topicObj.createTimestamp = new Date().getTime();
	topicObj.updateTimestamp = new Date().getTime();
	topicObj.createDate = tool.getThisTime();
	topicObj.visitQuantity = 1;//点击量
	topicObj.replyQuantity = 0;//回复量
	topicObj.collectQuantity = 0;//收藏量
	topicObj.isTop = false;//是否置顶
	topicObj.isGood = false;//是否加精
	topicObj.lastUser = topicObj.userId;//最后一个回复的人
	topicObj.lastTimestamp = new Date().getTime();//最后一个回复时间
	topicColl.insert(topicObj, callback);
};

exports.update = function(topicID, topicObj, callback){
	topicObj.updateTimestamp = new Date().getTime();
	topicColl.findAndModify({_id: topicID.toLowerCase()}, [], {$set: topicObj}, {new: true}, callback);
};

exports.handle = function(topicID, topicObj, callback){
	topicColl.findAndModify({_id: topicID.toLowerCase()}, [], {$set: topicObj}, {new: true}, callback);
};

exports.remove = function(topicID, callback){
	topicColl.remove({_id: topicID}, callback);
};

exports.getAll = function(pageNum, page, callback){
	topicColl.find().sort({'isTop':-1,'lastTimestamp':-1}).limit(pageNum).skip(pageNum * (page - 1)).toArray(callback);
};

exports.getById = function(topicID, callback){
	topicColl.findOne({_id:topicID},callback);
};