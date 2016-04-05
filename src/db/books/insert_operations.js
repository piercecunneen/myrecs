var pg = require('pg');
var db_name = 'test';
var db_path = process.env.DATABASE_URL || 'postgres://localhost:5432/' + db_name +'.db';
var queryFunctions = require('../queries/execute_queries')
var selectFunctions = require('./select_operations');



var executeInsertQuery = queryFunctions.executeInsertQuery;


function addAuthor (author, client, callback){
    queryString = "Insert into Authors values (DEFAULT, $1)";
    queryParameters = [author.name];
    executeInsertQuery(queryString, queryParameters,client, callback);

}

function addGenre(genre, client, callback){
    queryString = "Insert into bookGenres values (DEFAULT, $1)";
    queryParameters = [genre.name];
    executeInsertQuery(queryString, queryParameters, client, callback);
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
            queryString = "Insert into Books values (DEFAULT, $1, $2, $3) RETURNING bookID";
            queryParameters = [book.title, authorID, genreID];
            executeInsertQuery(queryString, queryParameters, client, callback);
        });
    });
}



function insertBooks(books, client, callback){
    var numBooks = books.length;
    for (var i = 0; i < numBooks; i++){
        if (i == numBooks - 1){
            addBook(books[i], client, callback);
        }
        else{
            addBook(books[i], client, "done");
        }
    }
}

function insertAuthors(authors, client, callback){
    var numAuthors = authors.length;
    for (var i = 0; i < numAuthors; i++){
        if (i == numAuthors - 1){
            addAuthor(authors[i], client, callback);
        }
        else{
            addAuthor(authors[i], client, "done");
        }
    }
}
function insertGenres(genres, client, callback){
    var numGenres = genres.length;
    for (var i = 0; i < numGenres; i++){
        if (i == numGenres - 1){
            addGenre(genres[i], client, callback);
        }
        else{
            addGenre(genres[i], client, "done");
        }
    }
}

function insertGenreBookPairs(genreBookPairs, client, callback){
    var numPairs = genreBookPairs.length;
    for (var i = 0; i < numPairs ; i++){
        if (i == numPairs - 1){
            addGenreBookPair(genreBookPairs[i], client, callback);
        }
        else{
            addGenreBookPair(genreBookPairs[i], client, "done");
        }
    }
}




module.exports = {
    insertBooks: insertBooks,
    insertAuthors: insertAuthors,
    insertGenres:insertGenres,
    insertGenreBookPairs:insertGenreBookPairs
}
