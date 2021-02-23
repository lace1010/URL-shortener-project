require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const mongo = require("mongodb");
const mongoose = require("mongoose"); // Need to require mongoose
//** 1) Install and set up mongoose. (connected it to heroku as well.)
mongoose.connect(process.env.MONGO_URI, {
  // The MONGO_URI string is in sample.env. Be sure to change <password> to the user's actual password for mongoose to connect to the database
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Basic Configuration
const port = process.env.PORT || 3000;

// app.Post does not work unless we use body-parser middleware function here and call on the following two app.use
const bodyParser = require("body-parser"); // Must add bodyParser middleware to get info from body in html for .post()

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

app.post("/api/shorturl/new", (req, res) => {
  if (req.body.url) {
    res.json({ original_url: req.body.url, short_url: "number" });
  } else {
    res.json({ error: "invalid url" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
