var mongoStat = require('../mongo/mongoStat');

/* 增删查改 */
exports.insert = mongoStat.insert;
exports.update = mongoStat.update;
exports.remove = mongoStat.remove;
exports.getAll = mongoStat.getAll;
exports.getById = mongoStat.getById;