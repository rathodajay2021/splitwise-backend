const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const chalk = require("chalk");

/****************GLOBAL VAR & CONST****************/
require("./Config/globals");
const app = express();
app.use(cors());
//data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3030;
const URL =
  process.env.URL ||
  "mongodb+srv://harshilpatel:reset123@harshilcluster.xcv6bpi.mongodb.net/splitwise?retryWrites=true&w=majority";

/****************GLOBAL RESPONSE HANDLER SETUP****************/
app.use((req, res, next) => {
  const ResponseHandler = require("./Config/responseHandler");
  res.handler = new ResponseHandler(req, res);
  next();
});

/****************MULTI LANG SETUP****************/
const language = require("i18n");
language.configure({
  locales: ["en"],
  defaultLocale: "en",
  autoReload: true,
  directory: __dirname + "/Locales",
  queryParameter: "lang",
  objectNotation: true,
  syncFiles: true,
});
app.use(language.init); // MULTILINGUAL SETUP

/****************ROUTES****************/
const appRoutes = require("./Routes");
appRoutes(app);

/****************GLOBAL ERROR****************/
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.handler.serverError(err);
});

/****************SERVER****************/
mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    (result) => app.listen(PORT),
    console.log(
      `server is working on port no \n${chalk.underline.blue(
        `http://localhost:${PORT}`
      )}`
    )
  )
  .catch((err) => console.log(`error in mongoose connect and error is ${err}`));
