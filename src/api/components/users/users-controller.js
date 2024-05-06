const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUsers(request, response, next) {
  try {
    const users = await usersService.getUsers();
    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.
        UNPROCESSABLE_ENTITY,
         'Unknown user');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createUser(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const password_confirm = request.body.password_confirm;
    

    // Check confirmation password
    if (password !== password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    // Email must be unique
    const emailIsRegistered = await usersService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await usersService.createUser(name, email, password);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    return response.status(200).json({ name, email });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateUser(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;

    // Email must be unique
    const emailIsRegistered = await usersService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await usersService.updateUser(id, name, email);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await usersService.deleteUser(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle change user password request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function changePassword(request, response, next) {
  try {
    // Check password confirmation
    if (request.body.password_new !== request.body.password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    // Check old password
    if (
      !(await usersService.checkPassword(
        request.params.id,
        request.body.password_old
      ))
    ) {
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Wrong password');
    }

    const changeSuccess = await usersService.changePassword(
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

// BATAS ATAS


// Hal yang baru
// Fungsi untuk mendapatkan daftar pengguna dengan pagination
async function getPaginationUsers(request, response, next) {
  try {
    // Mendapatkan parameter query untuk pagination, sorting, dan pencarian
    const page_number = request.query.page_number || 1;
    const page_size = request.query.page_size || 0;
    const sort = request.query.sort;
    const search = request.query.search;

    // Memanggil layanan untuk mendapatkan daftar pengguna dengan pagination
    const users = await usersService.getPaginationUsers(page_number, page_size, sort, search);

    // Mengirimkan respons JSON dengan daftar pengguna yang diperoleh
    return response.status(200).json(users);
  } catch (error) {
    // Menangani error dengan meneruskannya ke middleware error handling
    return next(error);
  }
}

// Fungsi untuk melakukan proses login pengguna
async function login(request, response, next) {
  const name = request.body.id;
  const email = request.body.email;
  const password = request.body.password;
  const LOGIN_ATTEMPT_LIMIT = 5; // Batas percobaan login yang diperbolehkan

  try {
    // Memeriksa keberhasilan login dengan menggunakan layanan yang tersedia
    const loginSuccess = await usersService.checkLoginCredentials(email, password);
    if (!loginSuccess) {
      // Jika login gagal, melacak percobaan login dan menghitung jumlah percobaan
      await usersService.trackLoginAttempt(email);
      const failedAttempts = await usersService.getLoginAttempts(email);

      // Jika jumlah percobaan melebihi batas yang ditentukan, kirim respons error FORBIDDEN
      if (failedAttempts >= LOGIN_ATTEMPT_LIMIT) {
        throw errorResponder(errorTypes.FORBIDDEN, 'Too many failed login attempts');
      }

      // Jika login gagal tetapi belum mencapai batas percobaan, kirim respons error INVALID_CREDENTIALS
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Invalid email or password');
    }

    // Jika login berhasil, reset jumlah percobaan login dan kirim respons JSON dengan hasil login
    await usersService.resetLoginAttempts(email);
    response.status(200).json(loginSuccess);
  } catch (error) {
    // Menangani error dengan meneruskannya ke middleware error handling
    return next(error);
  }
}




module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  // NEW MODULE
  getPaginationUsers,
  login,
};

