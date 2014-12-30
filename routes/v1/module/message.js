var mongoMessage = require('../mongo/mongoMessage');

/* 增删查改 */
exports.insert = mongoMessage.insert;
exports.update = mongoMessage.update;
exports.remove = mongoMessage.remove;
exports.getAll = mongoMessage.getAll;
exports.getById = mongoMessage.getById;