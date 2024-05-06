const mongoose = require('mongoose');
const config = require('../core/config');
const logger = require('../core/logger')('app');

const usersSchema = require('./users-schema');
const pelangganSchema = require('./pelanggan-schema');
const penjualSchema = require('./penjual-schema');
const itemsSchema = require('./items-schema')

mongoose.connect(`${config.database.connection}/${config.database.name}`, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.once('open', () => {
  logger.info('Successfully connected to MongoDB');
});

const User = mongoose.model('users', mongoose.Schema(usersSchema));
const Pelanggan = mongoose.model('pelanggan', mongoose.Schema(pelangganSchema));
const Penjual = mongoose.model('penjual', mongoose.Schema(penjualSchema));
const Item = mongoose.model('item', mongoose.Schema(itemsSchema));

module.exports = {
  mongoose,
  User,
  Pelanggan,
  Penjual,
  Item,
};
