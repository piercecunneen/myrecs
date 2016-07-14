var chai = require('chai');
var pg = require('pg');
var assert = chai.assert;
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var async = require('async');

var bookDB = "../../src/db/books/"
var selectFunctions = require(bookDB + 'select_operations');
var deleteTables = require(bookDB + 'delete_tables').deleteTables;
var createTables = require(bookDB + 'create_tables');
var insertFunctions = require(bookDB + 'insert_operations');
var getClient = require("../../src/db/client/get_client").getClient;

var JsonBookData = require('./jsonObjects/book_data.json');
var tables = JsonBookData.tables;
var authors = JsonBookData.authors;
var books = JsonBookData.books;
var genres = JsonBookData.genres


describe("Create book tables", function(){
  var numTables = tables.length;
  it("should create " + numTables + " tables", function (done){
    getClient(db_path, function(client){
      createTables.addTables(client, function(){
        selectFunctions.getAllTables(client, function(results){
          assert.equal(results.length, numTables, "Expected " + numTables + " tables");
          done();
        });
      });
    });
  });
});

describe("Insert books, authors, and genres", function(){
  var cl;
  before(function(done){
    getClient(db_path, function(client){
      cl = client;
      done();
    });
  });
  it('should insert genres into db', function(done){
    insertFunctions.insertGenres(genres, cl, function(){
      selectFunctions.getAllGenres(cl, function(results){
          assert.equal(results.length, genres.length, "Expected to insert " + genres.length + " genres")
          done();
      });
    });
  });
  it('should insert authors into db', function(done){
    insertFunctions.insertAuthors(authors, cl, function(){
      selectFunctions.getAllAuthors(cl, function(results){
          assert.equal(results.length, authors.length, "Expected to insert " + authors.length +  " authors")
          done();
      });
    });
  });
  it('should insert books into db', function(done){
    insertFunctions.insertBooks(books, cl, function(){
      selectFunctions.getAllBooks(cl, function(results){
          assert.equal(results.length, books.length, "Expected to insert " + books.length +  "books")
          done();
      });
    });
  });
});


describe("Destroy book tables", function(){
  it("should delete all tables", function (done){
    getClient(db_path, function(client){
      deleteTables(client, tables, function(){
        selectFunctions.getAllTables(client, function(results){
          assert.equal(results.length, 0, "Expected 0 tables, got " + results.length);
          done();
        });
      });
    });
  });
});
