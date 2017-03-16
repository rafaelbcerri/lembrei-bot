const BotFlow = require("../bot-flow/events.js");
const config = require('config');

const FACEBOOK_VALIDATION_TOKEN = (process.env.FACEBOOK_VALIDATION_TOKEN) ?
  (process.env.FACEBOOK_VALIDATION_TOKEN) :
  config.get('facebookValidationToken');

module.exports.routes = (router) => {
  router.get("/webhook", (req, res) => {
    if (req.query["hub.mode"] === "subscribe" &&
        req.query["hub.verify_token"] === FACEBOOK_VALIDATION_TOKEN) {
      console.log("Success validation.");
      res.status(200).send(req.query["hub.challenge"]);
    } else {
      console.error("Failed validation. Make sure the validation tokens match.");
      res.sendStatus(403);
    }  
  });
  
  router.post("/webhook", (req, res) => {
    const body = req.body;
  
    if (body.object === "page") {
      body.entry.forEach((entry) => {
        entry.messaging.forEach((event) => {
          BotFlow.handleEvents(event);
        });
      });
  
      res.sendStatus(200);
    }
  });
};



