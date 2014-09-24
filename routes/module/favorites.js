var mongoFavorites = require('../mongo/mongoFavorites');

/* 增删查改 */
exports.insert = mongoFavorites.insert;
exports.update = mongoFavorites.update;
exports.remove = mongoFavorites.remove;
exports.getAll = mongoFavorites.getAll;
exports.getById = mongoFavorites.getById;