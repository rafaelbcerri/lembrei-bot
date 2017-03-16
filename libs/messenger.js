'use strict';

const facebookAPI = require("../externals/facebook-api.js");

module.exports.sendTextMessage = (recipientId, messageText) => {
  var requestJson = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };
  facebookAPI.sendMessage(requestJson);
};

module.exports.sendTextQuickReply = (userId, messageText) => {
  var requestJson = {
    recipient: {
      id: userId
    },
    message:{
      text: messageText,
      quick_replies:[
        {
          content_type: "text",
          title: "Sim 👍👍",
          payload: "STARTUP_YES"
        },
        {
          content_type: "text",
          title: "Ainda não 👎",
          payload: "STARTUP_NO"
        }
      ]
    }
  };

  facebookAPI.sendTextQuickReply(requestJson);
};