const express = require("express");
const db = require('../utils/db');
const parse = require("nodemon/lib/cli/parse");
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })


const router = express.Router();

var table;

router.all("/:permissao", (req, res) => {
   res.render("busca/index", {permissao: req.params.permissao});
});

router.get("/:permissao/sugestoes", (req, res) => {
   const sqlAlteracao = "SELECT * FROM Alteracao ORDER BY DATA"; // Consulta SQL para selecionar e ordenar as informações da tabela "Alteracao" pela coluna "DATA"
   const sqlOwners = "SELECT DataOwner FROM Catalogo_Dados_Owners_Stewards"; // Consulta SQL para selecionar os DataOwners

   db.all(sqlAlteracao, (err, rowsAlteracao) => {
     if (err) {
       console.error(err.message);
       res.send("Erro: " + err.message);
       return;
     }

     db.all(sqlOwners, (err, rowsOwners) => {
       if (err) {
         console.error(err.message);
         res.send("Erro: " + err.message);
         return;
       }

       // Transforma o resultado em uma lista de nomes de owners
       const owners = rowsOwners.map(row => row.DataOwner);

       res.render("sugestoes/sugestoes", { permissao: req.params.permissao, model: rowsAlteracao, owners });
     });
   });
 });

 
// Exclui um registro (é o D do CRUD - Delete)
router.get('/:permissao/analisado', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); 
	sql = "DELETE FROM Alteracao WHERE ID_ALTERACAO='" + req.query.ID_ALTERACAO + "'";
	console.log(sql);
	db.all(sql, [],  err => {
		if (err) {
		    throw err;
		}
		res.redirect("/busca/"+req.params.permissao+"/sugestoes");
		res.end();
	});
});

router.get("/:permissao/saida/:limit", (req, res) => {

   let ordenar = req.get["ordenar"];
   let params;
   
   table = req.query.pesquisa === undefined ? table : req.query.pesquisa;

   let limit = `limit ${parseInt(req.params.limit) * 10},10`
   let query = ` WHERE TABELA LIKE '%${table}%' OR CONTEUDO_TABELA LIKE '%${table}%' ${limit}`;


   if (!ordenar) {
      ordenar = "";
      params = [];
   } else {
      ordenar = "ORDER BY ? COLLATE NOCASE ASC";
      params = [ordenar];
   }

   const sql = "SELECT * FROM Catalogo_Dados_Tabelas " + query;

   db.all(sql, params, (err, rows) => {
      if (err) {
         console.error(err.message);
         res.send("Erro: " + err.message);
         return;
      }
      if(rows == null){
         
      res.render("busca/saida");
      }
      res.render("busca/saida", {limit: req.params.limit, permissao: req.params.permissao, model: rows, next: `/busca/${(req.params.permissao)}/saida/${parseInt(req.params.limit) + 1}`, prev: `/busca/${(req.params.permissao)}/saida/${parseInt(req.params.limit) - 1}`});
   });

router.all("/:permissao/saida/:limit/campos", (req, res) => {

   let ordenar = req.query["ordenar"];
   let params;
   let idTabela = req.query.ID_DADOS_TABELAS;
   let tabela = req.query.TABELA;
   const sql1 = `SELECT * FROM Catalogo_Dados_Tabelas WHERE ID_DADOS_TABELAS = '${idTabela}' `; 
   console.log(sql1);
   db.all(sql1, params,  (err1, rows1 ) => {
      if (err1) {
         throw err1;
      }
      var sql2 = `SELECT * FROM Catalogo_Dados_Variaveis WHERE TABELA = '${tabela}' `;
      console.log(sql2);
      db.all(sql2, [],  (err2, rows2 ) => {
         if (err2) {
            throw err2;
         }
         res.render("metadados/campos", {limit: req.params.limit, permissao: req.params.permissao, model: rows1, variaveis: rows2,next: `/busca/${(req.params.permissao)}/saida/${parseInt(req.params.limit) + 1}`, prev: `/busca/${(req.params.permissao)}/saida/${parseInt(req.params.limit) - 1}/campos`});
       });
   });

      
   });
});

router.all("/:permissao/saida/:limit/tabela", (req, res) => {

   let ordenar = req.query["ordenar"];
   let params;
   let idTabela = req.query.ID_DADOS_TABELAS;
   let tabela = req.query.TABELA;
   const sql1 = `SELECT * FROM Catalogo_Dados_Tabelas WHERE ID_DADOS_TABELAS = '${idTabela}' `; 
   console.log(sql1); 
   db.all(sql1, params,  (err1, rows1 ) => {
      if (err1) {
         throw err1;
      }
      var sql2 = `SELECT * FROM Catalogo_Dados_Tabelas WHERE TABELA = '${tabela}' `;
      console.log(sql2);
      db.all(sql2, [],  (err2, rows2 ) => {
         if (err2) {
            throw err2;
         }
         res.render("metadados/tabela", {limit: req.params.limit, permissao: req.params.permissao, model: rows1, variaveis: rows2,next: `/busca/${(req.params.permissao)}/saida/${parseInt(req.params.limit) + 1}`, prev: `/busca/${(req.params.permissao)}/saida/${parseInt(req.params.limit) - 1}/tabela`});
       });
   });

      
   });

   router.all("/:permissao/saida/:limit/fonteDados", (req, res) => {

      let ordenar = req.query["ordenar"];
      let params;
      let idTabela = req.query.ID_DADOS_TABELAS;
      let tabela = req.query.TABELA;
      const sql1 = `SELECT * FROM Catalogo_Dados_Tabelas WHERE ID_DADOS_TABELAS = '${idTabela}' `; 
      console.log(sql1);
      db.all(sql1, params,  (err1, rows1 ) => {
         if (err1) {
            throw err1;
         }
         var sql2 = `SELECT * FROM Catalogo_Dados_Conexoes WHERE TABELA = '${tabela}' `;
         console.log(sql2);
         db.all(sql2, [],  (err2, rows2 ) => {
            if (err2) {
               throw err2;
            }
            res.render("metadados/fonteDados", {limit: req.params.limit, permissao: req.params.permissao, model: rows1, variaveis: rows2,next: `/busca/${(req.params.permissao)}/saida/${parseInt(req.params.limit) + 1}`, prev: `/busca/${(req.params.permissao)}/saida/${parseInt(req.params.limit) - 1}/fonteDados`});
          });
      });
   
         
      });

      
   



module.exports = router;