var mongoRelation = require('../mongo/mongoRelation');

/* 增删查改 */
exports.insert = mongoRelation.insert;
exports.update = mongoRelation.update;
exports.remove = mongoRelation.remove;
exports.getAll = mongoRelation.getAll;
exports.getById = mongoRelation.getById;
