const express = require("express");
const db = require('../utils/db');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const router = express.Router();

//Endpoint do login
router.all("/", (req, res) => {
	//Renderizar a página ejs login da pasta login
	res.render("login/login");
});


module.exports = router;
