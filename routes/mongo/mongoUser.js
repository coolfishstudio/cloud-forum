var userColl = require('./mongo').getCollection('user');
var tool = require('../util/tool');

exports.insert = function(userObj, callback){
	userObj._id = tool.generateUUID();
	userObj.createTimestamp = new Date().getTime();
	userObj.createDate = tool.getThisTime();
	// userObj.power = 'a';
	userObj.power = 'c';
	// userObj.headSrc = '/images/face/yves.png';//头像
	userObj.headSrc = '/images/face/default/' + tool.getZeroize(Math.round(Math.random()*20) + 1) + '.png';//头像
	userObj.describe = ' 这家伙很懒，什么个性签名都没有留下。';//描述
	userObj.lastLoginDate = tool.getThisTime();//最后登陆
	userColl.insert(userObj, callback);
};

exports.update = function(userID, userObj, callback){
	userObj.updateDate = tool.getThisTime();
	userObj.updateTimestamp = new Date().getTime();
	userColl.findAndModify({_id: userID.toLowerCase()}, [], {$set: userObj}, {new: true}, callback);
};

exports.remove = function(userID, callback){
	userColl.remove({_id: userID}, callback);
};

exports.getAll = function(pageNum, page, callback){
	userColl.find().sort({'createTimestamp':-1}).limit(pageNum).skip(pageNum * (page - 1)).toArray(callback);
};

exports.getById = function(userID, callback){
	userColl.findOne({_id:userID},callback);
};

exports.getCount = function(info, callback){
	userColl.count(info, callback);
};
exports.getByUserName = function(userName, callback){
	userColl.findOne({name : userName},callback);
};

exports.getByEmail = function(email, callback){
	userColl.findOne({email : email},callback);
};
