const { Penjual } = require('../../../models');
const { Item } = require('../../../models');

// Fungsi untuk mendapatkan daftar semua pengguna (penjual)
async function getUsers() {
  return Penjual.find({});
}

// Fungsi untuk mendapatkan detail pengguna (penjual) berdasarkan ID
async function getUser(id) {
  return Penjual.findById(id);
}

// Fungsi untuk membuat pengguna (penjual) baru
async function createUser(name, email, password, income) {
  return Penjual.create({
    name,
    email,
    password,
    income,
  });
}

// Fungsi untuk memperbarui informasi pengguna (penjual) berdasarkan ID
async function updateUser(id, name, email) {
  return Penjual.updateOne(
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

// Fungsi untuk menghapus pengguna (penjual) berdasarkan ID
async function deleteUser(id) {
  return Penjual.deleteOne({ _id: id });
}

// Fungsi untuk mendapatkan detail pengguna (penjual) berdasarkan email
async function getUserByEmail(email) {
  return Penjual.findOne({ email });
}

// Fungsi untuk mengubah kata sandi pengguna (penjual) berdasarkan ID
async function changePassword(id, password) {
  return Penjual.updateOne({ _id: id }, { $set: { password } });
}

// Fungsi untuk mendapatkan item berdasarkan email penjual
async function getItemByEmail(email) {
  return Item.find({ email });
}


module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
  getItemByEmail,
  getUserByEmail,
}





































// async function getPaginationPenjual(skip, limit, sortField, sortOrder, searchQuery) {
//   return Item.find(searchQuery).skip(skip).limit(limit).sort({ [sortField]: sortOrder });
// }
// async function countUsers(searchQuery) {
//   return Item.countDocuments(searchQuery);
// }
  
