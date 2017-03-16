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

const UserModel = mongoose.model("User", UserSchema);

module.exports.addNewUser = (userId, firstName, lastName, gender) => {
  new UserModel({
    _id: userId,
    firstName: firstName,
    lastName: lastName,
    gender: gender
  })
  .save()
  .then(() => {
    console.log('Success on saving new user.');
  })
  .catch((error)=> {
    //Code 11000 - Duplication key error
    if(error.code == "11000") {
      console.log("User alredy in database.");
    }
    else {
      console.log("Error on saving new user", error);
    }
  });
};