

var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var queryFunctions = require('../queries/execute_queries');
var selectFunctions = require('./select_operations');
var executeInsertQuery = queryFunctions.executeInsertQuery;
var getClient = require("../client/get_client").getClient;

var getUser = require("../users/select_operations").getUser;




function addUserSongLike(username, spotifySongID, client, callback){
	getUser(username, client, function(err, userData) {
		if (err){
			callback(err);
		}
		queryString = "INSERT into songLikes values ($1, $2, CURRENT_DATE)";
		queryParameters = [spotifySongID, userData[0].id];
		executeInsertQuery(queryString, queryParameters, client, callback);
	});
}

function addUserArtistLike(username, spotifyArtistID, client, callback){
	getUser(username, client, function(err, userData) {
		if (err){
			callback(err);
		}
		queryString = "INSERT into artistLikes values ($1, $2, CURRENT_DATE)";
		queryParameters = [spotifyArtistID, userData[0].id];
		executeInsertQuery(queryString, queryParameters, client, callback);
	});
}
function addUserAlbumLike(username, spotifyAlbumID, client, callback){
	getUser(username, client, function(err,userData) {
		if (err){
			callback(err);
		}
		queryString = "INSERT into albumLikes values ($1, $2, CURRENT_DATE)";
		queryParameters = [spotifyAlbumID, userData[0].id];
		executeInsertQuery(queryString, queryParameters, client, callback);
	});
}











module.exports = {
	addUserSongLike:addUserSongLike,
	addUserArtistLike:addUserArtistLike,
	addUserAlbumLike:addUserAlbumLike


};
