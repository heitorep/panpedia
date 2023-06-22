const express = require("express");
const db = require('../utils/db');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const router = express.Router();

router.all("/", (req, res) => {
	res.render("login/login");
});


module.exports = router;
