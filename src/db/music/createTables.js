var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var queryFunctions = require('../queries/execute_queries')
const util = require('util');

var executeCreateDBQuery = queryFunctions.executeCreateDBQuery;


function addTables(client, callback){
	createSongLikesDB(client, "done");
	createArtistLikesDB(client, "done");
	createAlbumLikesDB(client, callback);
}


function createSongLikesDB(client, callback){
	var table = "songLikes";
	var queryString = util.format("CREATE TABLE %s (spotifySongID VARCHAR(30) not null, userID int REFERENCES users (id), date_of_like date )", table);
	var params = [];
	executeCreateDBQuery(queryString, params, client, callback);
}

function createArtistLikesDB(client, callback){
	var table = "artistLikes";
	var queryString = util.format("CREATE TABLE %s (spotifyArtistID VARCHAR(30) not null, userID int REFERENCES users (id), date_of_like date )", table);
	var params = [];
	executeCreateDBQuery(queryString, params, client, callback);
}

function createAlbumLikesDB(client, callback){
	var table = "albumLikes";
	var queryString = util.format("CREATE TABLE %s (spotifyAlbumID VARCHAR(30) not null, userID int REFERENCES users (id), date_of_like date )", table);
	var params = [];
	executeCreateDBQuery(queryString, params, client, callback);
}











module.exports = {
	addTables:addTables
}
