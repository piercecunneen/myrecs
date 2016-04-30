var chai = require('chai');
var pg = require('pg');
var assert = chai.assert;
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var async = require('async');
const util = require('util');


var userDB = "../../src/db/users/"
var createUserDB  = require(userDB + 'createTables');


var musicDB = "../../src/db/music/"
var selectFunctions = require(musicDB + 'select_operations');
var deleteTables = require(musicDB + 'deleteTables').deleteTables;
var createTables = require(musicDB + 'createTables');
var insertFunctions = require(musicDB + 'insert_operations');
var getClient = require("../../src/db/client/get_client").getClient;


var JsonMusicData = require('./jsonObjects/music_data.json');

var tables = JsonMusicData.tables;
var artists = JsonMusicData.artists;
var albums = JsonMusicData.albums;
var numAlbums = albums.length;
var songs = JsonMusicData.songs;
var numSongs = songs.length;
var genres = JsonMusicData.genres;
var genreArtistPairs = JsonMusicData["genre-artist"];
userTable = ['users'];

var allTables =  userTable.concat(tables)


describe('Create tables', function() {
	var cl;
	before(function(done){
		getClient(db_path, function(client){
			cl = client;
			createUserDB.addTables(cl,  function(){
				done();
			});



		});
	});

	var numTables = tables.length;
	it(util.format('should create %d databases'), function(done) {
		createTables.addTables(cl,  function(){
			selectFunctions.getAllTables(cl, function(results){
				assert.equal(results.length, allTables.length, util.format("Expected %d tables", allTables.length));
				done();
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
	it("should insert artists into table", function(done){
		insertFunctions.insertArtists(artists, cl, function(){
			selectFunctions.getAllArtists(cl, function(results){
				assert.equal(results.length, artists.length, util.format("Expected %d artists", artists.length));
				done();
			});
		});
	});
	it("should insert albums into table", function(done){
		insertFunctions.insertAlbums(albums, cl, function(){
			selectFunctions.getAllAlbums(cl, function(results){
				assert.equal(results.length, numAlbums, util.format("Expected %d numAlbums", numAlbums));
				done();
			});
		});
	});
	it("should insert songs into table", function(done){
		insertFunctions.insertSongs(songs, cl, function(){
			selectFunctions.getAllSongs(cl, function(results){
				// console.log("SONGS");
				assert.equal(results.length, numSongs, util.format("Expected %d artists",numSongs));
				done()
			});
		});
	});
	it("should insert genres into table",function(done){
		insertFunctions.insertGenres(genres, cl, function(){
			selectFunctions.getAllGenres(cl, function(results){
				assert.equal(results.length, genres.length, util.format("Expected %d artsits",genres.length));
				done();
			});
		});
	});
	it("should insert genre-artist pairs", function(done){
		insertFunctions.insertArtistGenrePairs(genreArtistPairs, cl, function(){
			selectFunctions.getAllArtistGenres(cl, function(results){
				assert.equal(results.length, results.length, util.format("Expected %d artist genre pairs",genreArtistPairs.length ));
				done();
			});
		});
	});
	// it("should insert songs that users liked into UserSongLikes table ", function(done){
	// 	async.eachSeries()
	// });
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
	it('should remove al=l tables from test database', function(done){
		getClient(db_path, function(client){
			deleteTables(client, allTables, function(client){
				selectFunctions.getAllTables(client, function(results){
					assert.equal(results.length, 0, "Expected 0 tables");
					client.end();
					done();
				});
			});
		});
	});
});
