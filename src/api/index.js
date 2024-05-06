const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const pelanggan = require('./components/pelanggan/pelanggan-route');
const penjual = require('./components/penjual/penjual-route');
const items = require('./components/items/items-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  pelanggan(app);
  penjual(app);
  items(app);

  return app;
};
