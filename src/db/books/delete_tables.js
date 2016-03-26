var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var client = new pg.Client(db_path);


function deleteTables(client, tables, callback){
	// if (tables.length == 0){
	// 	callback(client);
	// }
	// else{
	// 	var queryString = 'drop table ' + tables[0];
	// 	var query = client.query(queryString);
	//
	// 	query.on('end', function () {
	// 		deleteTables(client, tables.slice(1), callback);
	//
	// 	});
	// 	query.on('error', function (error){
	// 		callback("error");
	// 	});
	// }
	var queryString = "drop table ";
	for (var i = 0; i < tables.length; i++){
		if (i == tables.length - 1){
			queryString += tables[i];
		}
		else{
			queryString += tables[i] + ', ';
		}


	}
	var query = client.query(queryString);
	query.on('end', function(){
		callback(client);
	})

}

module.exports = {
	deleteTables:deleteTables
}
