var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var queryFunctions = require('../queries/execute_queries')


var exectuteSelect = queryFunctions.exectuteSelect;

function getAllTables(client, callback){
	var queryString = "select table_name from information_schema.tables where table_schema='public' and table_type = 'BASE TABLE'"
	var queryParameters = [];
	exectuteSelect(queryString, queryParameters, client, callback);
}

function getAllGenres(client, callback){
	var queryString = "select name from bookGenres";
	var queryParameters = [];
	exectuteSelect(queryString, queryParameters, client, callback);
}

function getAllAuthors(client, callback){
	var queryString = "select name from Authors";
	var queryParameters = [];
	exectuteSelect(queryString, queryParameters, client, callback);
}

function getAllBooks(client, callback){
	var queryString = "select title from Books";
	var queryParameters = [];
	exectuteSelect(queryString, queryParameters, client, callback);
}

function getAllBookGenrePairs(client, callback){
	var queryString = "select genreID from bookGenrePairs";
	var queryParameters = [];
	exectuteSelect(queryString, queryParameters, client, callback);

}




function getGenreID(genreName, client, callback){
	var queryString = "select genreID from bookGenres where name = $1";
	var queryParameters = [genreName];
	exectuteSelect(queryString, queryParameters, client, function(results){
		if (results == "Error"){
			callback("Error");
		}
		else{
			callback(results[0].genreid);
		}
	});

}

function getAuthorID(authorName, client, callback){
	var queryString = "select authorID from Authors where name = $1";
	var queryParameters = [authorName];
	exectuteSelect(queryString, queryParameters, client, function(results){
		if (results == "Error"){
			callback("Error");
		}
		else{
			callback(results[0].authorid);
		}
	});
}




module.exports = {
    getAllTables:getAllTables,
	getGenreID:getGenreID,
	getAuthorID:getAuthorID,
	getAllGenres:getAllGenres,
	getAllAuthors:getAllAuthors,
	getAllBooks:getAllBooks,
	getAllBookGenrePairs:getAllBookGenrePairs

}
