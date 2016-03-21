var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var insertFunctions = require('./insert_operations');
var queryFunctions = require('../queries/execute_queries')

var executeCreateDBQuery = queryFunctions.executeCreateDBQuery;



function addTables(client, callback){
	createUserDB(client, callback);

}


function createUserDB(client, callback){
	var table = "users";
	var queryString = "CREATE TABLE " + table + "(id SERIAL PRIMARY KEY, username VARCHAR(40) not null, password UUID not null, email VARCHAR(40), isValidated BOOLEAN)";
	var params = [];
	executeCreateDBQuery(queryString, params, client, callback);
	
}


module.exports = {
	addTables:addTables

}