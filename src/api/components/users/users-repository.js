const { User } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers() {
  return User.find({});
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
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

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}


// Fungsi untuk mendapatkan daftar pengguna dengan pagination
// Parameter:
// - skip: Jumlah data yang akan dilewati (untuk pagination)
// - limit: Batas jumlah data yang akan diambil (untuk pagination)
// - sortField: Nama field yang akan digunakan untuk pengurutan
// - sortOrder: Urutan pengurutan (1 untuk ascending, -1 untuk descending)
// - searchQuery: Kriteria pencarian untuk filter data
async function getPaginationUsers(skip, limit, sortField, sortOrder, searchQuery) {
  // Menggunakan method find dari model User dengan kriteria pencarian (searchQuery)
  // Dilanjutkan dengan skip (melewati data) dan limit (membatasi jumlah data)
  // Kemudian diurutkan berdasarkan field (sortField) dan sortOrder yang ditentukan
  return User.find(searchQuery).skip(skip).limit(limit).sort({ [sortField]: sortOrder });
}

// Fungsi untuk menghitung jumlah pengguna berdasarkan kriteria pencarian
// Parameter:
// - searchQuery: Kriteria pencarian untuk filter data
async function countUsers(searchQuery) {
  // Menggunakan method countDocuments dari model User dengan kriteria pencarian (searchQuery)
  return User.countDocuments(searchQuery);
}





module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
  getPaginationUsers,
  countUsers,
  // new module 
  
};
