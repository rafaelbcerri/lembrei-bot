'use strict';

const Messenger = require("../libs/messenger.js");

module.exports.received = (event) => {
  const senderId = event.sender.id;
  const receiverId = event.recipient.id;
  const messageTime = event.timestamp;
  const message = event.message;

  console.log("Received message for user %d and page %d at %d with message:", 
    senderId, receiverId, messageTime);
  console.log(JSON.stringify(message));

  if (message.text) {
    Messenger.sendTextMessage(senderId, message.text);
  } else if (message.attachments) {
    Messenger.sendTextMessage(senderId, "Message with attachment received");
  }
};