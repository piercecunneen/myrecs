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

function exectuteSelect(queryString, params, client, callback){
	client.query(queryString, params, 
		function(err, results){
			if (err){
				console.log(err);
			}
			else{
				callback(results.rows)
			}
	})

}

var client = insertFunctions.getClient(db_path);
// getAlbumsByArtist('swifft', client, console.log);
getSongsByArtist('perfry', client, function(results){
	console.log(results);
	client.end();

});



