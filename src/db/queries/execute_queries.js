
function executeInsertQuery(queryString, queryParameters, client, callback){ // insert version
	// Written to create a more modular codebase and reduce code reuse.
	var query = client.query(queryString, queryParameters,
		function(err, results) {
			if (err){
				callback(err);
			}
			else{
				if (callback == 'done'){
					// return client to client pool
					client.done();
				}
				else{
					// pass client and query so that we can end client connection on query ending
					callback(null, client, query, results.rows);
				}
			}
		})
}

function executeCreateDBQuery(queryString, params, client, callback){
	var query = client.query(queryString, params,
		function(err, results){
			if (err){
				callback(err);
			}
			else{
				if (callback == "done"){
					client.done();

				}
				else{
					callback(null, client, query);
				}
			}
	});

}

function exectuteSelect(queryString, params, client, callback){ // select version

	var query = client.query(queryString, params,
		function(err, results){
			if (err){
				callback(err);
			}
			else{
				if (callback === "done"){
					callback();
				}
				else{
					callback(null, results.rows, query);
				}
			}

	});

}

module.exports = {
	executeInsertQuery:executeInsertQuery,
	executeCreateDBQuery:executeCreateDBQuery,
	exectuteSelect:exectuteSelect
}
