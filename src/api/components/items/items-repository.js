const { Item } = require('../../../models');
const { Penjual } = require('../../../models');
// Fungsi untuk mendapatkan detail pengguna (penjual) berdasarkan email
async function getUserByEmail(email) {
  return Penjual.findOne({ email });
}

// Fungsi untuk mendapatkan detail item berdasarkan ID
async function getItem(id) {
  return Item.findById(id);
}

// Fungsi untuk membuat item baru
async function createItems(email, nama_barang, jenis_barang, stok_barang, harga_barang, lokasi_penjual) {
  return Item.create({
    email,
    nama_barang,
    jenis_barang,
    stok_barang,
    harga_barang,
    lokasi_penjual
  });
}

// Fungsi untuk memperbarui informasi item berdasarkan ID
async function updateItems(id, nama_barang, jenis_barang, stok_barang, harga_barang, lokasi_penjual) {
  return Item.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        nama_barang,
        jenis_barang,
        stok_barang,
        harga_barang,
        lokasi_penjual
      },
    }
  );
}

// Fungsi untuk menghapus item berdasarkan ID
async function deleteItems(id) {
  return Item.deleteOne({ _id: id });
}

// Fungsi untuk memperbarui stok item berdasarkan ID
async function updateStok(id, newStok) {
  return Item.updateOne({ _id: id }, { stok_barang: newStok });
}



module.exports = {
  getUserByEmail,
  getItem,
  createItems,
  updateItems,
  deleteItems,
  updateStok,
}