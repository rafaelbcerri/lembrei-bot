const
  mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  db = mongoose.connection;

mongoose.Promise = global.Promise;

const UserSchema = new Schema({
  _id: {type: Number},
  firstName: {type: String},
  lastName: {type: String},
  gender: {type: String}
});

module.exports.UserModel = mongoose.model("User", UserSchema);
