var request = require('request');
const util = require('util');

var musicObjectPath = "../music/objects";

var Track = require(util.format("%s/Track/Track", musicObjectPath))
var Album = require(util.format("%s/Album/Album", musicObjectPath))
var Artist = require(util.format("%s/Artist/Artist", musicObjectPath))








function searchForArtist(artistName, offset, limit, callback){
	var baseURL = "https://api.spotify.com/v1";
	var formatedArtistName = formatSearchString(artistName);
	var fullURI = util.format("%s/search?q=%s&offset=%s&limit=%s&type=artist", baseURL, formatedArtistName, offset, limit);

	request({
		uri: fullURI,
		method: "GET"
	},
		function(error, response, body){
			if (error){
				callback(err);
			}
			else{
				artistInfo = JSON.parse(body);
				artists = artistInfo['artists']['items'];
				callback(null, artists);
			}
		}
	);
}


function searchForTrack(trackName, offset, limit, callback){
	var baseURL = "https://api.spotify.com/v1";
	var formatedTrackName = formatSearchString(trackName);
	var fullURI = util.format("%s/search?q=%s&offset=%s&limit=%s&type=track", baseURL, formatedTrackName, offset, limit);

	request({
		uri: fullURI,
		method: "GET"
	},
		function(error, response, body){
			if (error){
				callback(err);
			}
			artistInfo = JSON.parse(body);
			tracks = artistInfo['tracks']['items'];
			callback(null, tracks);
		}
	)

}


function searchForAlbum(albumName, offset, limit, callback){
	var baseURL = "https://api.spotify.com/v1";
	var formatedAlbumName = formatSearchString(albumName);
	var fullURI = util.format("%s/search?q=%s&offset=%s&limit=%s&type=album", baseURL, formatedAlbumName, offset, limit);

	request({
		uri: fullURI,
		method: "GET"
	},
		function(error, response, body){
			if (error){
				callback(err);
			}
			albumInfo = JSON.parse(body);
			// console.log(albumInfo)
			albums = albumInfo['albums']['items'];
			callback(null, albums);
		}

	)

}


function getAlbum(albumID, callback){
	var baseURL = "https://api.spotify.com/v1/albums";
	var fullURI = util.format("%s/%s", baseURL, albumID);

	request({
		uri:fullURI,
		method: "GET"

	},
		function(error, response, body){
			if (error){
				callback(error, null);
			}
			else{
				var album = createAlbum(JSON.parse(body));
				callback(null, album);
			}
		}
	)

}

function getTrack(trackID, callback){
	var baseURL = "https://api.spotify.com/v1/tracks";
	var fullURI = util.format("%s/%s", baseURL, trackID);

	request({
		uri:fullURI,
		method: "GET"

	},
		function(error, response, body){
			if (error){
				callback(error, null);
			}
			else{
				var track = createTrack(JSON.parse(body));
				callback(null, track);
			}
		}
	);
}

function getArtist(artistID, callback){
	var baseURL = "https://api.spotify.com/v1/artists";
	var fullURI = util.format("%s/%s", baseURL, artistID);

	request({
		uri:fullURI,
		method: "GET"

	},
		function(error, response, body){
			if (error){
				callback(error, null);
			}
			else{
				var artist = createArtist(JSON.parse(body))
				callback(null,artist );
			}
		}
	);
}

function getMultipleArtists(artistIDs, callback){
	var baseURL = "https://api.spotify.com/v1/artists";
	var fullURI = util.format("%s/?ids=%s", baseURL, artistIDs.join(","));
	request({
		uri:fullURI,
		method: "GET"

	},
		function(error, response, body){
			if (error){
				callback(error, null);
			}
			else{
				var artists = [];

				var artistJsonData = JSON.parse(body);

				for (var i = 0; i < artistJsonData['artists'].length; i++){
					var artist = createArtist(artistJsonData['artists'][i]);
					artists.push(artist);
				}
				callback(null, artists);
			}
		}
	);

}

function getMultipleTracks(trackIDs, callback){
	var baseURL = "https://api.spotify.com/v1/tracks";
	var fullURI = util.format("%s/?ids=%s", baseURL, trackIDs.join(","));
	// console.log(fullURI);
	request({
		uri:fullURI,
		method: "GET"

	},
		function(error, response, body){
			if (error){
				callback(error, null);
			}
			else{
				var tracks = [];

				tracksData = JSON.parse(body);
				for (var i = 0; i < tracksData['tracks'].length; i++){
					var track = createTrack(tracksData['tracks'][i]);
					tracks.push(track);

				}
				callback(null, tracks);
			}
		}
	);

}

function getMultipleAlbums(albumIDs, callback){
	var baseURL = "https://api.spotify.com/v1/albums";
	var fullURI = util.format("%s/?ids=%s", baseURL, albumIDs.join(","));
	request({
		uri:fullURI,
		method: "GET"

	},
		function(error, response, body){
			if (error){
				callback(error, null);
			}
			else{

				var albums = [];

				var albumJsonData = JSON.parse(body);
				for (var i = 0; i < albumJsonData['albums'].length; i++){
					var album = createAlbum(albumJsonData['albums'][i]);
					albums.push(album);
				}

				callback(null, albums);
			}
		}
	);

}

function getArtistAlbums(artistID, callback){
	var baseURL = "https://api.spotify.com/v1/artists";
	var fullURI = util.format("%s/%s/albums", baseURL, artistID);
	request({
		uri:fullURI,
		method: "GET"

	},
		function(error, response, body){
			if (error){
				callback(error, null);
			}
			else{

				var albums = [];

				var albumJsonData = JSON.parse(body)['items'];
				for (var i = 0; i < albumJsonData.length; i++){
					var album = createAlbum(albumJsonData[i]);
					albums.push(album);
				}

				callback(null, albums);
			}
		}
	);
}



function createTrack(trackJsonData){
	var artists = [];
	for (var i = 0; i < trackJsonData['artists'].length; i++){
		var artist = new Artist(trackJsonData['artists'][i]);
		artists.push(artist);
	}
	if (trackJsonData['album'] !== undefined){
		var album = createAlbum(trackJsonData['album'])
	}
	else{
		var album = undefined;
	}
	var track = new Track(trackJsonData, album, artists);
	return track;
}

function createAlbum(albumJsonData){
	
	if (albumJsonData['artists'] !== undefined){
		var artists = [];
		for (var i = 0; i < albumJsonData['artists'].length; i++){
			var artist = new Artist(albumJsonData['artists'][i]);
			artists.push(artist);
		} 
	}
	else{
		var artists = undefined;
	}
		
	if (albumJsonData['tracks'] !== undefined){
		var tracks = [];
		var tracksData = albumJsonData['tracks']['items'];
		for (var i = 0; i < tracksData.length; i++){
			var track = createTrack(tracksData[i]);
			tracks.push(track);
		}
	}
	else{
		var tracks = undefined;
	}

	var album = new Album(albumJsonData, artists, tracks);
	return album;

}

function createArtist(artistJsonData){
	var artist = new Artist(artistJsonData);
	return artist;
}



function formatSearchString(query){
	var splitStringArray = query.split(" ").filter(function (a) {return a != ""});
	return splitStringArray.join("+")
}
