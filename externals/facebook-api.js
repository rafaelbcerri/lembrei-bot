"use strict";

const
  config = require('config'),
  requestPromise = require('request-promise'),
  Log = require("../helpers/log.js");

const PAGE_ACCESS_TOKEN = (process.env.PAGE_ACCESS_TOKEN) ?
  (process.env.PAGE_ACCESS_TOKEN) :
  config.get('pageAccessToken');

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

module.exports.sendMessage = (requestJson) => {
  requestPromise(postMessage(requestJson))
  .then((body) => {
    const recipientId = body.recipient_id;
    const messageId = body.message_id;
    console.log("Successfully sent text message with id %s to recipient %s",
        messageId, recipientId);
  })
  .catch((error)=> {
    Log.handleError(error, "Unable to send message.");
  });
};

module.exports.sendTextQuickReply = (requestJson) => {
  requestPromise(postMessage(requestJson))
  .then((body) => {
    const recipientId = body.recipient_id;
    const messageId = body.message_id;
    console.log("Successfully sent quick reply message with id %s to recipient %s",
        messageId, recipientId);
  })
  .catch((error)=> {
    Log.handleError(error, "Unable to send quick reply.");
  });
};

module.exports.initiate = () => {
  setGretting();
  setGetStartedButton();
  setDomainWhitelisting()
  .then(() => {
    setPersistentMenu();
  });
};

const setGretting = () => {
  const requestJson = {
    "setting_type":"greeting",
    "greeting":{
      "text":"Oi {{user_first_name}}, eu sou um bot que irá te ajudar a lembrar das coisas !"
    }
  };

  return requestPromise(postThreadSettings(requestJson))
  .then((body) => {
    console.log("Successfully set greeting.");
  })
  .catch((error)=> {
    Log.handleError(error, "Unable to set greeting.");
  });
};

const setGetStartedButton = () => {
  const requestJson = {
    "setting_type":"call_to_actions",
    "thread_state":"new_thread",
    "call_to_actions":[{
      "payload":"GET_STARTED_BUTTON"
    }]
  };

  return requestPromise(postThreadSettings(requestJson))
  .then((body) => {
    console.log("Successfully set startButton.");
  })
  .catch((error)=> {
    Log.handleError(error, "Unable to set startButton.");
  });
};

const setPersistentMenu = () => {
  const requestJson = {
    "setting_type":"call_to_actions",
    "thread_state":"existing_thread",
    "call_to_actions":[
      {
        "type":"postback",
        "title":"Adicionar nova tarefa",
        "payload":"ADD_TASK_POSTBACK"
      },
      {
        "type":"postback",
        "title":"Listar tarefas",
        "payload":"LIST_TASKS_POSTBACK"
      }
    ]
  };

  return requestPromise(postThreadSettings(requestJson))
  .then((body) => {
    console.log("Successfully set persistentMenu.");
  })
  .catch((error)=> {
    Log.handleError(error, "Unable to set persistentMenu.");
  });
};

const setDomainWhitelisting = () => {
  const requestJson = {
    "setting_type":"domain_whitelisting",
    "whitelisted_domains" : ["https://www.facebook.com/rafaelbcerri"],
    "domain_action_type": "add"
  };

  return requestPromise(postThreadSettings(requestJson))
  .then((body) => {
    console.log("Successfully set domainWhitelisting.");
  })
  .catch((error)=> {
    Log.handleError(error, "Unable to set domainWhitelisting.");
  });
};

const postMessage = (requestJson) => {
  return {
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: "POST",
    json: requestJson 
  };
};

const postThreadSettings = (requestJson) => {
  return {
    url: "https://graph.facebook.com/v2.6/me/thread_settings",
    qs: {
      access_token: PAGE_ACCESS_TOKEN
    },
    method: "POST",
    json: requestJson
  };
};
