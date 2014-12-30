var tagColl = require('./mongo').getCollection('forum_tag');
var tool = require('../util/tool');

exports.insert = function(tagObj, callback){
	tagObj._id = tool.generateUUID();
	tagObj.createTimestamp = new Date().getTime();
	tagObj.createDate = tool.getThisTime();
	tagColl.insert(tagObj, callback);
};

exports.update = function(tagID, tagObj, callback){
	tagObj.updateDate = tool.getThisTime();
	tagColl.findAndModify({_id: tagID.toLowerCase()}, [], {$set: tagObj}, {new: true}, callback);
};

exports.remove = function(tagID, callback){
	tagColl.remove({_id: tagID}, callback);
};

exports.getAll = function(pageNum, page, callback){
	tagColl.find().sort({'createTimestamp':-1}).limit(pageNum).skip(pageNum * (page - 1)).toArray(callback);
};

exports.getById = function(tagID, callback){
	tagColl.findOne({_id:tagID},callback);
};