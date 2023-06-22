const express = require("express");
const db = require('../utils/db');
const parse = require("nodemon/lib/cli/parse");
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })


const router = express.Router();

var table;

//Endpoint para tela de pesquisa
router.all("/:permissao", (req, res) => {
   //Renderiza a página ejs index na pasta busca
   res.render("busca/index", {permissao: req.params.permissao});
});

//Enspoint da tela de sugestões
router.get("/:permissao/sugestoes", (req, res) => {
   const sqlAlteracao = "SELECT * FROM Alteracao ORDER BY DATA"; // Consulta SQL para selecionar e ordenar as informações da tabela "Alteracao" pela coluna "DATA"
   const sqlOwners = "SELECT DataOwner FROM Catalogo_Dados_Owners_Stewards"; // Consulta SQL para selecionar os DataOwners
//Abre o banco de dados para a primeira constante
   db.all(sqlAlteracao, (err, rowsAlteracao) => {
     if (err) {
       console.error(err.message);
       res.send("Erro: " + err.message);
       return;
     }
//Abre o banco de dados para a segunda constante
     db.all(sqlOwners, (err, rowsOwners) => {
       if (err) {
         console.error(err.message);
         res.send("Erro: " + err.message);
         return;
       }

       // Transforma o resultado em uma lista de nomes de owners
       const owners = rowsOwners.map(row => row.DataOwner);
       //Renderiza arquivo ejs sugestoes dentro da pasta sugestoes
       res.render("sugestoes/sugestoes", { permissao: req.params.permissao, model: rowsAlteracao, owners });
     });
   });
 });

 
// Exclui um registro (é o D do CRUD - Delete)
router.get('/:permissao/analisado', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); 
   //Comando SQL para deletar da tabela a linha com o ID pego na query
	sql = "DELETE FROM Alteracao WHERE ID_ALTERACAO='" + req.query.ID_ALTERACAO + "'";
	console.log(sql);
   //Abre o banco de dados 
	db.all(sql, [],  err => {
		if (err) {
		    throw err;
		}
		res.redirect("/busca/"+req.params.permissao+"/sugestoes");
		res.end();
	});
});

//Endpoint da saída da pesquisa
router.get("/:permissao/saida/:limit", (req, res) => {

   let ordenar = req.get["ordenar"];
   let params;
   //Variável para selecionar a palvra escrita no input pesquisa 
      table = req.query.pesquisa === undefined ? table : req.query.pesquisa;

   let limit = `limit ${parseInt(req.params.limit) * 10},10`
   //Variável com comando SQL para selecionar as tabelas 
   let query = ` WHERE TABELA LIKE '%${table}%' OR CONTEUDO_TABELA LIKE '%${table}%' ${limit}`;


   if (!ordenar) {
      ordenar = "";
      params = [];
   } else {
      ordenar = "ORDER BY ? COLLATE NOCASE ASC";
      params = [ordenar];
   }
//Comando SQL para selecionar as tabelas de acordo com a variável query
   const sql = "SELECT * FROM Catalogo_Dados_Tabelas " + query;
//Abre o banco de dados
   db.all(sql, params, (err, rows) => {
      if (err) {
         console.error(err.message);
         res.send("Erro: " + err.message);
         return;
      }
      if(rows == null){
//Renderiza página ejs saida dentro da pasta busca    
      res.render("busca/saida");
      }
      res.render("busca/saida", {limit: req.params.limit, permissao: req.params.permissao, model: rows, next: `/busca/${(req.params.permissao)}/saida/${parseInt(req.params.limit) + 1}`, prev: `/busca/${(req.params.permissao)}/saida/${parseInt(req.params.limit) - 1}`});
   });

//Endpoint de mostrar a página com os campos das tabelas
router.all("/:permissao/saida/:limit/campos", (req, res) => {

   let ordenar = req.query["ordenar"];
   let params;
//Variáveis para pegar os ID e o nome da tabela  na query
   let idTabela = req.query.ID_DADOS_TABELAS;
   let tabela = req.query.TABELA;
   //Primeiro comando SQL para selecionar de acordo com o ID
   const sql1 = `SELECT * FROM Catalogo_Dados_Tabelas WHERE ID_DADOS_TABELAS = '${idTabela}' `; 
   console.log(sql1);
   db.all(sql1, params,  (err1, rows1 ) => {
      if (err1) {
         throw err1;
      }
      //Segundo comando SQL para selecionar de acordo com o nome da tabela
      var sql2 = `SELECT * FROM Catalogo_Dados_Variaveis WHERE TABELA = '${tabela}' `;
      console.log(sql2);
      db.all(sql2, [],  (err2, rows2 ) => {
         if (err2) {
            throw err2;
         }
         //Renderizar a página ejs campos da pasta metadados
         res.render("metadados/campos", {limit: req.params.limit, permissao: req.params.permissao, model: rows1, variaveis: rows2,next: `/busca/${(req.params.permissao)}/saida/${parseInt(req.params.limit) + 1}`, prev: `/busca/${(req.params.permissao)}/saida/${parseInt(req.params.limit) - 1}/campos`});
       });
   });

      
   });
});

//Endpoint de mostrar a página com as informações direta das tabelas
router.all("/:permissao/saida/:limit/tabela", (req, res) => {

   let ordenar = req.query["ordenar"];
   let params;
//Variáveis para pegar os ID e o nome da tabela  na query
   let idTabela = req.query.ID_DADOS_TABELAS;
   let tabela = req.query.TABELA;
   //Primeiro comando SQL para selecionar de acordo com o ID
   const sql1 = `SELECT * FROM Catalogo_Dados_Tabelas WHERE ID_DADOS_TABELAS = '${idTabela}' `; 
   console.log(sql1); 
   db.all(sql1, params,  (err1, rows1 ) => {
      if (err1) {
         throw err1;
      }
      //Segundo comando SQL para selecionar de acordo com o nome da tabela
      var sql2 = `SELECT * FROM Catalogo_Dados_Tabelas WHERE TABELA = '${tabela}' `;
      console.log(sql2);
      db.all(sql2, [],  (err2, rows2 ) => {
         if (err2) {
            throw err2;
         }
         //Renderizar a página ejs tabela da pasta metadados
         res.render("metadados/tabela", {limit: req.params.limit, permissao: req.params.permissao, model: rows1, variaveis: rows2,next: `/busca/${(req.params.permissao)}/saida/${parseInt(req.params.limit) + 1}`, prev: `/busca/${(req.params.permissao)}/saida/${parseInt(req.params.limit) - 1}/tabela`});
       });
   });

      
   });

   //Endpoint de mostrar a página com as informações da fonde de dados das tabelas
   router.all("/:permissao/saida/:limit/fonteDados", (req, res) => {

      let ordenar = req.query["ordenar"];
      let params;
   //Variáveis para pegar os ID e o nome da tabela  na query
      let idTabela = req.query.ID_DADOS_TABELAS;
      let tabela = req.query.TABELA;
   //Primeiro comando SQL para selecionar de acordo com o ID
      const sql1 = `SELECT * FROM Catalogo_Dados_Tabelas WHERE ID_DADOS_TABELAS = '${idTabela}' `; 
      console.log(sql1);
      db.all(sql1, params,  (err1, rows1 ) => {
         if (err1) {
            throw err1;
         }
         //Segundo comando SQL para selecionar de acordo com o nome da tabela
         var sql2 = `SELECT * FROM Catalogo_Dados_Conexoes WHERE TABELA = '${tabela}' `;
         console.log(sql2);
         db.all(sql2, [],  (err2, rows2 ) => {
            if (err2) {
               throw err2;
            }
          //Renderizar a página ejs fonteDados da pasta metadados
            res.render("metadados/fonteDados", {limit: req.params.limit, permissao: req.params.permissao, model: rows1, variaveis: rows2,next: `/busca/${(req.params.permissao)}/saida/${parseInt(req.params.limit) + 1}`, prev: `/busca/${(req.params.permissao)}/saida/${parseInt(req.params.limit) - 1}/fonteDados`});
          });
      });
   
         
      });

      
   



module.exports = router;