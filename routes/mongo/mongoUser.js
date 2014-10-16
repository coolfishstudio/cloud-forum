var userColl = require('./mongo').getCollection('user');
var tool = require('../util/tool');

exports.insert = function(userObj, callback){
	userObj._id = tool.generateUUID();
	userObj.createTimestamp = new Date().getTime();
	userObj.createDate = tool.getThisTime();
	userColl.insert(userObj, callback);
};

exports.update = function(userID, userObj, callback){
	userObj.updateDate = tool.getThisTime();
	userColl.findAndModify({_id: userID.toLowerCase()}, [], {$set: userObj}, {new: true}, callback);
};

exports.remove = function(userID, callback){
	userColl.remove({_id: userID}, callback);
};

exports.getAll = function(pageNum, page, callback){
	userColl.find().sort({'createTimestamp':-1}).limit(pageNum).skip(pageNum * (page - 1)).toArray(callback);
};

exports.getById = function(userID, callback){
	userColl.findOne({_id:userId},callback);
};

exports.getByUserName = function(userName, callback){
	userColl.findOne({userName : userName},callback);
};

exports.getByEmail = function(email, callback){
	userColl.findOne({email : email},callback);
};
