

var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var queryFunctions = require('../queries/execute_queries');
var selectFunctions = require('./select_operations');
var executeInsertQuery = queryFunctions.executeInsertQuery;
var getClient = require("../client/get_client").getClient;

var getUser = require("../users/select_operations").getUser;



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
			var queryParameters = [songTitle, artistID, albumID];
			executeInsertQuery(queryString, queryParameters, client, callback);
		});
	});
}

function addGenre(genreName, client, callback){
	var queryString = "INSERT into musicGenres values (DEFAULT, $1)";
	var queryParameters = [genreName];
	executeInsertQuery(queryString, queryParameters, client, callback);
}

function addArtistGenrePair(genreName, artistName, client, callback){
	selectFunctions.getArtistID(artistName, client, function(artistID){
		selectFunctions.getGenreID(genreName, client, function(genreID){
			var queryString = "INSERT into artistgenre values ($1 ,$2)";
			var queryParameters = [genreID, artistID];
			executeInsertQuery(queryString, queryParameters, client, callback);
		});

	});
}

function addUserSongLike(username, songTitle, client, callback){
	getUser(username, client, function(userData) {
		selectFunctions.getSongID(songTitle, client, function(songID){
			queryString = "INSERT into UserSongLikes values ($1, $2)";
			queryParameters = [userData.id, songID];
			executeInsertQuery(queryString, queryParameters, client, callback);
		});
	});
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
	var numAlbums = albums.length;
	for (var i = 0; i < numAlbums; i++){
		var album = albums[i];
		var artist = album["artistName"];
		var album = album["albumName"]
		if (i === numAlbums - 1){
			addAlbum(album, artist, client, callback);
		}
		else{
			addAlbum(album,artist, client, "done");
		}
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

function insertGenres(genres, client, callback){
	var numGenres = genres.length;
	for (var i = 0; i < numGenres; i++){
		if (i === numGenres - 1){
			addGenre(genres[i], client, callback);
		}
		else{
			addGenre(genres[i], client, "done");
		}
	}
}

function insertArtistGenrePairs(genreArtistPairs, client, callback){
	var numGenrePairs = genreArtistPairs.length;
	for (var i = 0; i < numGenrePairs; i++){
		var genre = genreArtistPairs[i].genre;
		var artist = genreArtistPairs[i].artist;
		if (i === numGenrePairs - 1){
			addArtistGenrePair(genre, artist,client, callback);
		}
		else{
			addArtistGenrePair(genre, artist,client, "done");
		}

	}
}



module.exports = {
	insertArtists:insertArtists,
	insertSongs:insertSongs,
	insertAlbums:insertAlbums,
	insertGenres:insertGenres,
	insertArtistGenrePairs:insertArtistGenrePairs

};
