var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';

function getClient(db_path, callback){
  pg.connect(db_path, function(err, client, done){
    if (err){
      callback(err);
    }
    else{
      client.done = done; // allow for client to be passed around while allowing for client to be returned to client pool
      callback(null, client);
    }
  });
}

module.exports = {
    getClient:getClient
}
