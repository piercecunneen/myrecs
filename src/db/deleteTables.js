var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';

var client = new pg.Client(db_path);

tables = ['users', 'artistssongs', 'musicartists', 'songs'];
count = tables.length;
pg.connect(db_path, function (err, client, done) {
	if (err){
		console.log('Cannot connect to ' + db_name + ' database');
	}
	else{
		queryString = 'drop table ';
		for (var i = 0; i < tables.length; i++){
			if (i === tables.length - 1){
				queryString += tables[i]+ " ";

			}
			else{
				queryString += tables[i] + ', ';
			}
		}

		var query = client.query(queryString);

		query.on('end', function () {
			console.log('Tables deleted successfull');
			client.end();
		
		});
		query.on('error', function (error){
			console.log(error);
			client.end();
		});

		

	}


});