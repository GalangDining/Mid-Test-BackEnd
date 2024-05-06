const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const itemController = require('./items-controller');
const itemValidator = require('./items-validator');

const route = express.Router(); 

module.exports = (app) => {
  app.use('/item', route);
// Route untuk mengurangi stok suatu item
route.put('/reduceStok', authenticationMiddleware, celebrate(itemValidator.reduceStok), itemController.reduceStok);

// Route untuk menambah stok suatu item
route.put('/addedStok', authenticationMiddleware, celebrate(itemValidator.addedStok), itemController.addedStok);

// Route untuk mengunggah item baru
route.post('/uploud-item', authenticationMiddleware, celebrate(itemValidator.createItems), itemController.createItems);

// Route untuk memperbarui informasi suatu item berdasarkan ID
route.put('/:id', authenticationMiddleware, celebrate(itemValidator.updateItems), itemController.updateItems);

// Route untuk menghapus suatu item berdasarkan ID
route.delete('/:id', authenticationMiddleware, itemController.deleteItems);


}