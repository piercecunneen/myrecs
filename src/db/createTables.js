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
		createSongDB(client, done);
		// createArtistsSongsDB(client, done);

	}


});

function createUsers(client, done){
	var table = "users";
	var query = client.query("CREATE TABLE " + table + "(id SERIAL PRIMARY KEY, username VARCHAR(40) not null, password UUID not null, email VARCHAR(40), isValidated BOOLEAN)", function (err) {
		if (err) {
			console.log("Table " + table + " already exists");
		}
		else{
			console.log("Table " + table + " created successfully");
		}
		done();
	});
	

}

function createSongDB(client, done){
	var table = "songs";
	var query = client.query("CREATE TABLE " + table + "(songID SERIAL PRIMARY KEY, songTitle VARCHAR(50) not null, artistID int REFERENCES musicArtists (artistID),  albumID int REFERENCES Albums (albumID))" , function (err) {
		if (err) {
			console.log(err);
			console.log("Table " + table + " already exists");
		}
		else{
			console.log("Table " + table + " created successfully");
		}
		endConnection(client, query);
	});
	
}

function createMusicArtistsDB(client, done){
	var table = "musicArtists";
	var query = client.query("CREATE TABLE " + table + "(artistID SERIAL PRIMARY KEY, artistName VARCHAR(50) not null)" , function (err) {
		if (err) {
			console.log("Table " + table + " already exists");
		}
		else{
			console.log("Table " + table + " created successfully");
		}
		done();
	});

}


// function createArtistsSongsDB(client, done){
// 	var table = "ArtistsSongs";
// 	var query = client.query("CREATE TABLE " + table + "(artistID int REFERENCES musicArtists(artistID), songID int REFERENCES songs(songID))" , function (err) {
// 		if (err) {
// 			console.log(err);
// 		}
// 		else{
// 			console.log("Table " + table + " created successfully");
// 		}
		
// 	});
// 	query.on('end', function(){
// 		var query2 = client.query('CREATE INDEX on ArtistsSongs (artistID)');
// 		endConnection(client, query2);

// 	});


// }


function createAlbumDB(client, done){
	var table = "Albums";
	var query = client.query("CREATE TABLE " + table + "(albumID SERIAL PRIMARY KEY, albumName VARCHAR(40), artistID int REFERENCES musicArtists(artistID))" , function (err) {
		if (err) {
			console.log("Table " + table + " already exists");
		}
		else{
			console.log("Table " + table + " created successfully");
		}
		done();
	});
}

function endConnection(client, query){
	query.on('end', function() {
		console.log('ending connection');
		client.end();
	});
}





