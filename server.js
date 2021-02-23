require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const dns = require("dns");
const mongoose = require("mongoose"); // Need to require mongoose
const shortid = require("shortid");

// Install and set up mongoose. (connected it to heroku as well by editing config key:values)
// Can't be MONGO_URI like in first challenges because heroku needs it to be different
mongoose.connect(process.env.PASS_URI, {
  // The MONGO_URI string is in sample.env. Be sure to change <password> to the user's actual password for mongoose to connect to the database
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const Schema = mongoose.Schema; // need this or the new Schema doesn't work later on in code.

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

  // Check if clientRequestedURL is valid.
  if (!clientRequestedURL.includes("http")) {
    res.json({ error: "invalid url" });
    return;
  }

  // create new model
  let newURL = new ShortURL({
    original_url: clientRequestedURL,
    short_url: shortcut,
  });

  // save the new model to database and return json if sucessful
  newURL.save((error, newurl) => {
    if (error) return console.log(error);
    res.json({
      original_url: newURL.original_url,
      short_url: "/api/shorturl/" + newURL.short_url,
    });
  });
});

// Take the shortURL and get its' oringal url and go there.
app.get("/api/shorturl/:shortcut", (req, res) => {
  let userGeneratedShortcut = req.params.shortcut;
  ShortURL.find({ short_url: userGeneratedShortcut }, (error, url) => {
    // Returns an array so we must use [0] to get correct url
    if (error) res.json({ error: "invalid url" });
    // console.log(url)
    // Must use [0] because find returns an array
    res.redirect(url[0].original_url); //res.redirect() takes a string and redirects you to that website
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
