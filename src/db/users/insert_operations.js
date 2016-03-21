
var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var crypto = require('crypto');
var queryFunctions = require('../queries/execute_queries')

var executeInsertQuery = queryFunctions.executeInsertQuery;


function hashPassword(password){
	var md5Hash = crypto.createHash('md5');
	var HashedPassword = md5Hash.update(password).digest('hex');
	return HashedPassword;
}



function addUser(username, password, email, client, callback){
	var queryString = "INSERT INTO users(id, username, password, email,isValidated) values (DEFAULT, $1, $2, $3, $4)";
	var queryParameters = [username, hashPassword(password), email, 0];
	executeInsertQuery(queryString, queryParameters, client, callback);
}



function addUsers(users, client, callback){ 
	// For adding multiple users to database at once
	var numUsers = users.length;
	for (var i = 0; i < numUsers; i++){
		var user = users[i];
		if (i === numUsers - 1){
			addUser(user.username, user.password, user.email, client, callback);
		}
		else{
			addUser(user.username, user.password, user.email, client, "done");
		}
	}


}



module.exports = {
	addUsers:addUsers,
	hashPassword:hashPassword
}




