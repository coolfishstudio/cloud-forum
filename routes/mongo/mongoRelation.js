var relationColl = require('./mongo').getCollection('forum_relation');

exports.insert = function(relationObj, callback){
	relationColl.insert(relationObj, callback);
};

exports.update = function(relationID, relationObj, callback){
	relationColl.findAndModify({_id: relationID.toLowerCase()}, [], {$set: relationObj}, {new: true}, callback);
};

exports.remove = function(relationID, callback){
	relationColl.remove({_id: relationID}, callback);
};

exports.getAll = function(pageNum, page, callback){
	relationColl.find().sort({'createTimestamp':-1}).limit(pageNum).skip(pageNum * (page - 1)).toArray(callback);
};

exports.getById = function(relationID, callback){
	relationColl.findOne({_id:relationID},callback);
};