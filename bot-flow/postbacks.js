'use strict';

const 
  facebookAPI = require("../externals/facebook-api.js"),
  UserModel = require("../models/user.js"),
  Messenger = require("../libs/messenger.js");

module.exports.received = (event) => {
  const 
    senderId = event.sender.id,
    receiverId = event.recipient.id,
    postbackTime = event.timestamp,
    payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " +
    "at %d", senderId, receiverId, payload, postbackTime);


  if ( payload == "GET_STARTED_BUTTON" ) {
    facebookAPI.getPublicProfile(event.sender)
      .then((userPublicProfile) => {

        UserModel.addNewUser(
          senderId,
          userPublicProfile.first_name,
          userPublicProfile.last_name,
          userPublicProfile.gender
        );

        const messageText  = "Oi, " + userPublicProfile.first_name + "!! \nEstá pronto para começar a adicionar as suas tarefas?";
        Messenger.sendTextQuickReply(senderId, messageText);
      });
  } else {
    // When a postback is called, we'll send a message back sto the sender to
    // let them know it was successful
    Messenger.sendTextMessage(senderId, "Postback called");
  }

};