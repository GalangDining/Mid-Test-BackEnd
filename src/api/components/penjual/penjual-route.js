const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const penjualController = require('./penjual-controller');
const penjualValidator = require('./penjual-validator');


const route = express.Router();

module.exports = (app) => {
  app.use('/penjual', route);
  
// Route untuk mendapatkan item berdasarkan email penjual
route.get('/get-items', authenticationMiddleware, celebrate(penjualValidator.getItem), penjualController.getItemAndItemsByEmail);

// Route untuk mendapatkan daftar pengguna (penjual)
route.get('/get-users', authenticationMiddleware, penjualController.getUsers);

// Route untuk membuat pengguna (penjual) baru
route.post('/', authenticationMiddleware, celebrate(penjualValidator.createUser), penjualController.createUser);

// Route untuk mendapatkan informasi pengguna (penjual) berdasarkan ID
route.get('/:id', authenticationMiddleware, penjualController.getUser);

// Route untuk memperbarui informasi pengguna (penjual) berdasarkan ID
route.put('/:id', authenticationMiddleware, celebrate(penjualValidator.updateUser), penjualController.updateUser);

// Route untuk menghapus pengguna (penjual) berdasarkan ID
route.delete('/:id', authenticationMiddleware, penjualController.deleteUser);

// Route untuk mengganti kata sandi pengguna (penjual) berdasarkan ID
route.post('/:id/change-password', authenticationMiddleware, celebrate(penjualValidator.changePassword), penjualController.changePassword);

  
  




}