var mongoTopic = require('../mongo/mongoTopic');

/* 增删查改 */
exports.insert = mongoTopic.insert;
exports.update = mongoTopic.update;
exports.remove = mongoTopic.remove;
exports.getAll = mongoTopic.getAll;
exports.getById = mongoTopic.getById;

exports.handle = mongoTopic.handle;
exports.getCount = mongoTopic.getCount;

