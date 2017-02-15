"use strict";

const
  config = require('config'),
  request = require('request');

const PAGE_ACCESS_TOKEN = (process.env.PAGE_ACCESS_TOKEN) ?
  (process.env.PAGE_ACCESS_TOKEN) :
  config.get('pageAccessToken');

module.exports.sendMessage = (messageData) => {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: "POST",
    json: messageData

  }, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const recipientId = body.recipient_id;
      const messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
    
  });  
};

module.exports.setGretting = () => {
  request({
    url: "https://graph.facebook.com/v2.6/me/thread_settings",
    qs: { 
      access_token: PAGE_ACCESS_TOKEN
    },
    method: "POST",
    json: {
      "setting_type":"greeting",
      "greeting":{
        "text":"Oi {{user_first_name}}, eu sou um bot que irá te ajudar a lembrar das coisas !"
      }
    }
  }, (error, response, body) => {
      
    if (!error && response.statusCode == 200) {
      console.log("Successfully set greeting.");
    } else {
      console.error("Unable to set greeting.");
      console.error(response);
      console.error(error);
    }
  });  
};  