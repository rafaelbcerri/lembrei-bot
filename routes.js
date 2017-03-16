'use strict';

const router = require('express').Router();
const WebhookController = require("./controllers/webhook.js");

router.get("/", (req, res) => {
  res.send("Hello World, I'm a brazilian chat bot enter on m.me/lembreiBot to talk with me!");
});

WebhookController.routes(router);

module.exports = router;