const itemRepository = require('./items-repository');

// Fungsi ini digunakan untuk memeriksa apakah email telah terdaftar di sistem.
async function emailIsRegistered(email) {
  const user = await itemRepository.getUserByEmail(email);

  if (user) {
    return true; // Email terdaftar
  }

  return false; // Email tidak terdaftar
}

// Fungsi ini digunakan untuk mendapatkan detail item berdasarkan ID.
async function getItem(id) {
  const item = await itemRepository.getItem(id);

  if (!item) {  // Item tidak ditemukan
    return null;
  }

  // Mengembalikan detail item dalam format yang sesuai.
  return {
    id : item.id,
    nama_barang: item.nama_barang,
    jenis_barang: item.jenis_barang,
    stok_barang: item.stok_barang,
    harga_barang: item.harga_barang,
    lokasi_penjual: item.lokasi_penjual,
  };
}

// Fungsi ini digunakan untuk membuat item baru.
async function createItems(email, nama_barang, jenis_barang, stok_barang, harga_barang, lokasi_penjual) {
  try {
    // Memanggil repository untuk membuat item baru.
    await itemRepository.createItems(email, nama_barang, jenis_barang, stok_barang, harga_barang, lokasi_penjual);
  } catch (err) {
    return null; // Operasi gagal, mengembalikan null
  }
  return true; // Operasi berhasil
}

// Fungsi ini digunakan untuk mengupdate detail item.
async function updateItems(id, nama_barang, jenis_barang, stok_barang, harga_barang, lokasi_penjual) {
  const item = await itemRepository.getItem(id);
  if (!item) {
    return null; // Item tidak ditemukan
  } 

  try {
    // Memanggil repository untuk mengupdate detail item.
    await itemRepository.updateItems(id, nama_barang, jenis_barang, stok_barang, harga_barang, lokasi_penjual);
    return true; // Operasi berhasil
  } catch (err) {
    return null; // Operasi gagal
  }
}

// Fungsi ini digunakan untuk menghapus item.
async function deleteItems(id) {
  const item = await itemRepository.getItem(id);

  if (!item) {
    return null; // Item tidak ditemukan
  }
  try {
    // Memanggil repository untuk menghapus item.
    await itemRepository.deleteItems(id);
    return true; // Operasi berhasil
  } catch (err) {
    return null; // Operasi gagal
  }
}

// Fungsi ini digunakan untuk mengurangi stok item.
async function reduceStok(id, reducedStok) {
  try {
    const item = await itemRepository.getItem(id);
    if (!item) {
      return null; // Item tidak ditemukan
    }

    const currentStok = parseInt(item.stok_barang);
    const parsedReducedStok = parseInt(reducedStok);

    if (parsedReducedStok >= 0) {
      if (parsedReducedStok > currentStok) {
        throw new Error('Stok tidak mencukupi');
      } else {
        const remainingStok = currentStok - parsedReducedStok;
        await itemRepository.updateStok(id, remainingStok.toString());
      }
      return true; // Operasi berhasil
    } else {
      throw new Error('Jumlah stok yang dikurangi tidak valid.');
    }
  } catch (error) {
    throw error; // Mengembalikan pesan error khusus
  }
}

// Fungsi ini digunakan untuk menambah stok item.
async function addedStok(id, addedStok) {
  try {
    const item = await itemRepository.getItem(id);
    if (!item) {
      return null; // Item tidak ditemukan
    }

    const currentStok = parseInt(item.stok_barang);
    const newStok = currentStok + parseInt(addedStok);

    // Memanggil repository untuk menambah stok item.
    await itemRepository.updateStok(id, newStok.toString());
    return true; // Operasi berhasil
  } catch (error) {
    throw error; // Mengembalikan pesan error khusus
  }
}

// Fungsi ini digunakan untuk menghitung total harga berdasarkan ID item dan jumlah stok.
async function getTotalHarga(id, stok) {
  const item = await itemRepository.getItem(id);

  if (!item) {
    return null; // Item tidak ditemukan
  }

  const hargaBarang = parseInt(item.harga_barang);
  const stock = parseInt(stok);

  const totalHarga = stock * hargaBarang
  return totalHarga; // Mengembalikan total harga
}

// Fungsi ini digunakan untuk mendapatkan harga barang berdasarkan ID item.
async function getItemPrice(id) {
  const item = await itemRepository.getItem(id);

  if (!item) {
    return null; // Item tidak ditemukan
  }
  const harga_barang = parseInt(item.harga_barang);
  return harga_barang; // Mengembalikan harga barang
}



module.exports = {
  getItem,
  createItems,
  updateItems,
  deleteItems,
  emailIsRegistered,
  reduceStok,
  addedStok,
  getItemPrice,
  getTotalHarga
  
}