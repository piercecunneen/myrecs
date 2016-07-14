var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var client = new pg.Client(db_path);
var insertFunctions = require('./insert_operations');

function deleteTables(client, tables, callback){
  var queryString = "drop table ";
  for (var i = 0; i < tables.length; i++){
    if (i != tables.length - 1){
      queryString += tables[i]+ ", ";
    }
    else{
      queryString += tables[i];
    }
  }
  var query = client.query(queryString);



  query.on('end', function () {
    callback(null, client);

  });
  query.on('error', function(error) {
      callback(error);
    });
}

module.exports = {
  deleteTables:deleteTables
}
