var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var insertFunctions = require('./insert_operations');
var queryFunctions = require('../queries/execute_queries')

var executeCreateDBQuery = queryFunctions.executeCreateDBQuery;


function addTables(client, callback){
	createMusicArtistsDB(client, "done");
	createAlbumDB(client, "done");
	createMusicGenreDB(client, "done");
	createArtistGenreDB(client, "done");
	createSongDB(client, callback)

}

function createSongDB(client, callback){
	var table = "songs";
	var queryString = "CREATE TABLE " + table + "(songID SERIAL PRIMARY KEY, songTitle VARCHAR(50) not null, artistID int REFERENCES musicArtists (artistID),  albumID int REFERENCES Albums (albumID))";
	var params = [];
	executeCreateDBQuery(queryString, params, client, callback);
	
}

function createMusicArtistsDB(client, callback){
	var table = "musicArtists";
	var queryString = "CREATE TABLE " + table + "(artistID SERIAL PRIMARY KEY, artistName VARCHAR(50) not null)";
	var params = [];
	executeCreateDBQuery(queryString, params, client, callback);
}




function createAlbumDB(client, callback){
	var table = "Albums";
	var queryString = "CREATE TABLE " + table + "(albumID SERIAL PRIMARY KEY, albumName VARCHAR(40), artistID int REFERENCES musicArtists(artistID))";
	var params = [];
	executeCreateDBQuery(queryString, params, client, callback);
}
function createMusicGenreDB(client, callback){
	var table = "MusicGenres";
	var queryString = "CREATE TABLE " + table + "(genreID SERIAL PRIMARY KEY, genreName VARCHAR(40))";
	var params = [];
	executeCreateDBQuery(queryString, params, client, function(){
		queryString = "CREATE Unique Index on " + table + "(genreName) ";
		executeCreateDBQuery(queryString, params, client, callback);

	});
	
}

function createArtistGenreDB(client, callback){
	var table = "ArtistGenre";
	var queryString = "CREATE TABLE " + table + "(musicGenre int REFERENCES MusicGenres(genreID), artistID int REFERENCES musicArtists(artistID))";
	var params = [];
	executeCreateDBQuery(queryString, params, client, callback);

}




module.exports = {
	addTables:addTables,
	createSongDB:createSongDB,
	createMusicArtistsDB:createMusicArtistsDB, 
	createAlbumDB:createAlbumDB,
	createMusicGenreDB:createMusicGenreDB,
	createArtistGenreDB:createArtistGenreDB,
}



