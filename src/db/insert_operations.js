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
	var queryString = "INSERT INTO users(id, username, password, email,isValidated) values (DEFAULT, $1, $2, $3, $4)";
	var queryParameters = [username, hashPassword(password), email, 0];
	executeInsertQuery(queryString, queryParameters, client, callback);
}


function addArtist (artistName, client, callback){
	var queryString = "insert into musicArtists values (DEFAULT, $1)";
	var queryParameters = [artistName];
	executeInsertQuery(queryString, queryParameters, client, callback);
}




function addAlbum (albumTitle, artistName, client, callback) {
	selectFunctions.getArtistID(artistName, client, function(artistID){
		var queryString = "insert into albums values (DEFAULT, $1, $2)";
		var queryParameters = [albumTitle, artistID];
		executeInsertQuery(queryString, queryParameters, client, callback); 
	});	
}



function addSong(songTitle, artistName, albumName, client, callback){
	selectFunctions.getArtistID(artistName, client,function(artistID){
		selectFunctions.getAlbumID(albumName, client,function(albumID) {
			var queryString ="insert into songs values (DEFAULT, $1, $2, $3) RETURNING songid"; 
			var queryParameters = [songTitle, artistID, albumID]
			executeInsertQuery(queryString, queryParameters, client, callback)				
		});
	});
}

function addGenre(genreName, client, callback){
	var queryString = "INSERT into musicGenres values (DEFAULT, $1)";
	var queryParameters = [genreName];
	executeInsertQuery(queryString, queryParameters, client, callback);
}


function endConnection(client, query){
	query.on('end', function() {
		console.log('ending connection');
		client.end();
	});
}



function getClient(db_path, callback){
	pg.connect(db_path, function(err, client, done){
		if (err){
			console.log(err);
		}
		else{
			client.done = done; // allow for client to be passed around while allowing for client to be returned to client pool
			callback(client);
		}
	});
}


function executeInsertQuery(queryString, queryParameters, client, callback){ // insert version
	// Written to create a more modular codebase and reduce code reuse.
	var query = client.query(queryString, queryParameters,
		function(err, results) {
			if (err){
				console.log(err);
			}
			else{
				if (callback == 'done'){
					// return client to client pool
					client.done();
				}
				else{
					// pass client and query so that we can end client connection on query ending
					callback(client, query);
				}
			}
		})
}

function addUsers(users, client, callback){ 
	// For adding multiple users to database at once
	var numUsers = users.length;
	for (var i = 0; i < numUsers; i++){
		var user = users[i];
		if (i === numUsers - 1){
			addUser(user.username, user.password, user.email, client, callback)
		}
		else{
			addUser(user.username, user.password, user.email, client, "done")
		}
	}


}

function insertArtists(artists, client, callback){
	var numArtists = artists.length;
	for (var i = 0; i < numArtists; i++){
		if (i === numArtists - 1){
			addArtist(artists[i], client, callback);
		}
		else{
			addArtist(artists[i], client, "done");
		}
	}
}

function insertAlbums(albums, client, callback){
	var numAlbums = Object.keys(albums).length;
	var count = 0;
	for (var album in albums){
		var artist = albums[album];
		if (count === numAlbums - 1){
			addAlbum(album, artist, client, callback);
		}
		else{
			addAlbum(album,artist, client, "done");
		}
		count = count + 1;
	}
}

function insertSongs(songs, client, callback){
	var numSongs = songs.length;
	for (var i = 0; i < numSongs; i++){
		var song = songs[i];
		if (i === numSongs - 1){
			addSong(song.songName, song.artistName, song.albumName, client, callback);
		}
		else{
			addSong(song.songName, song.artistName, song.albumName, client, "done");
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



module.exports = {
	addUser:addUser,
	addSong: addSong,
	addArtist: addArtist,
	addAlbum: addAlbum,
	endConnection:endConnection,
	getClient:getClient,
	hashPassword:hashPassword,
	addUsers:addUsers
}




