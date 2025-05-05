const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const hbsConfig = require("./configs/hbs.js");
const session = require('express-session');
const feed = require("./routes/feedback.routes.js");
const MongoStore = require("connect-mongo");


const app = express();
dotenv.config();

hbsConfig(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));

// Configuración de session con connect-mongo
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 14 * 24 * 60 * 60, // Tiempo de vida: 14 días
  }),
  cookie: {
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 días en ms
    secure: false, // pon true si usas HTTPS
    httpOnly: true,
  },
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
