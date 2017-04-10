"use strict";

const
  opbeat = require('opbeat').start(),
  bodyParser = require("body-parser"),
  config = require('config'),
  express = require("express"),
  mongoose = require("mongoose"),
  facebookAPI = require("./externals/facebook-api.js"),
  routes = require('./routes');

const MONGODB_URI = (process.env.MONGODB_URI) ?
  (process.env.MONGODB_URI) :
  config.get('mongoDBUri');

mongoose.connect(MONGODB_URI);
mongoose.connection.on('error', (error) => {
  console.log("MongoDB connection error: ", error);
});

const app = express();

app.set("port", process.env.PORT || 8000);

// app.use(bodyParser.json({ verify: verifyRequestSignature }));
app.use(bodyParser.json());
app.use(opbeat.middleware.express());
app.use("/", routes);

facebookAPI.initiate();

app.listen(app.get("port"), () => {
  console.log("Node app is running on port", app.get("port"));
});
