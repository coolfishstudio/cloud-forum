var favoritesColl = require('./mongo').getCollection('favorites');

exports.insert = function(favoritesObj, callback){
	favoritesColl.insert(favoritesObj, callback);
};

exports.update = function(favoritesID, favoritesObj, callback){
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