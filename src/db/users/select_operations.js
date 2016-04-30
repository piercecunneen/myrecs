var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var queryFunctions = require('../queries/execute_queries')

var exectuteSelect = queryFunctions.exectuteSelect;



function getUser(username, client, callback){
	var queryString = "SELECT id, username, email from users where username = $1";
	var params = [username];
	exectuteSelect(queryString, params, client, callback);
}

function getAllUsers(client, callback){
	var queryString = "SELECT username, email from users";
	var params = [];
	exectuteSelect(queryString, params, client, callback);
}

function getAllTables(client, callback){
	var queryString = "select table_name from information_schema.tables where table_schema='public' and table_type = 'BASE TABLE'"
	var params = [];
	exectuteSelect(queryString, params, client, callback);
}


module.exports = {
	getUser:getUser,
	getAllUsers:getAllUsers,
	getAllTables:getAllTables

};
