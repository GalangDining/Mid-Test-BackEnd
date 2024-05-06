const { Pelanggan } = require('../../../models');
const { Item } = require('../../../models');

// Fungsi untuk mendapatkan daftar semua pelanggan
async function getUsers() {
  return Pelanggan.find({});
}

// Fungsi untuk mendapatkan daftar semua item
async function getItems() {
  return Item.find({});
}

// Fungsi untuk mendapatkan detail pelanggan berdasarkan ID
async function getUser(id) {
  return Pelanggan.findById(id);
}

// Fungsi untuk membuat pelanggan baru
async function createUser(name, email, password) {
  return Pelanggan.create({
    name,
    email,
    password,
  });
}

// Fungsi untuk memperbarui informasi pelanggan berdasarkan ID
async function updateUser(id, name, email) {
  return Pelanggan.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

// Fungsi untuk menghapus pelanggan berdasarkan ID
async function deleteUser(id) {
  return Pelanggan.deleteOne({ _id: id });
}

// Fungsi untuk mendapatkan detail pelanggan berdasarkan email
async function getUserByEmail(email) {
  return Pelanggan.findOne({ email });
}

// Fungsi untuk mengubah kata sandi pelanggan berdasarkan ID
async function changePassword(id, password) {
  return Pelanggan.updateOne({ _id: id }, { $set: { password } });
}

// Fungsi untuk memperbarui saldo pelanggan berdasarkan ID
async function updateUserSaldo(id, newSaldo) {
  return Pelanggan.updateOne(
    { _id: id },
    { $set: { saldo: newSaldo } }
  );
}

// Fungsi untuk mendapatkan detail item berdasarkan ID
async function getItem(id) {
  return Item.findById(id);
}

// Fungsi untuk memperbarui stok item berdasarkan ID
async function updateStok(id, newStok) {
  return Item.updateOne({ _id: id }, { stok_barang: newStok });
}

// Fungsi untuk mendapatkan daftar item dengan pagination
async function getPaginationItems(skip, limit, sortField, sortOrder, searchQuery) {
  return Item.find(searchQuery).skip(skip).limit(limit).sort({ [sortField]: sortOrder });
}

// Fungsi untuk menghitung jumlah item berdasarkan kriteria pencarian
async function countItems(searchQuery) {
  return Item.countDocuments(searchQuery);
}


module.exports = {
  getUsers,
  getItems,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
  updateUserSaldo,
  getItem,
  updateStok,
  getPaginationItems,
  countItems,
}