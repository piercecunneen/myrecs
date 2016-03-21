var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var queryFunctions = require('../queries/execute_queries')


var exectuteSelect = queryFunctions.exectuteSelect;


function getAllTables(client, callback){
	var queryString = "select table_name from information_schema.tables where table_schema='public' and table_type = 'BASE TABLE'"
	var params = [];
	exectuteSelect(queryString, params, client, callback);
}


function getAlbumsByArtist(artistName, client, callback){

	getArtistID(artistName, client, function(artistID){
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
	getArtistID(artistName, client, function(artistID) {
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
	exectuteSelect(queryString, params, client, function(results){
		callback(results, songName);
	});
}


function getSongsOnAlbum(albumName, client, callback) {
	var queryString = "SELECT songs.songTitle from albums INNER JOIN songs on songs.albumID = albums.albumID and albums.albumName = $1";
	var params = [albumName];
	exectuteSelect(queryString, params, client, callback);

}

function getArtistID(artistName, client, callback){
	var query = "select artistID from musicArtists where artistName = $1";
	var queryParameters = [artistName];
	exectuteSelect(query, queryParameters, client, function(rows){
		callback(rows[0].artistid);
	});
}

function getAlbumID(artistName,client, callback){
	var query = client.query(
		"select albumID from albums where albumName = $1", [artistName]
		, function (err, results){
			if (err){
				console.log(err);
			}
			else{
				callback(results.rows[0].albumid);
			}
		}
		);
}

function getAllArtists(client, callback){
	var query = "select artistName from musicArtists"
	var queryParameters = [];
	exectuteSelect(query, queryParameters, client, callback);
}

function getAllAlbums(client, callback){
	var query = "select albumName from albums"
	var queryParameters = [];
	exectuteSelect(query, queryParameters, client, callback);
}

function getAllSongs(client, callback){
	var query = "select songTitle from songs"
	var queryParameters = [];
	exectuteSelect(query, queryParameters, client, callback);
}

function getAllGenres(client, callback){
	var query = "select genreName from musicGenres"
	var queryParameters = [];
	exectuteSelect(query, queryParameters, client, callback); 
}




module.exports = {
	getAllTables:getAllTables,
	getAlbumID: getAlbumID,
	getArtistID:getArtistID,
	getSongsByArtist:getSongsByArtist,
	getAlbumsByArtist:getAlbumsByArtist,
	getSongInfo:getSongInfo,
	getSongsOnAlbum:getSongsOnAlbum,
	getAllArtists:getAllArtists,
	getAllAlbums:getAllAlbums,
	getAllSongs:getAllSongs,
	getAllGenres:getAllGenres
}







