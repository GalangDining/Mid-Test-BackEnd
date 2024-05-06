const penjualService = require('./penjual-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function getUsers(request, response, next) {
  try {
    const users = await penjualService.getUsers();
    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

async function getUser(request, response, next) {
  try {
    const user = await penjualService.getUser(request.params.id);

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

    const emailIsRegistered = await penjualService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await penjualService.createUser(name, email, password);
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

async function updateUser(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;

    const emailIsRegistered = await penjualService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await penjualService.updateUser(id, name, email);
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

async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await penjualService.deleteUser(id);
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

async function changePassword(request, response, next) {
  try {
    if (request.body.password_new !== request.body.password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    if (
      !(await penjualService.checkPassword(
        request.params.id,
        request.body.password_old
      ))
    ) {
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Wrong password');
    }

    const changeSuccess = await penjualService.changePassword(
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


// Fungsi ini digunakan untuk melihat Akun seseorang telah menjual apa saja dengan email.
async function getItemAndItemsByEmail(request, response, next) {
  try {
    const email = request.body.email;

    // Memanggil service untuk mendapatkan detail akun penjual serta item yang telah dijual berdasarkan email.
    const data = await penjualService.getItemAndItemsByEmail(email);

    // Memvalidasi data yang diterima dari service sebelum mengembalikan respons.
    if (!data || !data.user || data.items.length === 0) {
      throw errorResponder(
        errorTypes.USER_NOR_REGISTERED,
        'Mohon maaf, anda bisa daftar disini http://localhost:5050/api/penjual'
      );
    }

    // Mengembalikan respons dengan data yang ditemukan berdasarkan email.
    return response.status(200).json(data);
  } catch (error) {
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
  getItemAndItemsByEmail,
}


















