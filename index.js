require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser"); // Import body-parser module

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); // Use body-parser for parsing URL-encoded data
app.use(bodyParser.json()); // Use body-parser for parsing JSON data
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

let urlDatabase = {};
let shortUrlCounter = 1;

app.post("/api/shorturl", function (req, res) {
  const originalUrl = req.body.url;

  // Validation regex for URL format
  const urlRegex = /^http:\/\/(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/\S*)?$/;

  if (!urlRegex.test(originalUrl)) {
    return res.status(400).json({ error: "invalid url" });
  }

  const shortUrl = shortUrlCounter++;
  urlDatabase[shortUrl] = originalUrl;

  return res.json({ original_url: originalUrl, short_url: shortUrl });
});

app.get("/api/shorturl/:short_url", function (req, res) {
  const shortUrl = req.params.short_url;
  const originalUrl = urlDatabase[shortUrl];

  if (!originalUrl) {
    return res.status(404).json({ error: "URL not found" });
  }

  return res.redirect(originalUrl);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});