const express = require("express");

const router = express.Router();

router.use("/auth", require("./Auth.routes"));

module.exports = router;
