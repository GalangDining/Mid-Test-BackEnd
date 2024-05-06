const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const { BUYITEM } = require('./pelanggan-conttoller');
const { jenis_barang } = require('../../../models/items-schema');
const joiPassword = joi.extend(joiPasswordExtendCore);

module.exports = {
  createUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
      password: joiPassword
        .string()
        // .minOfSpecialCharacters(1).minOfLowercase(1).minOfUppercase(1).minOfNumeric(1).noWhiteSpaces().onlyLatinCharacters()
        .min(6).max(32).required().label('Password'),
      password_confirm: joi.string().required().label('Password confirmation'),
    },
  },

  updateUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
    },
  },

  changePassword: {
    body: {
      password_old: joi.string().required().label('Old password'),
      password_new: joiPassword.string().minOfSpecialCharacters(1).minOfLowercase(1).minOfUppercase(1).minOfNumeric(1).noWhiteSpaces().onlyLatinCharacters().min(6).max(32).required().label('New password'),
      password_confirm: joi.string().required().label('Password confirmation'),
    },
  },
  topUp: {
    body: {
      amount: joi.number().integer().min(1).required().label('Amount'),
    },
  },

  BUYITEM: {
    body : {
      id_barang: joi.string().min(1).max(100).required().label('ID Barang'),
      id_pelanggan: joi.string().min(1).max(100).required().label('ID Pelanggam'),
      banyak_barang: joi.string().min(1).max(100).required().label('Banyak Barang yang dibeli'),
      jenis_barang: joi.string().min(1).max(100).required().label('Jenis Barang yang dibeli'),
    }
  }
  
  
};

