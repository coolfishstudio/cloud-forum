var mongoReply = require('../mongo/mongoReply');

/* 增删查改 */
exports.insert = mongoReply.insert;
exports.update = mongoReply.update;
exports.remove = mongoReply.remove;
exports.getAll = mongoReply.getAll;
exports.getById = mongoReply.getById;

exports.getAllByTopicId = mongoReply.getAllByTopicId;
exports.getCount = mongoReply.getCount;