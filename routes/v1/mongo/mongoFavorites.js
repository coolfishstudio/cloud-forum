var favoritesColl = require('./mongo').getCollection('forum_favorites');
var tool = require('../util/tool');

/*收藏*/
exports.insert = function(favoritesObj, callback){
	favoritesObj._id = tool.generateUUID();
	favoritesObj.createTimestamp = new Date().getTime();
	favoritesColl.insert(favoritesObj, callback);
};

exports.update = function(favoritesID, favoritesObj, callback){
	favoritesColl.findAndModify({_id: favoritesID.toLowerCase()}, [], {$set: favoritesObj}, {new: true}, callback);
};

exports.remove = function(favoritesID, callback){
	favoritesColl.remove({_id: favoritesID}, callback);
};

exports.getAll = function(pageNum, page, info, callback){
	favoritesColl.find(info).sort({'createTimestamp':-1}).limit(pageNum).skip(pageNum * (page - 1)).toArray(callback);
};

exports.getById = function(info, callback){
	favoritesColl.findOne(info,callback);
};