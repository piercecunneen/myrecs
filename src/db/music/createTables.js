var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var queryFunctions = require('../queries/execute_queries')
const util = require('util');

var executeCreateDBQuery = queryFunctions.executeCreateDBQuery;


function addTables(client, callback){
  createSongLikesDB(client, "done");
  createArtistLikesDB(client, "done");
  createAlbumLikesDB(client, "done");
  createRequestsDB(client, "done");
  createSongRequestDB(client, "done");
  createAlbumRequestDB(client, "done");
  createArtistRequestDB(client, "done");
  createRecommendationDB(client, "done");
  createSongRecommendationDB(client, "done");
  createArtistRecommendationDB(client, "done");
  createAlbumRecommendationDB(client, callback);

}


function createSongLikesDB(client, callback){
  var table = "songLikes";
  var queryString = util.format("CREATE TABLE %s (spotifySongID VARCHAR(30) not null, userID int REFERENCES users (id), date_of_like date )", table);
  var params = [];
  executeCreateDBQuery(queryString, params, client, callback);
}

function createArtistLikesDB(client, callback){
  var table = "artistLikes";
  var queryString = util.format("CREATE TABLE %s (spotifyArtistID VARCHAR(30) not null, userID int REFERENCES users (id), date_of_like date )", table);
  var params = [];
  executeCreateDBQuery(queryString, params, client, callback);
}

function createAlbumLikesDB(client, callback){
  var table = "albumLikes";
  var queryString = util.format("CREATE TABLE %s (spotifyAlbumID VARCHAR(30) not null, userID int REFERENCES users (id), date_of_like date )", table);
  var params = [];
  executeCreateDBQuery(queryString, params, client, callback);
}


function createRequestsDB(client, callback){
  var table = "RequestsMain";
  var queryString = util.format("CREATE TABLE %s (requestID SERIAL PRIMARY KEY,fromUserID int REFERENCES users (id), toUserID int REFERENCES users (id), itemType VARCHAR(20), isFufilled Boolean, dateOfRequest date)", table);
  var params = [];
  executeCreateDBQuery(queryString, params, client, callback);
}


function createSongRequestDB(client, callback){
  var table = "songRequests";
  var queryString = util.format("CREATE TABLE %s (requestID int REFERENCES RequestsMain (requestID), genre VARCHAR(20), spotifyArtistID VARCHAR(30), similarToSongSpotifyID VARCHAR(30)  )", table);
  var params = [];
  executeCreateDBQuery(queryString, params, client, callback);
}

function createArtistRequestDB(client, callback){
  var table = "artistRequests";
  var queryString = util.format("CREATE TABLE %s (requestID int REFERENCES RequestsMain (requestID), genre VARCHAR(20), similarToArtistSpotifyID VARCHAR (30) )", table);
  var params = [];
  executeCreateDBQuery(queryString, params, client, callback);
}
function createAlbumRequestDB(client, callback){
  var table = "albumRequests";
  var queryString = util.format("CREATE TABLE %s (requestID int REFERENCES RequestsMain (requestID),  genre VARCHAR(20), spotifyArtistID VARCHAR(30),  similarToAlbumSpotifyID VARCHAR(30))", table);
  var params = [];
  executeCreateDBQuery(queryString, params, client, callback);
}


function createRecommendationDB(client, callback){
  var table = "RecommendationsMain";
  var queryString = util.format("CREATE TABLE %s (recommendationID SERIAL PRIMARY KEY, fromUserID int REFERENCES users (id), toUserID int REFERENCES users (id), itemType VARCHAR (20), dateOfRecommendation date)", table);
  var params = [];
  executeCreateDBQuery(queryString, params, client, callback);
}

function createSongRecommendationDB(client, callback){
  var table = "songRecommendations";
  var queryString = util.format("CREATE TABLE %s (recommendationID int REFERENCES RecommendationsMain (recommendationID), spotifySongID VARCHAR(30) )", table);
  var params = [];
  executeCreateDBQuery(queryString, params, client, callback);
}

function createArtistRecommendationDB(client, callback){
  var table = "ArtistRecommendations";
  var queryString = util.format("CREATE TABLE %s (recommendationID int REFERENCES RecommendationsMain (recommendationID), spotifyArtistID VARCHAR(30) )", table);
  var params = [];
  executeCreateDBQuery(queryString, params, client, callback);
}

function createAlbumRecommendationDB(client, callback){
  var table = "AlbumRecommendations";
  var queryString = util.format("CREATE TABLE %s (recommendationID int REFERENCES RecommendationsMain (recommendationID), spotifyAlbumID VARCHAR(30) )", table);
  var params = [];
  executeCreateDBQuery(queryString, params, client, callback);
}




module.exports = {
  addTables:addTables
}
