'use strict';

const 
  MessagesFlow = require("./messages.js"),
  PostbacksFlow = require("./postbacks.js");

module.exports.handleEvents = (event) => {
  if (event.message) {
    MessagesFlow.received(event);
  } else if (event.postback) {
    PostbacksFlow.received(event);
  } else {
    console.log("Webhook received unknown event: ", event);
  }
};
