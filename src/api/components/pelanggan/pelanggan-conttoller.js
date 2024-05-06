const pelangganService = require('./pelanggan-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function getUsers(request, response, next) {
  try {
    const users = await pelangganService.getUsers();
    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

async function getItems(request, response, next) {
  try {
    const items = await pelangganService.getItems();
    return response.status(200).json(items);
  } catch (error) {
    return next(error);
  }
}

async function getUser(request, response, next) {
  try {
    const user = await pelangganService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

async function createUser(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const password_confirm = request.body.password_confirm;
  
    if (password !== password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    const emailIsRegistered = await pelangganService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await pelangganService.createUser(name, email, password);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    return response.status(200).json({ name, email, mesaage: 'pelanggan berhasil di buat' });
  } catch (error) {
    return next(error);
  }
}

async function updateUser(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;

    const emailIsRegistered = await pelangganService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await pelangganService.updateUser(id, name, email);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ id, message: 'pelanggan berhasil di update' });
  } catch (error) {
    return next(error);
  }
}

async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await pelangganService.deleteUser(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id , message: 'pelanggan berhasil di hapus'});
  } catch (error) {
    return next(error);
  }
}

async function changePassword(request, response, next) {
  try {
    if (request.body.password_new !== request.body.password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    if (
      !(await pelangganService.checkPassword(
        request.params.id,
        request.body.password_old
      ))
    ) {
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Wrong password');
    }

    const changeSuccess = await pelangganService.changePassword(
      request.params.id,
      request.body.password_new
    );

    if (!changeSuccess) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to change password'
      );
    }

    return response.status(200).json({ id: request.params.id });
  } catch (error) {
    return next(error);
  }
}
// Fungsi ini digunakan untuk menambahkan saldo ke akun pengguna berdasarkan permintaan dari klien.
async function topUpSaldo(request, response, next) {
  try {
    const id = request.params.id;
    const amount = request.body.amount;

    // Memanggil service untuk melakukan penambahan saldo.
    const success = await pelangganService.topUpSaldo(id, amount);
    if (!success) {
      throw errorResponder(
        errorTypes.SALDO_ERROR,
        'Gagal untuk menambahkan saldo'
      );
    }

    // Mengembalikan respons ke klien setelah operasi berhasil.
    return response.status(200).json({ id, message: 'Saldo berhasil ditambahkan' });
  } catch (error) {
    return next(error);
  }
}

// Fungsi ini digunakan untuk melakukan pembelian item berdasarkan permintaan dari klien.
async function BUYITEM(request, response, next) {
  try {
    const id_barang = request.body.id_barang;
    const id_pelanggan = request.body.id_pelanggan;
    const banyak_barang = request.body.banyak_barang;
    const jenis_barang = request.body.jenis_barang;

    // Memanggil service untuk mendapatkan detail item yang akan dibeli.
    const item = await pelangganService.getItem(id_barang);
    const hargaTotal = await pelangganService.getTotalHarga(id_barang, banyak_barang);
    const pelanggan = await pelangganService.getUser(id_pelanggan);

    // Memvalidasi item, pengguna, serta melakukan pengurangan stok dan saldo.
    if (!item) {
      throw errorResponder(
        errorTypes.ID_BARANG,
        'Anda bisa cek lagi ID produk yang ingin anda beli'
      )
    }
    if (!pelanggan) {
      throw errorResponder(
        errorTypes.ID_PELANGGAN,
        'ID yang anda miliki tidak terdaftar untuk melakukan transaksi'
      )
    }
    const stokReductionResult = await pelangganService.reduceStok(id_barang, banyak_barang);
    const saldoReductionResult = await pelangganService.reduceSaldo(id_pelanggan, hargaTotal);

    // Memastikan operasi pengurangan stok dan saldo berhasil sebelum mengembalikan respons.
    if (!stokReductionResult) {
      throw errorResponder(
        errorTypes.INSUFFICIENT_GOODS,
        'Mohon maaf stok kami belum mencukupi dengan apa yang anda inginkan'
      )
    }

    if (!saldoReductionResult) {
      throw errorResponder(
        errorTypes.LESS_BALANCE,
        'Mohon maaf saldo anda tidak mencukupi untuk melakukan pembelian, mohon cek saldo anda untuk melakukan pembelian'
      )
    }

    // Mengembalikan respons ke klien dengan detail pembelian.
    return response.status(200).json({ id_barang, id_pelanggan, banyak_barang, hargaTotal, jenis_barang, mesaage : 'barang berhasil di beli'});
  } catch (error) {
    return next(error);
  }
}

// Fungsi ini digunakan untuk mengambil daftar item dengan paginasi berdasarkan permintaan dari klien.
async function getPaginationItems(request, response, next) {
  try {
    const page_number = request.query.page_number || 1;
    const page_size = request.query.page_size || 0;
    const sort = request.query.sort;
    const search = request.query.search;

    // Memanggil service untuk mendapatkan daftar item dengan paginasi.
    const items = await pelangganService.getPaginationItems(page_number, page_size, sort, search);
    
    // Mengembalikan daftar item dengan paginasi ke klien.
    return response.status(200).json(items);
  } catch (error) {
    return next(error);
  }
}



module.exports = {
  getUsers,
  getItems,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  topUpSaldo,
  BUYITEM,
  getPaginationItems,
}