var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var queryFunctions = require('../queries/execute_queries');
var selectFunctions = require('./select_operations');
var executeInsertQuery = queryFunctions.executeInsertQuery;
var getClient = require("../client/get_client").getClient;
var getUser = require("../users/select_operations").getUser;

function addSongLike(username, spotifySongID, client, callback){
  getUser(username, client, function(err, userData) {
    if (err){
      callback(err);
    }
    queryString = "INSERT into songLikes values ($1, $2, CURRENT_DATE)";
    queryParameters = [spotifySongID, userData[0].id];
    executeInsertQuery(queryString, queryParameters, client, callback);
  });
}

function addArtistLike(username, spotifyArtistID, client, callback){
  getUser(username, client, function(err, userData) {
    if (err){
      callback(err);
    }
    queryString = "INSERT into artistLikes values ($1, $2, CURRENT_DATE)";
    queryParameters = [spotifyArtistID, userData[0].id];
    executeInsertQuery(queryString, queryParameters, client, callback);
  });
}
function addAlbumLike(username, spotifyAlbumID, client, callback){
  getUser(username, client, function(err,userData) {
    if (err){
      callback(err);
    }
    queryString = "INSERT into albumLikes values ($1, $2, CURRENT_DATE)";
    queryParameters = [spotifyAlbumID, userData[0].id];
    executeInsertQuery(queryString, queryParameters, client, callback);
  });
}


function addSongRequest(requestID, songRequestInfo, client, callback){
  queryString = "INSERT into SongRequests values ($1, $2, $3, $4)";
  queryParameters = [requestID, songRequestInfo['genre'], songRequestInfo['spotifyArtistID'], songRequestInfo['similarToSpotifySongID']];
  executeInsertQuery(queryString, queryParameters, client, callback);
}


function addAlbumRequest(requestID, albumRequestInfo, client, callback){
  queryString = "INSERT into albumRequests values ($1, $2, $3, $4)";
  queryParameters = [requestID, albumRequestInfo['genre'], albumRequestInfo['spotifyArtistID'], albumRequestInfo['similarToAlbumSpotifyID']];
  executeInsertQuery(queryString, queryParameters, client, callback);
}
function addArtistRequest(requestID, artistRequestInfo, client, callback){
  queryString = "INSERT into artistRequests values ($1, $2, $3)";
  queryParameters = [requestID, artistRequestInfo['genre'], artistRequestInfo['similarToArtistSpotifyID']];
  executeInsertQuery(queryString, queryParameters, client, callback);
}
function addRequest(requestInfo, client, callback){
  var functionMappings = {"song": addSongRequest, "album": addAlbumRequest, "artist": addArtistRequest};
  getUser(requestInfo['from'], client, function(err, fromUserData){
    if (err){
      callback(err);
    }
    else{
      getUser(requestInfo['to'], client, function(err, toUserData){
        if (err){
          callback(err);
        }
        else{
          queryString = "INSERT into RequestsMain values (Default, $1, $2, $3, $4, CURRENT_DATE) RETURNING RequestID";
          queryParameters = [fromUserData[0].id, toUserData[0].id, requestInfo['type'], 0];
          executeInsertQuery(queryString, queryParameters, client, function(err, cl, query, result){
            if (err){
              callback(err);
            }
            else{
              functionMappings[requestInfo['type']](result[0].requestid, requestInfo, client, callback);
            }
          })
        }
      });
    }
  });
}

function addSongRecommendation(requestID, songRecommendationInfo, client, callback){
  var queryString = "INSERT into songRecommendations values ($1, $2)";
  var queryParameters = [requestID, songRecommendationInfo['spotifySongID']];
  executeInsertQuery(queryString, queryParameters, client, callback);


}

function addArtistRecommendation(requestID, ArtistRecommendationInfo, client, callback){
  var queryString = "INSERT into ArtistRecommendations values ($1, $2)";
  var queryParameters = [requestID, ArtistRecommendationInfo['spotifyArtistID']];
  executeInsertQuery(queryString, queryParameters, client, callback);


}

function addAlbumRecommendation(requestID, AlbumRecommendationInfo, client, callback){
  var queryString = "INSERT into AlbumRecommendations values ($1, $2)";
  var queryParameters = [requestID, AlbumRecommendationInfo['spotifyAlbumID']];
  executeInsertQuery(queryString, queryParameters, client, callback);


}

function addRecommendation(recommendationInfo, client, callback){
  var functionMappings = {"song": addSongRecommendation, "artist": addArtistRecommendation,"album": addAlbumRecommendation}
  getUser(recommendationInfo['from'], client, function(err, fromUserData){
    if (err){
      callback(err);
    }
    else{
      getUser(recommendationInfo['to'], client, function(err, toUserData){
        if (err){
          callback(err);
        }
        else{
          queryString = "INSERT into RecommendationsMain values (Default, $1, $2, $3, CURRENT_DATE) RETURNING recommendationID";
          queryParameters = [fromUserData[0].id, toUserData[0].id, recommendationInfo['type']];
          executeInsertQuery(queryString, queryParameters, client, function(err, cl, query, result){
            if (err){
              callback(err);
            }
            else{
              functionMappings[recommendationInfo['type']](result[0].recommendationid, recommendationInfo, client, callback);
            }
          });
        }
      });
    }
  });
}

module.exports = {
  addSongLike:addSongLike,
  addArtistLike:addArtistLike,
  addAlbumLike:addAlbumLike,
  addRequest:addRequest,
  addRecommendation:addRecommendation


};
