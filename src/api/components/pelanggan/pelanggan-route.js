const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const pelangganController = require('./pelanggan-conttoller');
const pelangganValidator = require('./pelanggan-validator');


const route = express.Router();

module.exports = (app) => {
  app.use('/pelanggan', route);

// Route untuk melakukan transaksi pembelian item
route.put('/transaksi', authenticationMiddleware, celebrate(pelangganValidator.BUYITEM), pelangganController.BUYITEM
);

// Route untuk mendapatkan halaman dengan pagination item
route.get('/pagination', authenticationMiddleware, pelangganController.getPaginationItems
);

// Route untuk mendapatkan halaman beranda dengan daftar item
route.get('/beranda', authenticationMiddleware, pelangganController.getItems
);

// Route untuk mendapatkan daftar pengguna
route.get('/', authenticationMiddleware, pelangganController.getUsers
);

// Route untuk membuat pengguna baru
route.post('/', authenticationMiddleware, celebrate(pelangganValidator.createUser), pelangganController.createUser
);

// Route untuk mendapatkan informasi pengguna berdasarkan ID
route.get('/:id', authenticationMiddleware, pelangganController.getUser
);

// Route untuk memperbarui informasi pengguna berdasarkan ID
route.put('/:id', authenticationMiddleware, celebrate(pelangganValidator.updateUser), pelangganController.updateUser
);

// Route untuk menghapus pengguna berdasarkan ID
route.delete('/:id', authenticationMiddleware, pelangganController.deleteUser
);

// Route untuk mengganti kata sandi pengguna berdasarkan ID
route.post('/:id/change-password', authenticationMiddleware, celebrate(pelangganValidator.changePassword), pelangganController.changePassword
);

// Route untuk melakukan top-up saldo pengguna berdasarkan ID
route.put('/:id/top-up', authenticationMiddleware, celebrate(pelangganValidator.topUp), pelangganController.topUpSaldo
);

};


