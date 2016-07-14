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

  it('should insert song, album, and artist recommendations', function(done){
    async.eachSeries(recommendations, function(rec, callback){
      insertFunctions.addRecommendation(rec, cl, function(err){
        if (err){
          console.log(err);
          assert(0);
        }

        callback();
      });
    }, function(err){
      if (err){
        console.log(err);
        assert(0);
      }
      else{
        done();
      }
    });
  });




})

describe('Select and check music requests and recommendations', function(){
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
  it('should get user song requests', function(done){
    var data = {'username': "pcunneen", "type": "song", "isFufilled": 'f', "genre": null, "spotifyArtistID": null, "similarToSongSpotifyID": null};

    selectFunctions.getUserRequests(data, cl, function(err, results){
      if (err){
        console.log(err);
        assert(0);
      }
      else{
        for (var i = 0; i < results.length; i++){
          console.log(results[i]);
          console.log("\n\n\n");
        }
      }
      done();
    })
  });

  it('should get user artist requests ', function(done){
    var data = {'fromUsername': "pcunneen", "toUsername": "Zjanicki", "type": "album"};
    selectFunctions.getUserRecommendations(data, cl, function(err, results){
      if (err){
        console.log(err);
        assert(0);
      }
      else{
        for (var i = 0; i < results.length; i++){
          console.log(results[i]);
          console.log("\n\n\n");
        }
      }
      done();
    })
  })
})

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
