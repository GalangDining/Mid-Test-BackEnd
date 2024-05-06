const joi = require('joi');
const { addedIncome } = require('./items-service');

module.exports = {
  createItems: {
    body : {
      email: joi.string().email().required().label('Email'),
      nama_barang : joi.string().min(1).max(100).required().label('Nama barang'),
      jenis_barang: joi.string().min(1).max(100).required().label('Jenis barang'),
      stok_barang : joi.string().min(1).max(100).required().label('Stok barang'),
      harga_barang: joi.string().min(1).max(100).required().label('Harga barang'),
      lokasi_penjual: joi.string().min(1).max(100).required().label('Lokasi Penjual'),
    },
  },
  updateItems: {
    body : {
      nama_barang : joi.string().min(1).max(100).required().label('Nama barang'),
      jenis_barang: joi.string().min(1).max(100).required().label('Jenis barang'),
      stok_barang : joi.string().min(1).max(100).required().label('Stok barang'),
      harga_barang: joi.string().min(1).max(100).required().label('Harga barang'),
      lokasi_penjual: joi.string().min(1).max(100).required().label('Lokasi Penjual'),
    },
  },
  reduceStok: {
    body: {
      id: joi.string().min(1).max(100).required().label('ID Barang'),
      newStok: joi.number().integer().min(0).required().label('New Stok')
    },
  },
  addedStok: {
    body: {
      id: joi.string().min(1).max(100).required().label('ID Barang'),
      newStok: joi.number().integer().min(0).required().label('New Stok')
    },
  },

}