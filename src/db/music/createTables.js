var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var queryFunctions = require('../queries/execute_queries')

var executeCreateDBQuery = queryFunctions.executeCreateDBQuery;


function addTables(client, callback){
	createMusicArtistsDB(client, "done");
	createAlbumDB(client, "done");
	createMusicGenreDB(client, "done");
	createArtistGenreDB(client, "done");
	createSongDB(client, "done");
	createUserSongLikes(client, "done");
	createUserAlbumLikes(client, "done");
	createUserArtistLikes(client, "done");
	createUserGenreLikes(client, callback);

}

function createSongDB(client, callback){
	var table = "songs";
	var queryString = "CREATE TABLE " + table + "(songID SERIAL PRIMARY KEY, songTitle VARCHAR(50) not null, artistID int REFERENCES musicArtists (artistID),  albumID int REFERENCES Albums (albumID))";
	var params = [];
	executeCreateDBQuery(queryString, params, client, callback);

}

function createMusicArtistsDB(client, callback){
	var table = "musicArtists";
	var queryString = "CREATE TABLE " + table + "(artistID SERIAL PRIMARY KEY, artistName VARCHAR(50) not null, startYear int)";
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
	var queryString = "CREATE TABLE " + table + "(musicGenreID int REFERENCES MusicGenres(genreID), artistID int REFERENCES musicArtists(artistID))";
	var params = [];
	executeCreateDBQuery(queryString, params, client, callback);

}

function createUserSongLikes(client, callback){
	var table = "UserSongLikes";
	var queryString = "CREATE TABLE " + table + "(userID int REFERENCES users (id), songID int REFERENCES songs (songID), date_of_like date)";
	var params = [];
	executeCreateDBQuery(queryString, params, client, callback);
}

function createUserAlbumLikes(client, callback){
	var table = "UserAlbumLikes";
	var queryString = "CREATE TABLE " + table + "(userID int REFERENCES users (id), albumID int REFERENCES albums (albumID), date_of_like date)";
	var params = [];
	executeCreateDBQuery(queryString, params, client, callback);
}

function createUserArtistLikes(client, callback){
	var table = "UserArtistLikes";
	var queryString = "CREATE TABLE " + table + "(userID int REFERENCES users (id), artistID int REFERENCES musicartists (artistID), date_of_like date)";
	var params = [];
	executeCreateDBQuery(queryString, params, client, callback);
}

function createUserGenreLikes(client, callback){
	var table = "UserGenreLikes";
	var queryString = "CREATE TABLE " + table + "(userID int REFERENCES users (id), genreID int REFERENCES musicgenres (genreID), date_of_like date)";
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
	createUserSongLikes:createUserSongLikes,
	createUserAlbumLikes:createUserAlbumLikes,
	createUserArtistLikes:createUserArtistLikes,
	createUserGenreLikes:createUserGenreLikes
}
