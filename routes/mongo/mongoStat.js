var statColl = require('./mongo').getCollection('stat');
var tool = require('../util/tool');

exports.insert = function(statObj, callback){
	statObj._id = tool.generateUUID();
	statObj.createTimestamp = new Date().getTime();
	statObj.createDate = tool.getThisTime();
	statColl.insert(statObj, callback);
};

exports.update = function(statID, statObj, callback){
	statObj.updateDate = tool.getThisTime();
	statColl.findAndModify({_id: statID.toLowerCase()}, [], {$set: statObj}, {new: true}, callback);
};

exports.remove = function(statID, callback){
	statColl.remove({_id: statID}, callback);
};

exports.getAll = function(pageNum, page, callback){
	statColl.find().sort({'createTimestamp':-1}).limit(pageNum).skip(pageNum * (page - 1)).toArray(callback);
};

exports.getById = function(statID, callback){
	statColl.findOne({_id:statID},callback);
};