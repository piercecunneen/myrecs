var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var crypto = require('crypto');

function hashPassword(password){
	var md5Hash = crypto.createHash('md5');
	HashedPassword = md5Hash.update(password).digest('hex');
	console.log(HashedPassword);
	return HashedPassword;
}


function addUser(username, password, email){
	pg.connect(db_path, function (err, client, done) {
		if (err){
			console.log("Error connecting to database");
			return -1;
		}
		else{
			var query = client.query(
				"INSERT INTO users(id, username, password, email,isValidated) values (DEFAULT, $1, $2, $3, $4)",
				[username, hashPassword(password), email, 0],
				function(err, result){
					if (err){
						console.log(err);
						console.log("Error inserting");
					}
					else{
						console.log('row inserted');
					}
				});
			endConnection(client, query);

		}
	});
}

function addArtist (artistName){
	pg.connect(db_path, function (err, client, done) {
		if (err) {
			console.log("Error connecting to database");

		}
		else{
			var query = client.query(
				"insert into musicArtists values (DEFAULT, $1)", [artistName]
				, function (err, results){
					if (err){
						console.log(err);
						return -1;
					}
					else{
						console.log('artist inserted');
						return 0;
					}
				});
			endConnection(client, query);

		}
	})
}

function getArtistID(artistName, callback){
	pg.connect(db_path, function (err, client, done) {
		if (err){
			console.log("error connecting to database");
		}

		else{
			var query = client.query(
				"select artistID from musicArtists where artistName = $1", [artistName]
				, function (err, results){
					if (err){
						console.log(err);
						callback(-1);
					}
					else{
						endConnection(client, query);
						callback(results.rows[0].artistid);

					}
				});

		}
	})

}





function getAlbumID(artistName, callback){
	pg.connect(db_path, function (err, client, done) {
		if (err){
			console.log("error connecting to database");
		}

		else{
			var query = client.query(
				"select albumID from albums where albumName = $1", [artistName]
				, function (err, results){
					if (err){
						console.log(err);
						return -1;
					}
					else{
						endConnection(client, query);
						callback(results.rows[0].albumid);
					}
				});

		}
	})
}

function addAlbum (albumTitle, artistName) {
	getArtistID(artistName, function(artistID){
		pg.connect(db_path, function (err, client, done) {
			if (err){
				console.log("error connecting to database");
			}
			else{
				console.log(artistID);
				var query = client.query(
					"insert into albums values (DEFAULT, $1, $2)", [albumTitle, artistID], 
					function (err, results){
						if (err){
							console.log(err);
							return -1;
						}
						else {
							console.log('album inserted');

						}
					});
				endConnection(client, query);
			}
		});
	});	
}



function addSong(songTitle, artistName, albumName){
	getArtistID(artistName, function(artistID){
		getAlbumID(albumName, function(albumID) {
			pg.connect(db_path, function (err, client, done) {
				if (err){
					console.log("error connecting to database");
				}

				else{
					var query = client.query("insert into songs values (DEFAULT, $1, $2, $3) RETURNING songid", [songTitle, artistID, albumID],
						function(err, results) {
							if (err){
								console.log(err);
							}
							else{
								console.log('song inserted');
								addArtistSongMatch(artistID, results.rows[0].songid, client);
					
							}
						});
				}
			});
		});
	});
}

function executeInsert(queryString, params, client){
	var query = client.query(queryString, params,
		function(err, results) {
			if (err){
				console.log(err);
			}
			else{
				console.log("insertion successful");
				endConnection(client, query);
			}
		})
}


function addArtistSongMatch(artistID, songID, client){
	var query = client.query("insert into ArtistsSongs values ($1, $2)", [artistID, songID],
		function(err, results){
			if (err){
				console.log(err);
			}
			else{
				console.log("Song artist match inserted");
				endConnection(client, query)
			}
		});
}





function endConnection(client, query){
	query.on('end', function() {
		console.log('ending connection');
		client.end();
	});
}



addUser('pcunneen', '5BrnH+', 'pcunneen@nd.edu')







