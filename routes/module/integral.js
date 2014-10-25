var mongoIntegral = require('../mongo/mongoIntegral');

/* 增删查改 */
exports.insert = mongoIntegral.insert;
exports.update = mongoIntegral.update;
exports.remove = mongoIntegral.remove;
exports.getAll = mongoIntegral.getAll;
exports.getById = mongoIntegral.getById;