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
userSongLikes = JsonUserData.userSongLikes;
userAlbumLikes = JsonUserData.userAlbumLikes;
userArtistLikes = JsonUserData.userArtistLikes;
userGenreLikes = JsonUserData.userGenreLikes;


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

describe('Tests spotify API search/GET functions', function
	(){
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

// describe('Insert artists, albums, songs, and music genres into music DB ', function() {
// 	var cl;
// 	before(function(done){
// 		getClient(db_path, function(client){
// 			cl = client;
// 			done();
// 		})
// 	})
// 	it("should insert artists into table", function(done){
// 		insertFunctions.insertArtists(artists, cl, function(){
// 			selectFunctions.getAllArtists(cl, function(results){
// 				assert.equal(results.length, artists.length, util.format("Expected %d artists", artists.length));
// 				done();
// 			});
// 		});
// 	});
// 	it("should insert albums into table", function(done){
// 		insertFunctions.insertAlbums(albums, cl, function(){
// 			selectFunctions.getAllAlbums(cl, function(results){
// 				assert.equal(results.length, numAlbums, util.format("Expected %d numAlbums", numAlbums));
// 				done();
// 			});
// 		});
// 	});
// 	it("should insert songs into table", function(done){
// 		insertFunctions.insertSongs(songs, cl, function(){
// 			selectFunctions.getAllSongs(cl, function(results){
// 				// console.log("SONGS");
// 				assert.equal(results.length, numSongs, util.format("Expected %d artists",numSongs));
// 				done()
// 			});
// 		});
// 	});
// 	it("should insert genres into table",function(done){
// 		insertFunctions.insertGenres(genres, cl, function(){
// 			selectFunctions.getAllGenres(cl, function(results){
// 				assert.equal(results.length, genres.length, util.format("Expected %d genres",genres.length));
// 				done();
// 			});
// 		});
// 	});
// 	it("should insert genre-artist pairs", function(done){
// 		insertFunctions.insertArtistGenrePairs(genreArtistPairs, cl, function(){
// 			selectFunctions.getAllArtistGenres(cl, function(results){
// 				assert.equal(results.length, results.length, util.format("Expected %d artist genre pairs",genreArtistPairs.length ));
// 				done();
// 			});
// 		});
// 	});
// 	it("should insert songs that users liked into UserSongLikes table ", function(done){
// 		async.eachSeries(userSongLikes, function(entry, callback){
// 			insertFunctions.addUserSongLike(entry.username, entry.songTitle, cl,function(){
// 				callback();
// 			});
// 		}, function (err) {
// 			if (err) console.log(err);
// 			else {
// 				done();
// 			}
// 		});
// 	});
// 	it("should insert album that users liked into UserAlbumLikes table ", function(done){
// 		async.eachSeries(userAlbumLikes, function(entry, callback){
// 			insertFunctions.addUserAlbumLike(entry.username, entry.albumTitle, cl,function(){
// 				callback();
// 			});
// 		}, function (err) {
// 			if (err) console.log(err);
// 			else {
// 				done();
// 			}
// 		});
// 	});
// 	it("should insert genres that users liked into UserGenreLikes table ", function(done){
// 		async.eachSeries(userGenreLikes, function(entry, callback){
// 			insertFunctions.addUserGenreLike(entry.username, entry.genreTitle, cl,function(){
// 				callback();
// 			});
// 		}, function (err) {
// 			if (err) console.log(err);
// 			else {
// 				done();
// 			}
// 		});
// 	});
// 	it("should insert artist that users liked into UserArtistLikes table ", function(done){
// 		async.eachSeries(userArtistLikes, function(entry, callback){
// 			insertFunctions.addUserArtistLike(entry.username, entry.artist, cl,function(){
// 				callback();
// 			});
// 		}, function (err) {
// 			if (err) console.log(err);
// 			else {
// 				done();
// 			}
// 		});
// 	});
// });

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


describe("Delete all tables", function(){ // keep as last test to delete tables
	it('should remove all tables from test database', function(done){
		getClient(db_path, function(err, client){
			if (err){
	
				console.log(err);
				assert(0);
			}
			deleteTables(client, allTables, function(err, client){
				if (err){
					console.log(err);
					assert(0);
				}
				selectFunctions.getAllTables(client, function(err, results){
					if (err){
						console.log(err);
						assert(0);
					}
					assert.equal(results.length, 0, "Expected 0 tables");
					client.end();
					done();
				});
			});
		});
	});
});
