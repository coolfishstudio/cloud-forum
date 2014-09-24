var favoritesColl = require('./mongo').getCollection('forum_favorites');
var tool = require('../util/tool');

exports.insert = function(favoritesObj, callback){
	favoritesObj._id = tool.generateUUID();
	favoritesObj.createTimestamp = new Date().getTime();
	favoritesObj.createDate = tool.getThisTime();
	favoritesColl.insert(favoritesObj, callback);
};

exports.update = function(favoritesID, favoritesObj, callback){
	favoritesObj.updateDate = tool.getThisTime();
	favoritesColl.findAndModify({_id: favoritesID.toLowerCase()}, [], {$set: favoritesObj}, {new: true}, callback);
};

exports.remove = function(favoritesID, callback){
	favoritesColl.remove({_id: favoritesID}, callback);
};

exports.getAll = function(pageNum, page, callback){
	favoritesColl.find().sort({'createTimestamp':-1}).limit(pageNum).skip(pageNum * (page - 1)).toArray(callback);
};

exports.getById = function(favoritesID, callback){
	favoritesColl.findOne({_id:favoritesID},callback);
};