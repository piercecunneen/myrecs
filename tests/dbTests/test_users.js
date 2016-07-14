var chai = require('chai');
var pg = require('pg');
var assert = chai.assert;
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var crypto = require('crypto');

var async = require('async');
const util = require('util');

var userDB = "../../src/db/users/"
var insertFunctions = require(userDB + 'insert_operations');
var selectFunctions = require(userDB + 'select_operations');
var createTables = require(userDB + 'createTables');
var deleteTables = require(userDB + 'delete_tables').deleteTables;
var getClient = require("../../src/db/client/get_client").getClient;

var JsonUserData = require("./jsonObjects/user_data.json");
tables = JsonUserData.tables;
users = JsonUserData.users;

describe('Create User table', function() {
  var numTables = tables.length;
  it('should create ' + numTables + ' databases', function(done) {
    getClient(db_path, function(client){
      createTables.addTables(client, function(){
        selectFunctions.getAllTables(client, function(results){
          assert.equal(results.length, numTables, "Expected " + numTables + " tables");
          done()
        });
      });
    });
  });
});

describe("Test hashing function",  function() {
  it('should compute hashed passwords properly', function(){
    var pass1 = "5BrnH+5BrnH+";
    var pass2 = "password";
    var pass3 = "__fd__";
    var pass4 = "hello world";
    var hash = insertFunctions.hashPassword;
    assert.equal(hash(pass1), '8eccf1d49f38e777c43ee8327fd23d87', "hash computed incorrectly");
    assert.equal(hash(pass2), '5f4dcc3b5aa765d61d8327deb882cf99', "hash computed incorrectly");
    assert.equal(hash(pass3), '145533ca3c2d0d9e504e29b17cf42a4d', "hash computed incorrectly");
    assert.equal(hash(pass4), '5eb63bbbe01eeed093cb22bb8f5acdc3', "hash computed incorrectly");

  });

});



describe('Users', function() {
  it('should insert users', function(done){
    getClient(db_path, function(client){
      insertFunctions.addUsers(users, client, function(){
        selectFunctions.getAllUsers(client, function(results, query){
          assert.equal(results.length, users.length, "Should have inserted " + users.length + " users");
          done();
        })
      });
    });
  });

  it('should return matching email', function(done){
    getClient(db_path, function(client){
      async.eachSeries(users, function(user, callback) {
        selectFunctions.getUser(user.username, client, function(results, query){
          assert.equal(results[0].email, user.email, "email not equal to " + user.email);
          callback();
        });
      }, function (err) {
        if (err) console.log(err);
        done();
      })
    });
  });
});

describe("Delete user tables", function(){ // keep as last test to delete tables
  it('should remove all tables from test database', function(done){
    getClient(db_path, function(client){
      deleteTables(client, tables, function(client){
        selectFunctions.getAllTables(client, function(results){
          assert.equal(results.length, 0, "Expected 0 tables");
          client.end();
          done()
        });
      });
    });
  });
});
