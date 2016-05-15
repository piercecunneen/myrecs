

var Artist = function (artistJsonObject){
	this.id = artistJsonObject['id'];
  this.name = artistJsonObject['name'];
  this.detailedInfoLink = artistJsonObject['href'];
  this.linkToSpotify = artistJsonObject['external_urls']['spotify'];

  if (artistJsonObject['genres'] === undefined){
    this.genres = null;
  }
  else{
    this.genres = artistJsonObject['genres'];
  }

  if (artistJsonObject['popularity'] === undefined){
    this.popularity = null;
  }
  else{
    this.popularity = artistJsonObject['popularity'];
  }

  if (artistJsonObject['images'] === undefined){
    this.popularity = null;
  }
  else{
    this.popularity = artistJsonObject['images'];
  }

  if (artistJsonObject['followers'] === undefined){
    this.followersTotal = null;
    this.followersLink = null;
  }
  else{
    this.followersTotal = artistJsonObject['followers']['total'];
    this.followersLink = artistJsonObject['followers']['href'];
  }
  
}




Artist.prototype.print = function(){
	console.log(this.name);
	console.log(this.id);
}


module.exports = Artist;
