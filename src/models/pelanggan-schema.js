const pelangganSchema = {
  name: String,
  email: String,
  password: String,
  saldo: {type : String, default: "0"},
};

module.exports = pelangganSchema;
