var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';

var client = new pg.Client(db_path);

pg.connect(db_path, function (err, client, done) {
	if (err){
		console.log('Cannot connect to ' + db_name + ' database');
	}
	else{
		createUsers(client, done);
		createMusicArtistsDB(client, done);
		createAlbumDB(client, done);
		createMusicGenreDB(client, done);
		createSongDB(client, endConnection);

	}

});

function createUsers(client, callback){
	var table = "users";
	var query = client.query("CREATE TABLE " + table + "(id SERIAL PRIMARY KEY, username VARCHAR(40) not null, password UUID not null, email VARCHAR(40), isValidated BOOLEAN)", function (err) {
		if (err) {
			console.log(err);

		}
		else{
			console.log("Table " + table + " created successfully");
			callback();

		}
	});
	

}

function createSongDB(client, callback){
	var table = "songs";
	var query = client.query("CREATE TABLE " + table + "(songID SERIAL PRIMARY KEY, songTitle VARCHAR(50) not null, artistID int REFERENCES musicArtists (artistID),  albumID int REFERENCES Albums (albumID))" , function (err) {
		if (err) {
			console.log(err);

		}
		else{
			console.log("Table " + table + " created successfully");
			
		}
		callback(client,query);
	});
	
}

function createMusicArtistsDB(client, callback){
	var table = "musicArtists";
	var query = client.query("CREATE TABLE " + table + "(artistID SERIAL PRIMARY KEY, artistName VARCHAR(50) not null)" , function (err) {
		if (err) {
			console.log(err);

		}
		else{
			console.log("Table " + table + " created successfully");
			callback();

		}
	});

}




function createAlbumDB(client, callback){
	var table = "Albums";
	var query = client.query("CREATE TABLE " + table + "(albumID SERIAL PRIMARY KEY, albumName VARCHAR(40), artistID int REFERENCES musicArtists(artistID))" , function (err) {
		if (err) {
			console.log(err);

		}
		else{
			console.log("Table " + table + " created successfully");
			callback();

		}
	});
}
function createMusicGenreDB(client, callback){
	var table = "MusicGenres";
	var queryString = "CREATE TABLE " + table + "(musicGenre SERIAL PRIMARY KEY, musicGenreName VARCHAR(40))";
	var params = [];
	executeInsert(queryString, params, client, function(){
		queryString = "CREATE Unique Index on " + table + "(musicGenreName) ";
		executeInsert(queryString, params, client, function(err, results){
			if (err){
				console.log(err);
			}	
			else{
				console.log(results);
				callback();
			}
		});
	});
	


}

function returnClientToPool(client, query){
	if (typeof query === "Undefined") {
		console.log(err);

	}
	else{
		client.done();
	}
}


function executeInsert(queryString, params, client, callback){
	// Written to create a more modular codebase and reduce code reuse.
	var query = client.query(queryString, params,
		function(err, results) {
			if (err){
				console.log(err);
			}
			else{
				callback(results);
				
			}
		})
}

function endConnection(client, query){
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





