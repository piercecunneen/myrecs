

var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var queryFunctions = require('../queries/execute_queries');
var selectFunctions = require('./select_operations');
var executeInsertQuery = queryFunctions.executeInsertQuery;
var getClient = require("../client/get_client").getClient;





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


function endConnection(client, query){
	query.on('end', function() {
		console.log('ending connection');
		client.end();
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
var albums = {'Loud':'swift', 'Dangerously in Love':'perry', 'Good girl gone bad': 'swift'};
var songs = [ {songName:"Disturbia" , artistName:'Rihanna' , albumName:'Good girl gone bad' }, 
			{songName: 'S&M', artistName:'Rihanna' , albumName:'Loud' },
			{songName: "If I were a boy", artistName:'Beyonce' , albumName:"Dangerously in Love"  },
			{songName:"Halo" , artistName:'Beyonce' , albumName:"Dangerously in Love" },
			{songName:"Diamonds" , artistName:'Rihanna' , albumName: "Loud"},
			{songName: "Listen", artistName: 'Beyonce', albumName: "Dangerously in Love" },
			{songName:"Work" , artistName:'Rihanna' , albumName:"Good girl gone bad" },
			];

// getClient(db_path, function(client){
// 	insertAlbums(albums, client, endConnection);
// })

module.exports = {
	insertArtists:insertArtists,
	insertSongs:insertSongs,
	insertAlbums:insertAlbums

};




