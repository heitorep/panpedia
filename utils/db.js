const path = require("path");
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(path.join(__dirname, process.env.DB), err => {
	if (err) {
		return console.error(err.message);
	}
	console.log("Successful connection to the database 'Tabela_Pan_Pedia.db'");
});

module.exports = db;
