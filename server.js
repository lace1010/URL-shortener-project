require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

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
  console.log(
    req.body.url.slice(0, 12),
    "<= first part of string to match https://www."
  );

  //https://www.
  console.log(req.body.url.slice(req.body.url.length - 4));

  let lastFourURL = req.body.url.slice(req.body.url.length - 4);
  if (
    (req.body.url.slice(0, 12) == "https://www." && lastFourURL == ".com") ||
    lastFourURL == ".org"
  ) {
    res.json({ original_url: req.body.url, short_url: "number" });
  } else {
    res.json({ error: "Invalid URL" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
