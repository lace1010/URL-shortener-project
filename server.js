require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const dns = require("dns");
const mongo = require("mongodb");
const mongoose = require("mongoose"); // Need to require mongoose
const shortid = require("shortid");

// Install and set up mongoose. (connected it to heroku as well by editing config key:values)
mongoose.connect(process.env.MONGO_URI, {
  // The MONGO_URI string is in sample.env. Be sure to change <password> to the user's actual password for mongoose to connect to the database
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const Schema = mongoose.Schema;

// Use the next four lines to see if you are conneted to mongoose correctly
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connection Successful!");
});

// Basic Configuration
const port = process.env.PORT || 3000;

// app.Post does not work unless we use body-parser middleware function here and call on the following two app.use
const bodyParser = require("body-parser"); // Must add bodyParser middleware to get info from body in html for .post()
const { doesNotMatch } = require("assert");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // In order to parse JSON data sent in the POST request,

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", (req, res) => {
  res.json({ greeting: "hello API" });
});

// set a urlSchema
const urlSchema = new Schema({
  original_url: String,
  short_url: String,
});

// set a model for shortURL using urlSchema
const ShortURL = mongoose.model("ShortURL", urlSchema);

app.post("/api/shorturl/new", (req, res) => {
  // variables to pass to json Object to make code cleaner
  let clientRequestedURL = req.body.url;
  let shortcut = shortid.generate(); // shortid.generate() is a short non-sequential url-friendly unique id generator

  // create new model
  let newURL = new ShortURL({
    original_url: clientRequestedURL,
    short_url: shortcut,
  });

  // save the new model to database and return json if sucessful
  newURL.save((error, newurl) => {
    if (error) return console.log(error);
    console.log(newurl);
    res.json({
      original_url: clientRequestedURL,
      short_url: shortcut,
    });
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
