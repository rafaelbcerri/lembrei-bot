const UserModel = require("../models/user.js");

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
