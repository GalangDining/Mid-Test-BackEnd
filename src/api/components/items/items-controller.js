const itemService = require('./items-service')
const { errorResponder, errorTypes } = require('../../../core/errors');

// Fungsi ini digunakan untuk membuat item baru berdasarkan permintaan dari klien.
async function createItems(request, response, next) {
  try {
    // Mengambil data dari permintaan klien.
    const email = request.body.email;
    const nama_barang = request.body.nama_barang;
    const jenis_barang  = request.body.jenis_barang;
    const stok_barang  = request.body.stok_barang;
    const harga_barang = request.body.harga_barang;
    const lokasi_penjual = request.body.lokasi_penjual;

    // Memeriksa apakah email yang digunakan terdaftar sebagai akun penjual.
    const checkEmail = await itemService.emailIsRegistered(email);

    if (!checkEmail) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email yang anda gunakan untuk membuat produk tidak bisa digunakan, dikarenakan bukan dari bagian Akun Seller'
      )
    }
    
    // Membuat item baru menggunakan service itemService.createItems.
    const success = await itemService.createItems(email,nama_barang, jenis_barang, stok_barang, harga_barang, lokasi_penjual);
    if (!success) {
      throw errorResponder(
        errorTypes.PRODUCT_NOT_LISTED,
        'Perhatikan apakah email anda terdaftar atau tidak'
      )
    }

    // Mengembalikan respons sukses ke klien.
    return response.status(200).json({email, nama_barang, jenis_barang, stok_barang, harga_barang, lokasi_penjual})
  } catch (error) {
    return next(error)
  }
}

// Fungsi ini digunakan untuk mengupdate detail item berdasarkan ID.
async function updateItems(request, response, next) {
  try{
    // Mengambil data dari permintaan klien.
    const id = request.params.id;
    const nama_barang = request.body.nama_barang;
    const jenis_barang = request.body.jenis_barang;
    const stok_barang = request.body.stok_barang;
    const harga_barang = request.body.harga_barang;
    const lokasi_penjual = request.body.lokasi_penjual;

    // Mendapatkan detail item berdasarkan ID.
    const item = await itemService.getItem(id);

    if (!item) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
         'Unknown item');
    }

    // Mengupdate detail item menggunakan service itemService.updateItems.
    const success = await itemService.updateItems(id, nama_barang, jenis_barang, stok_barang, harga_barang, lokasi_penjual)
    if(!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }
    // Mengembalikan respons sukses ke klien.
    return response.status(200).json({id, nama_barang, jenis_barang, stok_barang, harga_barang, lokasi_penjual})
  } catch (error) {
    return next(error)
  }
}

// Fungsi ini digunakan untuk menghapus item berdasarkan ID.
async function deleteItems(request, response, next) {
  try {
    // Mengambil data ID dari permintaan klien.
    const id = request.params.id;

    // Menghapus item menggunakan service itemService.deleteItems.
    const successDeleteItems = await itemService.deleteItems(id);
    if (!successDeleteItems) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete item'
      );
    }

    // Mengembalikan respons sukses ke klien.
    return response.status(200).json({id, message: 'Item berhasil di hapus'});
  } catch (error) {
    return next(error);
  }
}

// Fungsi ini digunakan untuk mengurangi stok item berdasarkan ID dan jumlah stok baru.
async function reduceStok(request, response, next) {
  try {
    // Mengambil data ID dan jumlah stok baru dari permintaan klien.
    const id = request.body.id;
    const newStok = request.body.newStok;

    // Mengurangi stok item menggunakan service itemService.reduceStok.
    const success = await itemService.reduceStok(id, newStok);
    if (!success) {
      throw errorResponder(
        errorTypes.OUT_OF_STOCK,
        'Maaf atas ketidaknyamanan-nya, mohon isi ulang stok dengan kapasitas maksimal yang kami miliki'
      )
    }
  
    // Mengembalikan respons sukses ke klien.
    return response.status(200).json({id, reduce_stok: newStok ,message: 'Stok berhasil diperbarui '});
  } catch (error) {
    return next(error);
  }
}

// Fungsi ini digunakan untuk menambah stok item berdasarkan ID dan jumlah stok baru.
async function addedStok(request, response, next) {
  try {
    // Mengambil data ID dan jumlah stok baru dari permintaan klien.
    const id = request.body.id;
    const newStok = request.body.newStok;

    // Menambah stok item menggunakan service itemService.addedStok.
    const success = await itemService.addedStok(id, newStok);
    if (!success) {
      throw errorResponder(
        errorTypes.NEW_STOCK,
        'Stok anda gagal ditambahkan'
      )
    }
  
    // Mengembalikan respons sukses ke klien.
    return response.status(200).json({message: 'Stok berhasil ditambahkan'});
  } catch (error) {
    return next(error);
  }
}




module.exports = {
  createItems,
  updateItems,
  deleteItems,
  reduceStok,
  addedStok,

}