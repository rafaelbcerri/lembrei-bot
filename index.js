"use strict";

const 
  bodyParser = require("body-parser"),
  express = require("express"),
  request = require("request"),
  facebookAPI = require("./facebook-api.js");
  
const app = express();
app.set("port", process.env.PORT || 5000);
// app.use(bodyParser.json({ verify: verifyRequestSignature }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World, I'm a brazilian chat bot enter on m.me/lembreiBot to talk with me!");
});

app.get("/webhook", (req, res) => {
  if (req.query["hub.mode"] === "subscribe" &&
      req.query["hub.verify_token"] === (process.env.FACEBOOK_VALIDATION_TOKEN)) {
    console.log("Validating webhook");
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }  
});

app.post("/webhook", (req, res) => {
  var data = req.body;

  if (data.object === "page") {
    data.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message) {
          receivedMessage(event);
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

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    switch (messageText) {
      case "generic":
        sendGenericMessage(senderID);
        break;

      default:
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

const sendGenericMessage = (recipientId, messageText) => {
  // To be expanded in later sections
}

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
}

app.listen(app.get("port"), () => {
  console.log("Node app is running on port", app.get("port"));
});


