var pg = require('pg');
var dbPath = process.env.DATABASE_URL || 'postgres://localhost:5000/test';

var client = new pg.Client(dbPath);

var query = client.query('CREATE TABLE users(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, isValidated BOOLEAN DEFAULT 0 ');

query.on('end', function() {
	client.end();
});


