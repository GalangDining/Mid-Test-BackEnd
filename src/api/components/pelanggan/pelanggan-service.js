const pelangganRepository = require('./pelanggan-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

async function getUsers() {
  const users = await pelangganRepository.getUsers();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }
  return results;
}

async function getItems() {
  // Mendapatkan daftar item dari repository pelanggan.
  const items = await pelangganRepository.getItems();

  // Mengonversi format item-item ke format yang sesuai sebelum dikembalikan.
  const results = [];
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    results.push({
      id : item.id,
      nama_barang: item.nama_barang,
      jenis_barang: item.jenis_barang,
      stok_barang: item.stok_barang,
      harga_barang: item.harga_barang,
      lokasi_penjual: item.lokasi_penjual,
    });
  }
  return results; // Mengembalikan daftar item yang sudah diformat.
}


async function getUser(id) {
  const user = await pelangganRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await pelangganRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

async function updateUser(id, name, email) {
  const user = await pelangganRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await pelangganRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

async function deleteUser(id) {
  const user = await pelangganRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await pelangganRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

async function emailIsRegistered(email) {
  const user = await pelangganRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

async function checkPassword(userId, password) {
  const user = await pelangganRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

async function changePassword(userId, password) {
  const user = await pelangganRepository.getUser(userId);
  if (!user) {  // Check if user not found
    return null;
  }
  const hashedPassword = await hashPassword(password);
  const changeSuccess = await pelangganRepository.changePassword(
    userId,
    hashedPassword
  );
  if (!changeSuccess) {
    return null;
  }
  return true;
}


// Fungsi ini digunakan untuk menambahkan saldo ke akun pengguna.
async function topUpSaldo(id, amount) {
  const user = await pelangganRepository.getUser(id);

  try {
    // Jika pengguna tidak ditemukan, operasi dihentikan dan mengembalikan null.
    if (!user) {
      return null;
    }

    const currentSaldo = parseInt(user.saldo);
    const newSaldo = currentSaldo + parseInt(amount);

    // Update saldo pengguna dengan saldo baru yang telah ditambahkan.
    await pelangganRepository.updateUserSaldo(id, newSaldo.toString());
    return true; // Operasi berhasil
  } catch (error) {
    throw error;
  }
}

// Fungsi ini digunakan untuk mendapatkan detail item berdasarkan ID.
async function getItem(id) {
  return await pelangganRepository.getItem(id);
}

// Fungsi ini digunakan untuk menghitung total harga belanjaan berdasarkan ID item dan jumlah stok yang dibeli.
async function getTotalHarga(id, stok) {
  const item = await pelangganRepository.getItem(id);

  if (!item) {
    return null; // Item tidak ditemukan, operasi dihentikan dan mengembalikan null.
  }

  const hargaBarang = parseInt(item.harga_barang);
  const stock = parseInt(stok);

  const totalHarga = stock * hargaBarang;
  return totalHarga;
}

// Fungsi ini digunakan untuk mengurangi stok item setelah pembelian.
async function reduceStok(id, reducedStok) {
  const item = await pelangganRepository.getItem(id);
  if (!item) {
    return false; // Item tidak ditemukan, operasi gagal.
  }

  if (reducedStok > item.stok_barang) {
    return false; // Stok tidak mencukupi, operasi gagal.
  }

  const currentStok = parseInt(item.stok_barang);
  const parsedReducedStok = parseInt(reducedStok);

  const remainingStok = currentStok - parsedReducedStok;
  await pelangganRepository.updateStok(id, remainingStok.toString());
  return true; // Operasi berhasil
}

// Fungsi ini digunakan untuk mengurangi saldo pengguna setelah pembelian.
async function reduceSaldo(id, amount) {
  const user = await pelangganRepository.getUser(id);
  if (!user) {
    return false; // Pengguna tidak ditemukan, operasi gagal.
  }

  if (amount > user.saldo) {
    return false; // Saldo tidak mencukupi, operasi gagal.
  }

  const currentSaldo = parseInt(user.saldo);
  const newSaldo = currentSaldo - parseInt(amount);

  await pelangganRepository.updateUserSaldo(id, newSaldo.toString());
  return true; // Operasi berhasil
}

// Fungsi ini digunakan untuk melakukan paginasi pada daftar item yang tersedia.
async function getPaginationItems(pageNumber, pageSize, sort, search) {
  const page_number = parseInt(pageNumber) || 1;
  const page_size = parseInt(pageSize) || 0;
  const sortField = sort ? sort.split(':')[0] : 'harga_barang';
  const sortOrder = sort && sort.split(':')[1] === 'desc' ? -1 : 1;

  const searchField = search ? search.split(':')[0] : null;
  const searchKey = search ? search.split(':')[1] : null;
  const searchQuery = searchField ? { [searchField]: { $regex: searchKey, $options: 'i' } } : {};

  // Mendapatkan daftar item dengan parameter paginasi, sorting, dan pencarian.
  const items = await pelangganRepository.getPaginationItems(
    (page_number - 1) * page_size,
    page_size,
    sortField,
    sortOrder,
    searchQuery
  );
  const totalItems = await pelangganRepository.countItems(searchQuery);
  const totalPages = Math.ceil(totalItems / page_size);
  const hasPreviousPage = page_number > 1;
  const hasNextPage = page_number < totalPages;

  // Mengformat item-item yang diterima dari database sebelum dikembalikan.
  const formattedItems = items.map(item => ({
    id: item.id,
    nama_barang: item.nama_barang,
    jenis_barang: item.jenis_barang,
    stok_barang: item.stok_barang,
    harga_barang: item.harga_barang,
    lokasi_penjual: item.lokasi_penjual,
  }));

  return {
    page_number,
    page_size,
    count: items.length,
    total_pages: totalPages,
    has_previous_page: hasPreviousPage,
    has_next_page: hasNextPage,
    data: formattedItems,
  };
}



module.exports = {
  getUsers,
  getItems,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
  topUpSaldo,
  getItem,
  getTotalHarga,
  reduceStok,
  reduceSaldo,
  getPaginationItems,
}