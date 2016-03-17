var chai = require('chai');
var pg = require('pg');
var assert = chai.assert;
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var crypto = require('crypto');

var selectFunctions = require('../../src/db/select_operations');
var deleteTables = require('../../src/db/deleteTables').deleteTables;
var createTables = require('../../src/db/createTables');
var insertFunctions = require('../../src/db/insert_operations');

tables = ['ArtistGenre','users',  'musicgenres', 'songs','albums' ,'musicartists'];


describe('Create tables', function() {
	var numTables = tables.length;
	it('should create ' + numTables + ' databases', function(done) {
		insertFunctions.getClient(db_path, function(client){
			createTables.addTables(client, function(){
				selectFunctions.getAllTables(client, function(results){
					assert.equal(results.length, 6, "Expected " + numTables + " tables");
					client.end();
					done()
				});
			});
		});
	});

});

describe("Test hashing function",  function() {
	it('should compute hashed passwords properly', function(){
		var pass1 = "5BrnH+5BrnH+";
		var pass2 = "password";
		var pass3 = "__fd__";
		var pass4 = "hello world";
		var hash = insertFunctions.hashPassword;
		assert.equal(hash(pass1), '8eccf1d49f38e777c43ee8327fd23d87');
		assert.equal(hash(pass2), '5f4dcc3b5aa765d61d8327deb882cf99');
		assert.equal(hash(pass3), '145533ca3c2d0d9e504e29b17cf42a4d');
		assert.equal(hash(pass4), '5eb63bbbe01eeed093cb22bb8f5acdc3');

	});

});
describe('Insert users, songs, artists, and albums', function() {

	var users = [{username:"pcunneen", password:'5BrnH+', email:'pcunneen@nd.edu'},
				{username:"dDeBaker", password:'Banana42', email:'dDeBaker@nd.edu'}]
	var artists = ['swift', 'perry'];
	var albums = {'Red':'swift', 'Teen age dream':'perry', '22': 'swift'}
	var songs = [ {songName:"We are never gettting back together" , artistName:'swift' , albumName:'22' }, 
				{songName: 'Red', artistName:'swift' , albumName:'Red' },
				{songName: "E.T.", artistName:'perry' , albumName:"Teen age dream"  },
				{songName:"California girls" , artistName:'perry' , albumName:"Teen age dream" },
				{songName:"mean" , artistName:'swift' , albumName: "Red"},
				{songName: "fireworks", artistName: 'perry', albumName: "Teen age dream" },
				{songName:"Shake it off" , artistName:'swift' , albumName:"22" }]
	it('should insert users', function(done){
		insertFunctions.getClient(db_path, function(client){
			insertFunctions.addUsers(users, client, function(){
				selectFunctions.getAllUsers(client, function(results, query){
					assert.equal(results.length, users.length, "Should have inserted " + users.length + " users");
					done();
				})
			});
		});
	});

	it('should return matching email', function(done){
		insertFunctions.getClient(db_path, function(client){
			var user1 = users[0];
			selectFunctions.getUser(user1.username, client, function(results, query){
				query.on('end', function(){
					client.end();
				})
				assert.equal(results[0].email, user1.email, "email not equal to " + user1.email);
				done();
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

