var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var queryFunctions = require('../queries/execute_queries')
const util = require('util');

var userFunctions = require('../users/select_operations');
var getUser = userFunctions.getUser;

var exectuteSelect = queryFunctions.exectuteSelect;


function getAllTables(client, callback){
	var queryString = "select table_name from information_schema.tables where table_schema='public' and table_type = 'BASE TABLE'"
	var params = [];
	exectuteSelect(queryString, params, client, callback);
}



function getUserSongLikes(username, client, callback){
	getUser(username, client, function(err,userData){
		if (err){
			callback(err);
		}
		var queryString = "SELECT spotifySongID, date_of_like from songLikes where userID = $1";
		var queryParameters = [userData[0].id]
		exectuteSelect(queryString, queryParameters, client, callback);
	});
}

function getUserAlbumLikes(username, client, callback){
	getUser(username, client, function(err, userData){
		if (err){
			callback(err);
		}
		var queryString = "SELECT spotifyAlbumID, date_of_like from songLikes where userID = $1";
		var queryParameters = [userData[0].id]
		exectuteSelect(queryString, queryParameters, client, callback);
	});
}

function getUserArtistLikes(username, client, callback){
	getUser(username, client, function(err, userData){
		if (err){
			callback(err);
		}
		var queryString = "SELECT spotifyArtistID, date_of_like from songLikes where userID = $1";
		var queryParameters = [userData[0].id]
		exectuteSelect(queryString, queryParameters, client, callback);
	});
}

function getUserSongRequests(requestInfo, client, callback){
	var queryString = "SELECT * FROM RequestsMain as RM " + 
					  "INNER JOIN songRequests as SR on  RM.requestID = SR.requestID " + 
					  "where RM.fromUserID = $1 AND RM.isFufilled = $2";
	if (requestInfo['genre'] != null){
		queryString +=  util.format(" AND SR.genre LIKE '%s'", requestInfo['genre']);
	}
	if (requestInfo['similarToSongSpotifyID'] != null){
		queryString +=  util.format(" AND SR.similarToSongSpotifyID LIKE '%s'", requestInfo['similarToSongSpotifyID']);
	}

	if (requestInfo['spotifyArtistID'] != null){
		queryString +=  util.format(" AND SR.spotifyArtistID LIKE '%s'", requestInfo['spotifyArtistID']);
	}
	var queryParameters = [requestInfo['userID'], requestInfo['isFufilled']];
	exectuteSelect(queryString, queryParameters, client, callback);
}


function getUserAlbumRequests(requestInfo, client, callback){
	var queryString = "SELECT * FROM RequestsMain as RM " + 
					  "INNER JOIN albumRequests as SR on  RM.requestID = SR.requestID " + 
					  "where RM.fromUserID = $1 AND RM.isFufilled = $2";

	if (requestInfo['genre'] != null){
		queryString +=  util.format(" AND SR.genre LIKE '%s'", requestInfo['genre']);
	}
	if (requestInfo['similarToAlbumSpotifyID'] != null){
		queryString +=  util.format(" AND SR.similarToAlbumSpotifyID LIKE '%s'", requestInfo['similarToAlbumSpotifyID']);
	}

	if (requestInfo['spotifyArtistID'] != null){
		queryString +=  util.format(" AND SR.spotifyArtistID LIKE '%s'", requestInfo['spotifyArtistID']);
	}
	console.log(queryString)
	var queryParameters = [requestInfo['userID'], requestInfo['isFufilled']];
	exectuteSelect(queryString, queryParameters, client, callback);
}


function getUserArtistRequests(requestInfo, client, callback){
	var queryString = "SELECT * FROM RequestsMain as RM " + 
					  "INNER JOIN artistRequests as SR on  RM.requestID = SR.requestID " + 
					  "where RM.fromUserID = $1 AND RM.isFufilled = $2";
	if (requestInfo['genre'] != null){
		queryString +=  util.format(" AND SR.genre LIKE '%s'", requestInfo['genre']);
	}
	if (requestInfo['similarToArtistSpotifyID'] != null){
		queryString +=  util.format(" AND SR.similarToArtistSpotifyID LIKE '%s'", requestInfo['similarToArtistSpotifyID']);
	}
	console.log(queryString)
	var queryParameters = [requestInfo['userID'], requestInfo['isFufilled']];
	exectuteSelect(queryString, queryParameters, client, callback);
}

function getUserRequests(requestInfo, client, callback){
	var functionMapping = {"song": getUserSongRequests, "album": getUserAlbumRequests, "artist": getUserArtistRequests};
	getUser(requestInfo['username'], client, function(err, userData){
		if (err){
			callback(err);
		}
		requestInfo['userID'] = userData[0].id;
		var getRequestsFunction = functionMapping[requestInfo['type']]

		getRequestsFunction(requestInfo, client, callback);

	})
}

function getUserSongRecommendations(recommendationInfo, client, callback){
	var queryString = "SELECT * FROM RecommendationsMain as RM " + 
					  "INNER JOIN songRecommendations as SR on RM.recommendationID = SR.recommendationID " + 
					  "where RM.fromUserID = $1";

	var queryParameters = [recommendationInfo['fromUserID']];
	exectuteSelect(queryString, queryParameters, client, callback);
}
function getUserAlbumRecommendations(recommendationInfo, client, callback){
	var queryString = "SELECT * FROM RecommendationsMain as RM " + 
					  "INNER JOIN albumRecommendations as AR on RM.recommendationID = AR.recommendationID " + 
					  "where RM.fromUserID = $1";

	var queryParameters = [recommendationInfo['fromUserID']];
	exectuteSelect(queryString, queryParameters, client, callback);
}

function getUserArtistRecommendations(recommendationInfo, client, callback){
	var queryString = "SELECT * FROM RecommendationsMain as RM " + 
					  "INNER JOIN artistRecommendations as AR on RM.recommendationID = AR.recommendationID " + 
					  "where RM.fromUserID = $1";

	var queryParameters = [recommendationInfo['fromUserID']];
	exectuteSelect(queryString, queryParameters, client, callback);
}
function getUserRecommendations(recommendationInfo, client, callback){
	var functionMapping = {"song": getUserSongRecommendations, "album": getUserAlbumRecommendations, "artist": getUserArtistRecommendations};

	getUser(recommendationInfo['fromUsername'], client, function(err, userData){
		if (err){
			callback(err);
		}
		recommendationInfo['fromUserID'] = userData[0].id;
		var getRecommendationFunction = functionMapping[recommendationInfo['type']]

		getRecommendationFunction(recommendationInfo, client, callback);

	})
}



module.exports = {
	getAllTables:getAllTables,
	getUserSongLikes:getUserSongLikes,
	getUserAlbumLikes:getUserAlbumLikes,
	getUserArtistLikes:getUserArtistLikes,
	getUserRequests:getUserRequests,
	getUserRecommendations:getUserRecommendations


}
