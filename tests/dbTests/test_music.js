var chai = require('chai');
var pg = require('pg');
var assert = chai.assert;
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';

var musicDB = "../../src/db/music/"
var selectFunctions = require(musicDB + 'select_operations');
var deleteTables = require(musicDB + 'deleteTables').deleteTables;
var createTables = require(musicDB + 'createTables');
var insertFunctions = require(musicDB + 'insert_operations');



tables = ['ArtistGenre', 'musicgenres', 'songs','albums' ,'musicartists'];


describe('Create tables', function() {
	var numTables = tables.length;
	it('should create ' + numTables + ' databases', function(done) {
		insertFunctions.getClient(db_path, function(client){
			createTables.addTables(client, function(){
				selectFunctions.getAllTables(client, function(results){
					assert.equal(results.length, numTables, "Expected " + numTables + " tables");
					done()
				});
			});
		});
	});

});

describe('Insert artists, albums, and songs ', function() {
	var artists = ['swift', 'perry'];
	var albums = {'Red':'swift', 'Teen age dream':'perry', '22': 'swift'}
	var numAlbums = Object.keys(albums).length;
	var songs = [ {songName:"We are never gettting back together" , artistName:'swift' , albumName:'22' },
				{songName: 'Red', artistName:'swift' , albumName:'Red' },
				{songName: "E.T.", artistName:'perry' , albumName:"Teen age dream"  },
				{songName:"California girls" , artistName:'perry' , albumName:"Teen age dream" },
				{songName:"mean" , artistName:'swift' , albumName: "Red"},
				{songName: "fireworks", artistName: 'perry', albumName: "Teen age dream" },
				{songName:"Shake it off" , artistName:'swift' , albumName:"22" }]
	it("should insert artists into table", function(done){
		insertFunctions.getClient(db_path, function(client){
			insertFunctions.insertArtists(artists, client, function(){
				selectFunctions.getAllArtists(client, function(results){
					assert.equal(results.length, artists.length, "Expected " + artists.length + " artists");
					done()

				});
			});
		});
	});
	it("should insert albums into table", function(done){
		insertFunctions.getClient(db_path, function(client){			
			insertFunctions.insertAlbums(albums, client, function(){
				selectFunctions.getAllAlbums(client, function(results, query){
					assert.equal(results.length, numAlbums, "Expected " + numAlbums + " artists");

					done()
				});
			});
		});
	});



});





describe("Delete all tables", function(){ // keep as last test to delete tables
	it('should remove all tables from test database', function(done){
		insertFunctions.getClient(db_path, function(client){
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
