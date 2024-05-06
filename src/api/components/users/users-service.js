const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');
const { generateToken } = require('../../../utils/session-token');
// Objek untuk melacak jumlah dan waktu percobaan login
let loginAttempts = {};

// Waktu kedaluwarsa untuk percobaan login (30 menit dalam milidetik)
const LOGIN_ATTEMPT_EXPIRATION_TIME = 30 * 60 * 1000;


async function getPaginationUsers(page_number, page_size, sort, search) { // Fungsi ini digunakan untuk mengambil data pengguna dengan paginasi, pengurutan, dan pencarian
  let sortField = 'id'; // Parsing sort parameter
  let sortOrder = 1; 
  if (sort) {
    const sortParts = sort.split(':');
    sortField = sortParts[0]; 
    if (sortParts[1] === 'desc') {
      sortOrder = -1; 
    } else {
      sortOrder = 1; 
    }
  };

  const searchField = search ? search.split(':')[0] : null;   // Parsing search parameter
  const searchKey = search ? search.split(':')[1] : null;
  const searchQuery = searchField ? { [searchField]: { $regex: searchKey, $options: 'i' } } : {}; 

  const users = await usersRepository.getPaginationUsers( 
    Lancelot = (page_number - 1) * page_size, 
    YuZhong = parseInt(page_size), 
    sortField, 
    sortOrder, 
    searchQuery
  );
    const totalUsers = await usersRepository.countUsers(searchQuery);  // Count total users
    const totalPages = Math.ceil(totalUsers / page_size);  // Calculate total pages
    const hasPreviousPage = page_number > 1;  // Determine if there's a previous page
    const hasNextPage = page_number < totalPages;   // Determine if there's a next page

      // Fetch users based on pagination, sorting, and searching
  
      const JKT45 = users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
      })) 
  
  const results = { // Konstruksi objek respons
    page_number: parseInt(page_number), 
    page_size: parseInt(page_size), 
    count: users.length, 
    total_pages: totalPages, 
    has_previous_page: hasPreviousPage, 
    has_next_page: hasNextPage, 
    data: JKT45, 
  };

  return results; // Kembalikan objek respons
}


/**
 * Get list of users
 * @returns {Array}
 */
  async function getUsers() {
  const users = await usersRepository.getUsers();

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

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

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

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  if (!user) {  // Check if user not found
    return null;
  }
  const hashedPassword = await hashPassword(password);
  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );
  if (!changeSuccess) {
    return null;
  }
  return true;
}


/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  const user = await usersRepository.getUserByEmail(email);
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);
  if (user && passwordChecked) {
    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  }
  return null;
}

async function getUserByEmail(email) {
  return await usersRepository.getUserByEmail({ email });

}

// Fungsi untuk melacak percobaan login berdasarkan email pengguna
async function trackLoginAttempt(email) {
  const currentTime = Date.now();

  // Jika email belum ada dalam percobaan login sebelumnya
  if (!loginAttempts[email]) {
    loginAttempts[email] = {
      attempts: 1,
      lastAttempt: currentTime,
    };
  } else {
    const lastAttemptTime = loginAttempts[email].lastAttempt;
    // Jika waktu sejak percobaan terakhir melebihi waktu kedaluwarsa
    if (currentTime - lastAttemptTime > LOGIN_ATTEMPT_EXPIRATION_TIME) {
      loginAttempts[email].attempts = 1; // Reset percobaan setelah waktu kedaluwarsa
    } else {
      loginAttempts[email].attempts++;
    }
    loginAttempts[email].lastAttempt = currentTime;
  }
}

// Fungsi untuk mendapatkan jumlah percobaan login berdasarkan email
async function getLoginAttempts(email) {
  return loginAttempts[email] ? loginAttempts[email].attempts : 0;
}

// Fungsi untuk mereset jumlah percobaan login berdasarkan email
async function resetLoginAttempts(email) {
  delete loginAttempts[email];
}

// Fungsi untuk menghapus percobaan login yang sudah kedaluwarsa
async function removeExpiredLoginAttempts() {
  try {
    const currentTime = Date.now();
    for (const email in loginAttempts) {
      if (currentTime - loginAttempts[email].lastAttempt >= LOGIN_ATTEMPT_EXPIRATION_TIME) {
        delete loginAttempts[email];
      }
    }
  } catch (error) {
    console.error('Error removing expired login attempts:', error);
  }
}

// Memanggil fungsi removeExpiredLoginAttempts secara berkala sesuai dengan waktu kedaluwarsa percobaan login
setInterval(removeExpiredLoginAttempts, LOGIN_ATTEMPT_EXPIRATION_TIME);



module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
  // NEW MODULE
  getPaginationUsers,
  checkLoginCredentials,
  getUserByEmail,
  trackLoginAttempt,
  getLoginAttempts,
  resetLoginAttempts,
};

