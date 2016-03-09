var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var crypto = require('crypto');

function hashPassword(password){
	var md5Hash = crypto.createHash('md5');
	HashedPassword = md5Hash.update(password).digest('hex');
	return HashedPassword;
}


function addUser(username, password, email){
	pg.connect(db_path, function (err, client, done) {
		if (err){
			console.log("Error connecting to database");
			return -1;
		}
		else{
			var query = client.query(
				"INSERT INTO users(id, username, password, email,isValidated) values (DEFAULT, $1, $2, $3, $4)",
				[username, hashPassword(password), email, 0],
				function(err, result){
					if (err){
						console.log(err);
						console.log("Error inserting");
					}
					else{
						console.log('row inserted');
					}
				})
			query.on('end', function() {
				client.end();
			})
		}
	});
}









