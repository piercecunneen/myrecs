var Track = function (songJsonData, album, artists) {
  this.album = album;
  this.artists = artists;
  this.id = songJsonData['id'];
  this.detailedInfoLink = songJsonData['href'];
  this.title = songJsonData['name'];
  this.trackNumber = songJsonData['track_number'];
  this.previewURL = songJsonData['preview_url'];
  this.duration = songJsonData['duration_ms'];
  this.availableMarkets = songJsonData['available_markets'];
  this.isExplicit = songJsonData['explicit'];

  // simplified track objects from Spotify API don't have the popularity
  if (songJsonData['popularity'] === undefined){
    this.popularity = songJsonData['popularity'];
  }
  else{
    this.popularity = null;
  }

};

Track.prototype.print = function() {
  console.log("Title: " +  this.title);
  console.log("ID: " + this.id);
}

module.exports = Track;

