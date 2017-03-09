"use strict";

const
  config = require('config'),
  requestPromise = require('request-promise');

const PAGE_ACCESS_TOKEN = (process.env.PAGE_ACCESS_TOKEN) ?
  (process.env.PAGE_ACCESS_TOKEN) :
  config.get('pageAccessToken');

module.exports.sendMessage = (messageData) => {
  requestPromise({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: "POST",
    json: messageData })
  .then((body) => {
    const recipientId = body.recipient_id;
    const messageId = body.message_id;
    console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
  })
  .catch((error)=> {
    handleError(error, "Unable to send message.");
  });
};

module.exports.setGretting = () => {
  return requestPromise({
    url: "https://graph.facebook.com/v2.6/me/thread_settings",
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: "POST",
    json: {
      "setting_type":"greeting",
      "greeting":{
        "text":"Oi {{user_first_name}}, eu sou um bot que irá te ajudar a lembrar das coisas !"
      }
    }
  })
  .then((body) => {
    console.log("Successfully set greeting.");
  })
  .catch((error)=> {
    handleError(error, "Unable to set greeting.");
  });
};

module.exports.setGetStartedButton = () => {
  return requestPromise({
    url: "https://graph.facebook.com/v2.6/me/thread_settings",
    qs: {
      access_token: PAGE_ACCESS_TOKEN
    },
    method: "POST",
    json: {
      "setting_type":"call_to_actions",
      "thread_state":"new_thread",
      "call_to_actions":[{
        "payload":"GET_STARTED_BUTTON"
      }]
    }
  })
  .then((body) => {
    console.log("Successfully set startButton.");
  })
  .catch((error)=> {
    handleError(error, "Unable to set startButton.");
  });
};

module.exports.setPersistentMenu = () => {
  return requestPromise({
    url: "https://graph.facebook.com/v2.6/me/thread_settings",
    qs: { 
      access_token: PAGE_ACCESS_TOKEN
    },
    method: "POST",
    json: {
      "setting_type":"call_to_actions",
      "thread_state":"existing_thread",
      "call_to_actions":[
        {
          "type":"web_url",
          "title":"Web URL Button",
          "url":"https://www.facebook.com/rafaelbcerri",
          "webview_height_ratio": "tall",
          "messenger_extensions": true
        },
        {
          "type":"postback",
          "title":"New Postback Menu",
          "payload":"MENU_NEW_POSTBACK"
        }
      ]
    }
  })
  .then((body) => {
    console.log("Successfully set persistentMenu.");
  })
  .catch((error)=> {
    handleError(error, "Unable to set persistentMenu.");
  });
};

module.exports.setDomainWhitelisting = () => {
  return requestPromise({
    url: "https://graph.facebook.com/v2.6/me/thread_settings",
    qs: {
      access_token: PAGE_ACCESS_TOKEN
    },
    method: "POST",
    json: {
      "setting_type":"domain_whitelisting",
      "whitelisted_domains" : ["https://www.facebook.com/rafaelbcerri"],
      "domain_action_type": "add"
    }
  })
  .then((body) => {
    console.log("Successfully set domainWhitelisting.");
  })
  .catch((error)=> {
    handleError(error, "Unable to set domainWhitelisting.");
  });
};

module.exports.getPublicProfile = (user) => {
  return requestPromise({
    url: "https://graph.facebook.com/v2.6/" + user.id,
    qs: {
      access_token: PAGE_ACCESS_TOKEN
    },
    method: "Get"
  })
  .then((body) => {
    console.log("Successfully set userPublicProfile.");
    return JSON.parse(body);
  })
  .catch((error)=> {
    handleError(error, "Unable to set userPublicProfile.");
  });
};

module.exports.initiate = () => {
  this.setGretting();
  this.setGetStartedButton();
  this.setDomainWhitelisting()
  .then(() => {
    this.setPersistentMenu();
  });
};

const handleError = (error, message) => {
  console.error(message);
  console.error("Error StatusCode:", error.statusCode);
  console.error("Error Message:", error.message);
  console.error("Error Request Options:", error.options);
};