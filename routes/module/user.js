var mongoUser = require('../mongo/mongoUser');

/* 增删查改 */
exports.insert = mongoUser.insert;
exports.update = mongoUser.update;
exports.remove = mongoUser.remove;
exports.getAll = mongoUser.getAll;
exports.getById = mongoUser.getById;

exports.getByUserName = mongoUser.getByUserName;
exports.getByEmail = mongoUser.getByEmail;
