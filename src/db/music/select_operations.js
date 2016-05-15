var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var queryFunctions = require('../queries/execute_queries')
const util = require('util');

var userFunctions = require('../users/select_operations');

var exectuteSelect = queryFunctions.exectuteSelect;


function getAllTables(client, callback){
	var queryString = "select table_name from information_schema.tables where table_schema='public' and table_type = 'BASE TABLE'"
	var params = [];
	exectuteSelect(queryString, params, client, callback);
}



function getUserSongLikes(username, client, callback){
	userFunctions.getUser(username, client, function(err,userData){
		if (err){
			callback(err);
		}
		var queryString = "SELECT spotifySongID, date_of_like from songLikes where userID = %1";
		var queryParameters = [userData[0].id]
		exectuteSelect(queryString, queryParameters, client, callback);
	});
}

function getUserAlbumLikes(username, client, callback){
	userFunctions.getUser(username, client, function(err, userData){
		if (err){
			callback(err);
		}
		var queryString = "SELECT spotifyAlbumID, date_of_like from songLikes where userID = %1";
		var queryParameters = [userData[0].id]
		exectuteSelect(queryString, queryParameters, client, callback);
	});
}

function getUserArtistLikes(username, client, callback){
	userFunctions.getUser(username, client, function(err, userData){
		if (err){
			callback(err);
		}
		var queryString = "SELECT spotifyArtistID, date_of_like from songLikes where userID = %1";
		var queryParameters = [userData[0].id]
		exectuteSelect(queryString, queryParameters, client, callback);
	});
}




module.exports = {
	getAllTables:getAllTables,
	getUserSongLikes:getUserSongLikes,
	getUserAlbumLikes:getUserAlbumLikes,
	getUserArtistLikes:getUserArtistLikes


}
