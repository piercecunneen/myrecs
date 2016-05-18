

var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var queryFunctions = require('../queries/execute_queries');
var selectFunctions = require('./select_operations');
var executeInsertQuery = queryFunctions.executeInsertQuery;
var getClient = require("../client/get_client").getClient;

var getUser = require("../users/select_operations").getUser;




function addUserSongLike(username, spotifySongID, client, callback){
	getUser(username, client, function(err, userData) {
		if (err){
			callback(err);
		}
		queryString = "INSERT into songLikes values ($1, $2, CURRENT_DATE)";
		queryParameters = [spotifySongID, userData[0].id];
		executeInsertQuery(queryString, queryParameters, client, callback);
	});
}

function addUserArtistLike(username, spotifyArtistID, client, callback){
	getUser(username, client, function(err, userData) {
		if (err){
			callback(err);
		}
		queryString = "INSERT into artistLikes values ($1, $2, CURRENT_DATE)";
		queryParameters = [spotifyArtistID, userData[0].id];
		executeInsertQuery(queryString, queryParameters, client, callback);
	});
}
function addUserAlbumLike(username, spotifyAlbumID, client, callback){
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
	queryString = "INSERT into artistRequests values ($1, $2, $3, $4)";
	queryParameters = [requestID, artistRequestInfo['genre'], artistRequestInfo['spotifyArtistID'], artistRequestInfo['similarToArtistSpotifyID']];
	executeInsertQuery(queryString, queryParameters, client, callback);
}
function addRequest(fromUsername, toUsername, itemType, itemInfo, client, callback){
	var functionMappings = {"song": addSongRequest, "album": addAlbumRequest, "artist": addArtistRequest};
	getUser(fromUsername, client, function(err, fromUserData){
		if (err){
			callback(err);
		}
		else{
			getUser(toUsername, client, function(err, toUserData){
				if (err){
					callback(err);
				}
				else{
					queryString = "INSERT into RequestsMain values (Default, $1, $2, $3, $4, CURRENT_DATE) RETURNING RequestID";
					queryParameters = [fromUserData[0].id, toUserData[0].id, itemType, 0];
					executeInsertQuery(queryString, queryParameters, client, function(err, client, query, result){
						if (err){
							callback(err);
						}
						else{
							functionMappings['itemType'](result[0].id, itemInfo, client, callback);
						}
					})
				}
			});
		}
	});
}





function addRecommendation(fromUsername, toUsername, itemID, itemType, client, callback){
	getUser(fromUsername, client, function(err, fromUserData){
		if (err){
			callback(err);
		}
		else{
			getUser(toUsername, client, function(err, toUserData){
				if (err){
					callback(err);
				}
				else{
					queryString = "INSERT into RecommendationsMain values (Default, $1, $2, $3, $4, CURRENT_DATE)";
					queryParameters = [fromUserData[0].id, toUserData[0].id, itemType, itemID];
					executeInsertQuery(queryString, queryParameters, client, callback);
				}
			});
		}
	});
}












module.exports = {
	addUserSongLike:addUserSongLike,
	addUserArtistLike:addUserArtistLike,
	addUserAlbumLike:addUserAlbumLike


};
