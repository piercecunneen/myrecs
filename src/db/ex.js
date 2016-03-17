var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var insertOperations = require('./insert_operations.js');









function insertArtists(artistNames){
	for (var i = 0; i < artistNames.length; i++){
		insertOperations.addArtist(artistNames[i]);
	}

}

function insertAlbums(albumsAndArtists){
	for (var album in albumsAndArtists) {
		insertOperations.addAlbum(album, albumsAndArtists[album]);
	}
}

function insertSongs(songs){
	for (var i = 0; i < songs.length; i++){
		console.log(songs[i].songName);
		insertOperations.addSong(songs[i].songName, songs[i].artistName, songs[i].albumName, function(client){
			client.end()
		});
	}

}

var artists = ['swift', 'perry'];
var albums = {'Red':'swift', 'Teen age dream':'perry', '22': 'swift'}
var songs = [ {songName:"We are never gettting back together" , artistName:'swift' , albumName:'22' }, 
			{songName: 'Red', artistName:'swift' , albumName:'Red' },
			{songName: "E.T.", artistName:'perry' , albumName:"Teen age dream"  },
			{songName:"California girls" , artistName:'perry' , albumName:"Teen age dream" },
			{songName:"mean" , artistName:'swift' , albumName: "Red"},
			{songName: "fireworks", artistName: 'perry', albumName: "Teen age dream" },
			{songName:"Shake it off" , artistName:'swift' , albumName:"22" },
			]


insertArtists(artists);
insertAlbums(albums);
insertSongs(songs);















