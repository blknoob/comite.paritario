const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const hbsConfig = require("./configs/hbs.js");
const session = require('express-session');
const feed = require("./routes/feedback.routes.js");


const app = express();
dotenv.config();

hbsConfig(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));

app.use(session({
  secret: 'super',
  resave: false,
  saveUninitialized: false
}));


app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});


app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});


app.use("/", feed);


module.exports = app;
