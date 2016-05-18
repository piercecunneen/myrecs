


var Album = function (albumJsonObject, artists, tracks){
    this.albumType = albumJsonObject['album_type'];
    this.availableMarkets = albumJsonObject['available_markets'];
    this.linkToSpotify = albumJsonObject['external_urls']['spotify'];
    this.id = albumJsonObject['id'];
    this.albumImages = albumJsonObject['images'];
    this.title = albumJsonObject['name'];

    if (albumJsonObject['genres'] === undefined){
      this.genres = null;
    }
    else{
      this.genres = albumJsonObject['genres'];
    }

    if (albumJsonObject['popularity'] === undefined){
      this.popularity = null;
    }
    else{
      this.popularity = albumJsonObject['popularity'];
    }

    if (albumJsonObject['release_date'] === undefined){
      this.releaseDate = null;
    }
    else{
      this.releaseDate = albumJsonObject['release_date'];
    }
    this.artists = artists;
    this.tracks = tracks;


}




Album.prototype.print = function() {
	console.log("Album: " + this.title);
  console.log("ID: " + this.id);
}





module.exports = Album;