var mongoTag = require('../mongo/mongoTag');

/* 增删查改 */
exports.insert = mongoTag.insert;
exports.update = mongoTag.update;
exports.remove = mongoTag.remove;
exports.getAll = mongoTag.getAll;
exports.getById = mongoTag.getById;