var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var insertFunctions = require('./insert_operations');


function addTables(client, callback){
	createUsers(client, "done");
	createMusicArtistsDB(client, "done");
	createAlbumDB(client, "done");
	createMusicGenreDB(client, "done");
	createArtistGenreDB(client, "done");
	createSongDB(client, callback)

}
// insertFunctions.getClient(db_path, function(client){
// 	addTables(client, endConnection);
// }) 
function createUsers(client, callback){
	var table = "users";
	var queryString = "CREATE TABLE " + table + "(id SERIAL PRIMARY KEY, username VARCHAR(40) not null, password UUID not null, email VARCHAR(40), isValidated BOOLEAN)";
	var params = [];
	executeCreateDBQuery(queryString, params, client, callback);
	
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
	var queryString = "CREATE TABLE " + table + "(genreID SERIAL PRIMARY KEY, musicGenreName VARCHAR(40))";
	var params = [];
	executeCreateDBQuery(queryString, params, client, function(){
		queryString = "CREATE Unique Index on " + table + "(musicGenreName) ";
		executeCreateDBQuery(queryString, params, client, callback);

	});
	
}

function createArtistGenreDB(client, callback){
	var table = "ArtistGenre";
	var queryString = "CREATE TABLE " + table + "(musicGenre int REFERENCES MusicGenres(genreID), artistID int REFERENCES musicArtists(artistID))";
	var params = [];
	executeCreateDBQuery(queryString, params, client, callback);

}

function executeCreateDBQuery(queryString, params, client, callback){
	var query = client.query(queryString, params, 
		function(err, results){
			if (err){
				console.log(err);
			}
			else{
				if (callback == "done"){
					client.done();
					
				}
				else{
					callback(client, query);
				}
			}
	});

}

function endConnection(client, query, callback){
	if (typeof query === "Undefined"){
		console.log(err);
	}
	else{	
		query.on('end', function() {
			console.log('ending connection');
			client.end();
		});
	}
}



module.exports = {
	addTables:addTables,
	createUsers:createUsers,
	createSongDB:createSongDB,
	createMusicArtistsDB:createMusicArtistsDB, 
	createAlbumDB:createAlbumDB,
	createMusicGenreDB:createMusicGenreDB,
	createArtistGenreDB:createArtistGenreDB,
	executeCreateDBQuery:executeCreateDBQuery,
	endConnection:endConnection
}



