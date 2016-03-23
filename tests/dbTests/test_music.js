var chai = require('chai');
var pg = require('pg');
var assert = chai.assert;
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var async = require('async');
var JsonMusicData = require('./jsonObjects/music_data.json');




var musicDB = "../../src/db/music/"
var selectFunctions = require(musicDB + 'select_operations');
var deleteTables = require(musicDB + 'deleteTables').deleteTables;
var createTables = require(musicDB + 'createTables');
var insertFunctions = require(musicDB + 'insert_operations');
var getClient = require("../../src/db/client/get_client").getClient;



var tables = JsonMusicData.tables;
var artists = JsonMusicData.artists;
var albums = JsonMusicData.albums;
var numAlbums = albums.length;
var songs = JsonMusicData.songs;
var numSongs = songs.length;
var genres = JsonMusicData.genres;
var genreArtistPairs = JsonMusicData["genre-artist"];

describe('Create tables', function() {
	var numTables = tables.length;
	it('should create ' + numTables + ' databases', function(done) {
		getClient(db_path, function(client){
			createTables.addTables(client,  function(){
				selectFunctions.getAllTables(client, function(results){
					assert.equal(results.length, numTables, "Expected " + numTables + " tables");
					done()
				});
			});
		});
	});

});

describe('Insert artists, albums, songs, and music genres into music DB ', function() {
	var cl;
	before(function(done){
		getClient(db_path, function(client){
			cl = client;
			done();
		})
	})
	it("should insert artists into table", function(){
		insertFunctions.insertArtists(artists, cl, function(){
			selectFunctions.getAllArtists(cl, function(results){
				assert.equal(results.length, artists.length, "Expected " + artists.length + " artists");
			});
		});
	});
	it("should insert albums into table", function(done){
		insertFunctions.insertAlbums(albums, cl, function(){
			selectFunctions.getAllAlbums(cl, function(results){
				assert.equal(results.length, numAlbums, "Expected " + numAlbums + " artists");
				done();
			});
		});
	});
	it("should insert songs into table", function(done){
		insertFunctions.insertSongs(songs, cl, function(){
			selectFunctions.getAllSongs(cl, function(results){
				// console.log("SONGS");
				assert.equal(results.length, numSongs, "Expected " + numSongs + " artists");
				done()
			});
		});
	});
	it("should insert genres into table",function(done){
		insertFunctions.insertGenres(genres, cl, function(){
			selectFunctions.getAllGenres(cl, function(results){
				assert.equal(results.length, genres.length, "Expected " + genres.length + " artists");
				done();
			});
		});
	});
	it("should insert genre-artist pairs", function(done){
		insertFunctions.insertArtistGenrePairs(genreArtistPairs, cl, function(){
			selectFunctions.getAllArtistGenres(cl, function(results){
				assert.equal(results.length, results.length, "Expected " +  genreArtistPairs.length + " artist genre pairs");
				done();
			});
		})
	})
});

describe('Select and Check for data in music DB', function(){
	var cl;
	before(function(done){
		getClient(db_path, function(client){
			cl = client;
			done();
		})
	})
	it('should return correct artist and album for several songs', function(done){
		async.eachSeries(songs, function(song, callback){ // passes song to assert statements
			selectFunctions.getSongInfo(song.songName, cl, function(result){
				assert.equal(result[0].artistname, song.artistName, "song name incorrect");
				assert.equal(result[0].albumname, song.albumName, "album name incorrect");
				callback();
			});

		}, function (err){ // called after to finish 'it' block
			if (err) console.log(err);
			done();
		});

	});

});


describe("Delete all tables", function(){ // keep as last test to delete tables
	it('should remove all tables from test database', function(done){
		getClient(db_path, function(client){
			deleteTables(client, tables, function(client){
				selectFunctions.getAllTables(client, function(results){
					assert.equal(results.length, 0, "Expected 0 tables");
					client.end();
					done()
				});
			});
		});
	});
});
