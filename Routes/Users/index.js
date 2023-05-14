const express = require("express");

const router = express.Router();

router.use("/users", require("./User.routes"));

module.exports = router;
