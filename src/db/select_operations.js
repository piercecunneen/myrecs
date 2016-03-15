var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var insertFunctions = require('./insert_operations');

function getAlbumsByArtist(artistName, client, callback){

	insertFunctions.getArtistID(artistName, client, function(artistID){
		if (artistID == "None"){
			callback("None");

		}
		else{
			var queryString = 'SELECT albums.albumName from albums INNER JOIN musicArtists ON musicArtists.artistid = albums.artistID AND musicArtists.artistid = $1';
			var params = [artistID];
			exectuteSelect(queryString, params, client, callback);
		}
	});
}

function getSongsByArtist(artistName, client, callback){
	insertFunctions.getArtistID(artistName, client, function(artistID) {
		if (artistID == "None"){
			callback("None");
		}
		else{
			var queryString = "SELECT songs.songTitle, albums.albumName from songs INNER JOIN albums ON songs.albumID = albums.albumID and songs.artistID = $1 ";
			var params = [artistID];
			exectuteSelect(queryString, params, client, callback);
		}
	});
}

function getSongInfo(songName, client, callback){
	var queryString = "SELECT albums.albumName, musicArtists.artistName, musicArtists.artistID, albums.albumID from songs INNER JOIN musicArtists on songs.artistID = musicArtists.artistID JOIN albums on albums.albumID = songs.albumID WHERE songs.songTitle = $1";
	var params = [songName];
	exectuteSelect(queryString, params, client, callback);
}


function getSongsOnAlbum(albumName, client, callback) {
	var queryString = "SELECT songs.songTitle from albums INNER JOIN songs on songs.albumID = albums.albumID and albums.albumName = $1";
	var params = [albumName];
	exectuteSelect(queryString, params, client, callback);

}



function exectuteSelect(queryString, params, client, callback){
	client.query(queryString, params, 
		function(err, results){
			if (err){
				console.log(err);
			}
			else{
				callback(results.rows)
			}
	});

}

// var client = insertFunctions.getClient(db_path);
// getAlbumsByArtist('swifft', client, console.log);
// getSongsByArtist('per
// 	ry', client, function(results){
// 	console.log(results);
// 	client.end();

// });

var client = insertFunctions.getClient(db_path);
getSongInfo("Halo", client, function(results) {
	console.log(results);
	client.end();
})

// getSongInfo('Halo',client, function(results){
// 	console.log(results);
// 	client.end();
// } )


