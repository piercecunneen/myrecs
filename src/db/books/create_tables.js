var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var queryFunctions = require('../queries/execute_queries')

var executeCreateDBQuery = queryFunctions.executeCreateDBQuery;

function addTables(client, callback){
  addBookGenreDB(client, "done");
  addAuthorDB(client, "done");
  addBookDB(client, callback);
}

function addBookDB( client, callback){
  var table = "Books"
  var queryString = "CREATE table " + table + "(bookID SERIAL PRIMARY KEY, title VARCHAR(50), authorID int REFERENCES Authors (authorID),"
  + "genreID int REFERENCES bookGenres(genreID))";
  var queryParameters = [];
  executeCreateDBQuery(queryString, queryParameters, client, callback);
}

function addAuthorDB(client, callback){
  var table = "Authors";
  var queryString = "CREATE table " + table + "(authorID SERIAL PRIMARY KEY, Name VARCHAR(50))";
  var queryParameters = [];
  executeCreateDBQuery(queryString, queryParameters, client, callback);
}
function addBookGenreDB(client, callback){
  var table = "bookGenres";
  var queryString = "CREATE table " + table + "(genreID SERIAL PRIMARY KEY, Name VARCHAR(50))";
  var queryParameters = [];
  executeCreateDBQuery(queryString, queryParameters, client, callback);
}


module.exports = {
  addTables:addTables,
  addBookDB:addBookDB,
  addAuthorDB:addAuthorDB,
  addBookGenreDB:addBookGenreDB,
}
