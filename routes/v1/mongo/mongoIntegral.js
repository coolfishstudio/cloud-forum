var integralColl = require('./mongo').getCollection('forum_integral');
var tool = require('../util/tool');

/*积分*/
exports.insert = function(integralObj, callback){
	integralObj._id = tool.generateUUID();
	integralObj.createTimestamp = new Date().getTime();
	integralObj.createDate = tool.getThisTime();
	integralColl.insert(integralObj, callback);
};

exports.update = function(userId, integralObj, callback){
	integralObj.updateDate = tool.getThisTime();
	integralColl.findAndModify({userId: userId.toLowerCase()}, [], {$set: integralObj}, {new: true}, callback);
};

exports.remove = function(integralID, callback){
	integralColl.remove({_id: integralID}, callback);
};

exports.getAll = function(pageNum, page, callback){
	integralColl.find().sort({'createTimestamp':-1}).limit(pageNum).skip(pageNum * (page - 1)).toArray(callback);
};

exports.getById = function(userId, callback){
	integralColl.findOne({userId:userId},callback);
};