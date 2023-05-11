const pathUrl = require("../Helpers/path.js");

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.status(STATUS_CODES.SUCCESS).send("working just fine");
  });

  //   app.use(pathUrl.DEFAULT_URL, require("./usersRotes"));
};
