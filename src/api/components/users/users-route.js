const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const usersControllers = require('./users-controller');
const usersValidator = require('./users-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/users', route);

// Route untuk mendapatkan halaman baru dengan pagination pengguna
route.get('/new-pagination', authenticationMiddleware, usersControllers.getPaginationUsers);

// Route untuk login pengguna
route.post('/login', authenticationMiddleware, celebrate(usersValidator.login), usersControllers.login);

// Route untuk mendapatkan daftar pengguna
route.get('/old', authenticationMiddleware, usersControllers.getUsers);

// Route untuk membuat pengguna baru
route.post('/', authenticationMiddleware, celebrate(usersValidator.createUser), usersControllers.createUser);

// Route untuk mendapatkan detail pengguna berdasarkan ID
route.get('/:id', authenticationMiddleware, usersControllers.getUser);

// Route untuk memperbarui informasi pengguna berdasarkan ID
route.put('/:id', authenticationMiddleware, celebrate(usersValidator.updateUser), usersControllers.updateUser);

// Route untuk menghapus pengguna berdasarkan ID
route.delete('/:id', authenticationMiddleware, usersControllers.deleteUser);

// Route untuk mengganti kata sandi pengguna berdasarkan ID
route.post('/:id/change-password', authenticationMiddleware, celebrate(usersValidator.changePassword), usersControllers.changePassword);




};

