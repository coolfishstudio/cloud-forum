var userColl = require('./mongo').getCollection('user');

exports.insert = function(userObj, callback){
	userColl.insert(userObj, callback);
};

exports.update = function(userID, userObj, callback){
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