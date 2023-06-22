const express = require("express");
const db = require('../utils/db');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const router = express.Router();

//Endpoint para inserir sugestões na tabea alteração
router.post('/', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    //Comando SQL para inserir em todos os campos da tabela Alteracao de acordo com as as requisições do corpo do arquivo 
    sql = "INSERT INTO Alteracao (ID_TABELA, NOME, DATA, CAMPO, ALTERACAO, TABELA) VALUES ('" + req.body.ID_TABELA + "','" + req.body.NOME + "','" + req.body.DATA + "','" + req.body.CAMPO + "', '" + req.body.ALTERACAO + "', '" + req.body.TABELA + "')";
    console.log(sql);
    db.all(sql, [],  err => {
       if (err) {
             throw err;
       }
       res.end();
    });
 });

 

 module.exports = router;