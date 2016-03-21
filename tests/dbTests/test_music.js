var chai = require('chai');
var pg = require('pg');
var assert = chai.assert;
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var async = require('async');

var musicDB = "../../src/db/music/"
var selectFunctions = require(musicDB + 'select_operations');
var deleteTables = require(musicDB + 'deleteTables').deleteTables;
var createTables = require(musicDB + 'createTables');
var insertFunctions = require(musicDB + 'insert_operations');
var getClient = require("../../src/db/client/get_client").getClient;



tables = ['ArtistGenre', 'musicgenres', 'songs','albums' ,'musicartists'];
var artists = ['swift', 'perry', 'Rihanna', 'Beyonce'];
var albums = {'Red':'swift', 'Teen age dream':'perry', '22': 'swift' ,'Loud':'Rihanna', 'Dangerously in Love':'Beyonce', 'Good girl gone bad': 'Rihanna'}
var numAlbums = Object.keys(albums).length;
var songs = [ {songName:"Disturbia" , artistName:'Rihanna' , albumName:'Good girl gone bad' },
			{songName: 'S&M', artistName:'Rihanna' , albumName:'Loud' },
			{songName: "If I were a boy", artistName:'Beyonce' , albumName:"Dangerously in Love"  },
			{songName:"Halo" , artistName:'Beyonce' , albumName:"Dangerously in Love" },
			{songName:"Diamonds" , artistName:'Rihanna' , albumName: "Loud"},
			{songName: "Listen", artistName: 'Beyonce', albumName: "Dangerously in Love" },
			{songName:"Work" , artistName:'Rihanna' , albumName:"Good girl gone bad" },
			{songName:"We are never gettting back together" , artistName:'swift' , albumName:'22' },
			{songName: 'Red', artistName:'swift' , albumName:'Red' },
			{songName: "E.T.", artistName:'perry' , albumName:"Teen age dream"  },
			{songName:"California girls" , artistName:'perry' , albumName:"Teen age dream" },
			{songName:"mean" , artistName:'swift' , albumName: "Red"},
			{songName: "fireworks", artistName: 'perry', albumName: "Teen age dream" },
			{songName:"Shake it off" , artistName:'swift' , albumName:"22" }];
var numSongs = songs.length;

describe('Create tables', function() {
	var numTables = tables.length;
	it('should create ' + numTables + ' databases', function(done) {
		getClient(db_path, function(client){
			createTables.addTables(client, function(){
				selectFunctions.getAllTables(client, function(results){
					assert.equal(results.length, numTables, "Expected " + numTables + " tables");
					done()
				});
			});
		});
	});

});

describe('Insert artists, albums, songs, and music genres into music DB ', function() {

	var genres = ["Pop", "Rap", "HipHop", "R&B", "Country"]
	it("should insert artists into table", function(done){
		getClient(db_path, function(client){
			insertFunctions.insertArtists(artists, client, function(){
				selectFunctions.getAllArtists(client, function(results){
					assert.equal(results.length, artists.length, "Expected " + artists.length + " artists");
					done()

				});
			});
		});
	});
	it("should insert albums into table", function(done){
		getClient(db_path, function(client){
			insertFunctions.insertAlbums(albums, client, function(){
				selectFunctions.getAllAlbums(client, function(results){
					assert.equal(results.length, numAlbums, "Expected " + numAlbums + " artists");
					done()
				});
			});
		});
	});
	it("should insert songs into table", function(done){
		getClient(db_path, function(client){
			insertFunctions.insertSongs(songs, client, function(){
				selectFunctions.getAllSongs(client, function(results){
					assert.equal(results.length, numSongs, "Expected " + numSongs + " artists");
					done()
				});
			});
		});
	});
	it("should insert genres into table",function(done){
		getClient(db_path, function(client){
			insertFunctions.insertGenres(genres, client, function(){
				selectFunctions.getAllGenres(client, function(results){
					assert.equal(results.length, genres.length, "Expected " + genres.length + " artists");
					done()
				});
			});
		});
	});
});

describe('Select and Check for data in music DB', function(){
	it('should return correct artist and album for several songs', function(done){
		getClient(db_path, function(client){
			async.eachSeries(songs, function(song, callback){ // passes song to assert statements
				selectFunctions.getSongInfo(song.songName, client, function(result){
					assert.equal(result[0].artistname, song.artistName, "song name incorrect");
					assert.equal(result[0].albumname, song.albumName, "album name incorrect");
					callback();
				});
			}, function (err){ // called after to finish it block
				if (err) console.log(err);
				done();
			});
		})
	})
})




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
