const penjualRepository =require('./penjual-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

async function getUsers() {
  const users = await penjualRepository.getUsers();

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

async function getUser(id) {
  const user = await penjualRepository.getUser(id);

  if (!user) {   // User not found
    return null;
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

async function createUser(name, email, password) {
  const hashedPassword = await hashPassword(password);  // Hash password
  const incomeZero = 0;

  try {
    await penjualRepository.createUser(name, email, hashedPassword, incomeZero);
  } catch (err) {
    return null;
  }
  return true;
}

async function updateUser(id, name, email) {
  const user = await penjualRepository.getUser(id);

  if (!user) {  // User not found
    return null;
  }

  try {
    await penjualRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

async function deleteUser(id) {
  const user = await penjualRepository.getUser(id);

  if (!user) { // User not found
    return null;
  }

  try {
    await penjualRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

async function emailIsRegistered(email) {
  const user = await penjualRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

async function checkPassword(userId, password) {
  const user = await penjualRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

async function changePassword(userId, password) {
  const user = await penjualRepository.getUser(userId);
  if (!user) {  // Check if user not found
    return null;
  }
  const hashedPassword = await hashPassword(password);
  const changeSuccess = await penjualRepository.changePassword(
    userId,
    hashedPassword
  );
  if (!changeSuccess) {
    return null;
  }
  return true;
}


// Fungsi ini digunakan untuk mendapatkan detail akun penjual serta item yang telah dijual berdasarkan email.
async function getItemAndItemsByEmail(email) {
  // Mendapatkan detail akun penjual berdasarkan email.
  const user = await penjualRepository.getUserByEmail(email);

  // Jika akun penjual tidak ditemukan, fungsi mengembalikan null.
  if (!user) {
    return null; 
  }

  // Mendapatkan item yang telah dijual oleh penjual berdasarkan email.
  const items = await penjualRepository.getItemByEmail(email);

  // Menyusun data akun penjual dan item yang telah dijual ke dalam format yang sesuai sebelum dikembalikan.
  const results = {
    user: {
      name: user.name,
      email: user.email,
    },
    items,
  };

  // Mengembalikan hasil yang sudah disusun.
  return results;
}





module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
  getItemAndItemsByEmail
}
























// async function getPaginationPenjual(page_number, page_size, sort, search) { // Fungsi ini digunakan untuk mengambil data pengguna dengan paginasi, pengurutan, dan pencarian
//   let sortField = 'id'; // Parsing sort parameter
//   let sortOrder = 1; 
//   if (sort) {
//     const sortParts = sort.split(':');
//     sortField = sortParts[0]; 
//     if (sortParts[1] === 'desc') {
//       sortOrder = -1; 
//     } else {
//       sortOrder = 1; 
//     }
//   };

//   const searchField = search ? search.split(':')[0] : null;   // Parsing search parameter
//   const searchKey = search ? search.split(':')[1] : null;
//   const searchQuery = searchField ? { [searchField]: { $regex: searchKey, $options: 'i' } } : {}; 

//   const users = await penjualRepository.getPaginationPenjual( 
//     Lancelot = (page_number - 1) * page_size, 
//     YuZhong = parseInt(page_size), 
//     sortField, 
//     sortOrder, 
//     searchQuery
//   );
//     const totalUsers = await penjualRepository.countUsers(searchQuery);  // Count total users
//     const totalPages = Math.ceil(totalUsers / page_size);  // Calculate total pages
//     const hasPreviousPage = page_number > 1;  // Determine if there's a previous page
//     const hasNextPage = page_number < totalPages;   // Determine if there's a next page

//       // Fetch users based on pagination, sorting, and searching
  
//       const JKT45 = users.map(user => ({
//         id: user.id,
//         email: user.email,
//         nama_barang: user.nama_barang,
        
//       })) 
  
//   const results = { // Konstruksi objek respons
//     page_number: parseInt(page_number), 
//     page_size: parseInt(page_size), 
//     count: users.length, 
//     total_pages: totalPages, 
//     has_previous_page: hasPreviousPage, 
//     has_next_page: hasNextPage, 
//     data: JKT45, 
//   };

//   return results; // Kembalikan objek respons
// }
