var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var queryFunctions = require('../queries/execute_queries')
var selectFunctions = require('./select_operations');



var exectuteSelect = queryFunctions.exectuteSelect;


function addAuthor (author, client, callback){
    queryString = "Insert into Authors values (DEFAULT, $1)";
    queryParameters = [author["name"]];
    exectuteSelect(queryString, queryParameters,client, callback);

}

function addBook(book, client, callback){
    selectFunctions.getGenreID(book.genre, client, function(genreID){
        if (genreID == "Error"){
            callback("Error");
        }
        selectFunctions.getAuthorID(book.author, client, function(authorID){
            if (authorID == "Error"){
                callback("Error");
            }
            queryString = "Insert into Books values (DEFAULT, $1, $2, $3)";
            queryParameters = [book.title, authorID, genreID];
            exectuteSelect(queryString, queryParameters, client, callback);
        });
    });
}

function addGenreBookPair(genreID, bookID){
    queryString = "Insert into bookGenrePair values ($1, $2)";
    queryParameters = [genreID, bookID];
    exectuteSelect(queryString, queryParameters, client, callback);
}




module.exports = {

}
