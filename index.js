"use strict";

const 
  opbeat = require('opbeat').start(),
  bodyParser = require("body-parser"),
  config = require('config'),
  express = require("express"),
  mongoose = require("mongoose"),
  facebookAPI = require("./facebook-api.js"),
  UserController = require("./controller/user.js");

const FACEBOOK_VALIDATION_TOKEN = (process.env.FACEBOOK_VALIDATION_TOKEN) ?
  (process.env.FACEBOOK_VALIDATION_TOKEN) :
  config.get('facebookValidationToken');

const MONGODB_URI = (process.env.MONGODB_URI) ?
  (process.env.MONGODB_URI) :
  config.get('mongoDBUri');

mongoose.connect(MONGODB_URI);

const app = express();

app.set("port", process.env.PORT || 5000);

// app.use(bodyParser.json({ verify: verifyRequestSignature }));
app.use(bodyParser.json());
app.use(opbeat.middleware.express());

app.get("/", (req, res) => {
  res.send("Hello World, I'm a brazilian chat bot enter on m.me/lembreiBot to talk with me!");
});

app.get("/webhook", (req, res) => {
  if (req.query["hub.mode"] === "subscribe" &&
      req.query["hub.verify_token"] === FACEBOOK_VALIDATION_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }  
});

facebookAPI.initiate();

app.post("/webhook", (req, res) => {
  var data = req.body;
  console.log(data);

  if (data.object === "page") {
    data.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        
        if (event.message) {
          receivedMessage(event);
        } else if (event.postback) {
          receivedPostback(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    res.sendStatus(200);
  }
});
  
const receivedMessage = (event) => {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:", 
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {
    switch (messageText.toLowerCase()) {
      case "generic":
        sendGenericMessage(senderID);
        break;

      default:
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
};

const receivedPostback = (event) => {
  const senderID = event.sender.id;
  const recipientID = event.recipient.id;
  const timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback
  // button for Structured Messages.
  const payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " +
    "at %d", senderID, recipientID, payload, timeOfPostback);


  if ( payload == "GET_STARTED_BUTTON" ) {
    facebookAPI.getPublicProfile(event.sender)
      .then((userPublicProfile) => {

        UserController.addNewUser(
          senderID,
          userPublicProfile.first_name,
          userPublicProfile.last_name,
          userPublicProfile.gender
        );

        sendTextMessage(senderID, "Oi, " + userPublicProfile.first_name + " vamos começar");
      });
  } else {
    // When a postback is called, we'll send a message back sto the sender to
    // let them know it was successful
    sendTextMessage(senderID, "Postback called");
  }

};

const sendGenericMessage = (recipientId) => {
  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",
            image_url: "http://messengerdemo.parseapp.com/img/rift.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",
            image_url: "http://messengerdemo.parseapp.com/img/touch.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/touch/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
  };

  facebookAPI.sendMessage(messageData);
};

const sendTextMessage = (recipientId, messageText) => {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  facebookAPI.sendMessage(messageData);
};

app.listen(app.get("port"), () => {
  console.log("Node app is running on port", app.get("port"));
});
