var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var crypto = require('crypto');


function hashPassword(password){
	var md5Hash = crypto.createHash('md5');
	HashedPassword = md5Hash.update(password).digest('hex');
	return HashedPassword;
}


function addUser(username, password, email, client, callback){
	var query = client.query("INSERT INTO users(id, username, password, email,isValidated) values (DEFAULT, $1, $2, $3, $4)",	
		[username, hashPassword(password), email, 0], 
		function(err, result){
			if (err){
				console.log(err);
				callback()
			}
			else{
				console.log( username + 'inserted');
				callback(client, query);
			}
		}
	);
}



function getClient(db_path){
	// Connects to postgresql database and returns the client connection
	var client = new pg.Client(db_path);
	client.connect();
	return client;

}

function addArtist (artistName, client, callback){
	var queryParameters = [artistName];
	executeInsert("insert into musicArtists values (DEFAULT, $1)", queryParameters, client, callback);
}

function getArtistID(artistName, client, callback){
	
	var query = client.query(
		"select artistID from musicArtists where artistName = $1", [artistName]
		, function (err, results){
			if (err){
				console.log(err);
			}
			else if (results.rows.length == 0){
				callback("None")
			}
			else{

				callback(results.rows[0].artistid);
			}
		});
}





function getAlbumID(artistName,client, callback){
	var query = client.query(
		"select albumID from albums where albumName = $1", [artistName]
		, function (err, results){
			if (err){
				console.log(err);
				return -1;
			}
			else{
				callback(results.rows[0].albumid);
			}
		});
}

function addAlbum (albumTitle, artistName, client, callback) {
	getArtistID(artistName, client, function(artistID){
		var queryParameters = [albumTitle, artistID];
		executeInsert("insert into albums values (DEFAULT, $1, $2)", queryParameters, client, callback); 
	});	
}



function addSong(songTitle, artistName, albumName, client, callback){
	getArtistID(artistName, client,function(artistID){
		getAlbumID(albumName, client,function(albumID) {
			var queryParameters = [songTitle, artistID, albumID]
			executeInsert("insert into songs values (DEFAULT, $1, $2, $3) RETURNING songid", queryParameters, client, callback)				
		});
	});
}

function executeInsert(queryString, params, client, callback){
	// Written to create a more modular codebase and reduce code reuse.
	var query = client.query(queryString, params,
		function(err, results) {
			if (err){
				console.log(err);
			}
			else{
				console.log("insertion successful");
				if (typeof callback != 'undefined'){
					callback(client, query);
				}
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
// module.exports.addArtist = addArtist;
// module.exports.addAlbum = addAlbum;
// module.exports.addSong = addSong;
// module.exports.addUser = addUser;








function insertArtists(artistNames){
	var client = getClient(db_path);
	for (var i = 0; i < artistNames.length; i++){
		if (i == artistNames.length - 1) {
			addArtist(artistNames[i], client, endConnection);

		}
		else{
			addArtist(artistNames[i], client);
		}
	}

}

function insertAlbums(albumsAndArtists){
	var size = Object.keys(albumsAndArtists).length;
	var count = 0;
	var client = getClient(db_path);
	for (var album in albumsAndArtists) {
		if (count === size - 1){
			addAlbum(album, albumsAndArtists[album], client, endConnection);

		}
		else{
			addAlbum(album, albumsAndArtists[album], client);

		}
		count += 1;

	}

}

function insertSongs(songs){
	var client = getClient(db_path);
	for (var i = 0; i < songs.length; i++){
		console.log(songs[i].songName);
		if (i == songs.length-1){
			addSong(songs[i].songName, songs[i].artistName, songs[i].albumName, client, endConnection);

		}
		else {
			addSong(songs[i].songName, songs[i].artistName, songs[i].albumName, client);

		}
	}
}

var artists = ['Rihanna', 'Beyonce'];
var albums = {'Loud':'Rihanna', 'Dangerously in Love':'Beyonce', 'Good girl gone bad': 'Rihanna'}
var songs = [ {songName:"Disturbia" , artistName:'Rihanna' , albumName:'Good girl gone bad' }, 
			{songName: 'S&M', artistName:'Rihanna' , albumName:'Loud' },
			{songName: "If I were a boy", artistName:'Beyonce' , albumName:"Dangerously in Love"  },
			{songName:"Halo" , artistName:'Beyonce' , albumName:"Dangerously in Love" },
			{songName:"Diamonds" , artistName:'Rihanna' , albumName: "Loud"},
			{songName: "Listen", artistName: 'Beyonce', albumName: "Dangerously in Love" },
			{songName:"Work" , artistName:'Rihanna' , albumName:"Good girl gone bad" },
			]

// insertArtists(artists);
// insertAlbums(albums);
// insertSongs(songs);

module.exports = {
	addSong: addSong,
	addArtist: addArtist,
	addAlbum: addAlbum,
	endConnection:endConnection,
	getClient:getClient,
	getArtistID:getArtistID,
	getAlbumID:getAlbumID,
	hashPassword:hashPassword
}









