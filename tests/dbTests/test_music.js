var chai = require('chai');
var pg = require('pg');
var assert = chai.assert;
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var async = require('async');
const util = require('util');


var userDB = "../../src/db/users/"
var createUsers  = require(userDB + 'createTables').addTables;

var addUsers = require(userDB + "insert_operations").addUsers;


var musicDB = "../../src/db/music/"
var selectFunctions = require(musicDB + 'select_operations');
var deleteTables = require(musicDB + 'deleteTables').deleteTables;
var createTables = require(musicDB + 'createTables');
var insertFunctions = require(musicDB + 'insert_operations');
var getClient = require("../../src/db/client/get_client").getClient;


var JsonMusicData = require('./jsonObjects/music_data.json');
var JsonUserData = require('./jsonObjects/user_data.json');

var tables = JsonMusicData.tables;
var artists = JsonMusicData.artists;
var albums = JsonMusicData.albums;
var numAlbums = albums.length;
var songs = JsonMusicData.songs;
var numSongs = songs.length;
userTable = ['users'];

users = JsonUserData.users;
SongLikes = JsonUserData.SongLikes;
AlbumLikes = JsonUserData.AlbumLikes;
ArtistLikes = JsonUserData.ArtistLikes;
requests = JsonMusicData.requests;
recommendations = JsonMusicData.recommendations


var allTables =  userTable.concat(tables)


describe('Create tables', function() {
	var cl;
	before(function(done){
		getClient(db_path, function(err, client){
			if (err){
				console.log(err);
				assert(0);
			}
			cl = client;
			createUsers(cl,  function(){
				addUsers(users, cl, function() {
					done();
				})
			});
		});
	});

	var numTables = tables.length;
	it(util.format('should create %d databases', numTables), function(done) {
		createTables.addTables(cl,  function(err){
			if(err){
				console.log(err);
				assert(0);
			}
			selectFunctions.getAllTables(cl, function(err, results){
				if (err){
					console.log(err);
					assert(0);
				}
				assert.equal(results.length, allTables.length, util.format("Expected %d tables", allTables.length));
				done();
			});
		});
	});

});

describe('Tests spotify API search/GET functions', function(){
	var cl;
	before(function(done){
		getClient(db_path, function(err, client){
			if (err){
				console.log(err);
				assert(0);
			}
			cl = client;
			done();
		});
	});

});

describe('Insert song, album and artist likes into music DB ', function(){
	var cl;
	before(function(done){
		getClient(db_path, function(err, client){
			if (err){
				console.log(err);
				assert(0);
			}
			cl = client;
			done();
		});
	});

		

	it ("should insert song likes into DB", function(done){
		async.eachSeries(SongLikes, function(entry, callback){
			insertFunctions.addSongLike(entry["username"], songs[entry["songTitle"]], cl, function(err) {
				if (err){
					console.log(err);
					assert(0);
				}
				callback();
			});
		}, function (err) {
			if (err) {
				console.log(err);
				assert(0);
			}
			else {
				done();
			}
		});
	});
	it ("should insert album likes into DB", function(done){
		async.eachSeries(AlbumLikes, function(entry, callback){
			insertFunctions.addAlbumLike(entry["username"], albums[entry["albumTitle"]], cl, function(err) {
				if (err){
					console.log(err);
					assert(0);
				}
				callback();
			});
		}, function (err) {
			if (err) {
				console.log(err);
				assert(0);
			}
			else {
				done();
			}
		});
	});
	it ("should insert artist likes into DB", function(done){
		async.eachSeries(ArtistLikes, function(entry, callback){
			insertFunctions.addArtistLike(entry["username"], artists[entry["artist"]], cl, function(err) {
				if (err){
					console.log(err);
					assert(0);
				}
				callback();
			});
		}, function (err) {
			if (err) {
				console.log(err);
				assert(0);
			}
			else {
				done();
			}
		});
	});

});

describe('Insert requests and recommendations into DB', function(){
	var cl;
	before(function(done){
		getClient(db_path, function(err, client){
			if (err){
				console.log(err);
				assert(0);
			}
			cl = client;
			done();
		});
	});
	it('Should insert song, album, and artist requests', function(done) {
		async.eachSeries(requests, function(request, callback){
			insertFunctions.addRequest(request, cl, function(err) {
				if (err){
					console.log(err);
					assert(0);
				}
				callback();
			});
		}, function (err) {
			if (err) {
				console.log(err);
				assert(0);
			}
			else {
				done();
			}
		});
	})
	it('Should insert song, album, and artist requests', function(done) {
		async.eachSeries(recommendations, function(rec, callback){
			insertFunctions.addRecommendation(rec, cl, function(err) {
				if (err){
					console.log(err);
					assert(0);
				}
				callback();
			});
		}, function (err) {
			if (err) {
				console.log(err);
				assert(0);
			}
			else {
				done();
			}
		});
	})

})

// describe('Select and Check for data in music DB', function(){
// 	var cl;
// 	before(function(done){
// 		getClient(db_path, function(client){
// 			cl = client;
// 			done();
// 		})
// 	})
// 	it('should return correct artist and album for several songs', function(done){
// 		async.eachSeries(songs, function(song, callback){ // passes song to assert statements
// 			selectFunctions.getSongInfo(song.songName, cl, function(result){
// 				assert.equal(result[0].artistname, song.artistName, "song name incorrect");
// 				assert.equal(result[0].albumname, song.albumName, "album name incorrect");
// 				callback();

// 			});

// 		}, function (err) {
// 			if (err) console.log(err);
// 			else {
// 				done();
// 			}
// 		});
// 	});
// 	describe("checks for user likes", function() {
// 		it('should return correct songs liked by each user', function(done){
// 			async.eachSeries(users, function(user, callback){ // passes song to assert statements
// 				var songs_to_check = [];
// 				for (var i = 0; i < userSongLikes.length; i++){
// 					if (userSongLikes[i]['username'] == user.username){
// 						songs_to_check.push(userSongLikes[i]['songTitle']);
// 					}
// 				}
// 				selectFunctions.getUserSongLikes(user.username, cl, function(returned_songs) {
// 					assert.equal(returned_songs.length, songs_to_check.length, util.format("Expected %d songs to be returned, got %d", songs_to_check.length, returned_songs.length))

// 					for (var j = 0; j < returned_songs.length; j++){
// 						if (songs_to_check.indexOf(returned_songs[j].songtitle) == -1){
// 							assert(0, util.format("returned unexpected song %s", returned_songs[j].songtitle));
// 						}
// 					}
// 					callback();
// 				})


// 			}, function (err) {
// 				if (err) console.log(err);
// 				else {
// 					done();
// 				}
// 			});
// 		});

// 		it('should return correct albums liked by each user', function(done){
// 			async.eachSeries(users, function(user, callback){ // passes song to assert statements
// 				var albums_to_check = [];
// 				for (var i = 0; i < userAlbumLikes.length; i++){
// 					if (userAlbumLikes[i]['username'] == user.username){
// 						albums_to_check.push(userAlbumLikes[i]['albumTitle']);
// 					}
// 				}
// 				// console.log(albums);
// 				selectFunctions.getUserAlbumLikes(user.username, cl, function(returned_albums) {
// 					assert.equal(returned_albums.length, albums_to_check.length, util.format("Expected %d albums to be returned, got %d", albums_to_check.length, returned_albums.length))

// 					for (var j = 0; j < returned_albums.length; j++){
// 						if (albums_to_check.indexOf(returned_albums[j]["albumname"]) == -1){
// 							assert(0, util.format("returned unexpected album %s", returned_albums[j]["albumname"]));
// 						}
// 					}
// 					callback();
// 				})


// 			}, function (err) {
// 				if (err) console.log(err);
// 				else {
// 					done();
// 				}
// 			});
// 		});

// 		it('should return correct artists liked by each user', function(done){
// 			async.eachSeries(users, function(user, callback){ // passes song to assert statements
// 				var artists_to_check = [];
// 				for (var i = 0; i < userArtistLikes.length; i++){
// 					if (userArtistLikes[i]['username'] == user.username){
// 						artists_to_check.push(userArtistLikes[i]['artist']);
// 					}
// 				}
// 				// console.log(albums);
// 				selectFunctions.getUserArtistLikes(user.username, cl, function(returned_artists) {
// 					assert.equal(returned_artists.length, artists_to_check.length, util.format("Expected %d albums to be returned, got %d", artists_to_check.length, returned_artists.length))

// 					for (var j = 0; j < returned_artists.length; j++){
// 						if (artists_to_check.indexOf(returned_artists[j]["artistname"]) == -1){
// 							console.log("returned artists ...");
// 							console.log(returned_artists);

// 							console.log("\n\nExpected artists");
// 							console.log(artists_to_check);
// 							assert(0, util.format("returned unexpected artist %s", returned_artists[j]["artistname"]));
// 						}
// 					}
// 					callback();
// 				});


// 			}, function (err) {
// 				if (err) console.log(err);
// 				else {
// 					done();
// 				}
// 			});
// 		});

// 		it('should return correct genres liked by each user', function(done){
// 			async.eachSeries(users, function(user, callback){ // passes song to assert statements
// 				var genres_to_check = [];
// 				for (var i = 0; i < userGenreLikes.length; i++){
// 					if (userGenreLikes[i]['username'] == user.username){
// 						genres_to_check.push(userGenreLikes[i]['genreTitle']);
// 					}
// 				}
// 				selectFunctions.getUserGenreLikes(user.username, cl, function(returned_genres) {
// 					assert.equal(returned_genres.length, genres_to_check.length, util.format("Expected %d albums to be returned, got %d", genres_to_check.length, returned_genres.length))

// 					for (var j = 0; j < returned_genres.length; j++){
// 						if (genres_to_check.indexOf(returned_genres[j]["genrename"]) == -1){

// 							assert(0, util.format("returned unexpected genre %s", returned_genres[j]["genrename"]));
// 						}
// 					}
// 					callback();
// 				});


// 			}, function (err) {
// 				if (err) console.log(err);
// 				else {
// 					done();
// 				}
// 			});
// 		});
// 	});
// });


// describe("Delete all tables", function(){ // keep as last test to delete tables
// 	it('should remove all tables from test database', function(done){
// 		getClient(db_path, function(err, client){
// 			if (err){
	
// 				console.log(err);
// 				assert(0);
// 			}
// 			deleteTables(client, allTables, function(err, client){
// 				if (err){
// 					console.log(err);
// 					assert(0);
// 				}
// 				selectFunctions.getAllTables(client, function(err, results){
// 					if (err){
// 						console.log(err);
// 						assert(0);
// 					}
// 					assert.equal(results.length, 0, "Expected 0 tables");
// 					client.end();
// 					done();
// 				});
// 			});
// 		});
// 	});
// });
