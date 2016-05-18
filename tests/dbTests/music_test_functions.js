


var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var queryFunctions = require('../queries/execute_queries')
const util = require('util');

var userFunctions = require('../users/select_operations');

var exectuteSelect = queryFunctions.exectuteSelect;


function getLikes(likeType, client, callback){
	var types = {"song": "songLikes", "album":"albumLikes", "artist": "artistLikes"}
	var queryString = "select * from $1";
	var params = [types[likeType]];
	exectuteSelect(queryString, params, client, callback);
}

