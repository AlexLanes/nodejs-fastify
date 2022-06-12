/**
 * Module handles database management
 *
 * Server API calls the methods in here to query and update the SQLite database
 */

// Utilities we need
const fs        = require("fs");
const dbFile    = "./.data/library.db";
const exists    = fs.existsSync(dbFile);
const sqlite3   = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
const crypto    = require("crypto-js");
let db;

/* 
We're using the sqlite wrapper so that we can make async / await connections
- https://www.npmjs.com/package/sqlite
*/
dbWrapper.open( {filename: dbFile, driver: sqlite3.Database} )
  .then(async (dBase) => {
    db = dBase;

    // We use try and catch blocks throughout to handle any database errors
    try {
      // Database doesn't exist yet
      if (!exists) {
        // Create users table
          console.log("Creating Table users");
          await db.run(
            "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, user VARCHAR[20], password VARCHAR[222])"
          );
          // Add default Admin user to the table
          await db.run(
            `INSERT INTO users (user, password) VALUES ("Admin", "${crypto.AES.encrypt(process.env.ADMIN_PASSWORD, process.env.AES_Salt).toString()}")`
          );
        
        // Create books table
          console.log("Creating Table books");
          await db.run(
            "CREATE TABLE books (isbn INTEGER PRIMARY KEY, name VARCHAR[40], author VARCHAR[40], quantity INTEGER)"
          );
          // Add default books to the table
          await db.run(
            "INSERT INTO books (isbn, name, author, quantity) VALUES (8532530788, 'Harry Potter e a Pedra Filosofal', 'J.K. Rowling', 1), (8556510787, 'A Guerra dos Tronos', 'GEORGE R. R. MARTIN', 2), (8599296361, 'A cabana', 'William Paul Young', 3)"
          );
        
        // Create rents table
          console.log("Creating Table rents");
          await db.run(
            "CREATE TABLE rents (fk_user INTEGER, isbn INTEGER, end_date DATE)"
          );

        // We have a database already - log for info
      } else {
        console.log("Database already exists");
        //console.log( await db.all("SELECT * FROM users") )
        //console.log( await db.all("SELECT * FROM books") )
        //console.log( await db.all("SELECT * FROM rents") )
      }
    } catch (dbError) {
      console.error(dbError);
    } 
  });

// Our server script will call these methods to connect to the db
module.exports = {
  
  // Find user in the database
  getUser: async(user) => {
    console.log("exec getUser");
    // We use a try catch block in case of db errors
    try {
      let result = db.all(`SELECT * FROM users WHERE user="${user}"`);
      return result;
    } catch (dbError) {
      // Database connection error
      console.error(dbError);
    }
  },
  
  // Create a new user in the database
  createUser: async(user, password) => {
    console.log("exec getPassword");
    // We use a try catch block in case of db errors
    try {
      await db.run(`INSERT INTO users (user, password) VALUES ("${user}", "${password}")`);
    } catch (dbError) {
      // Database connection error
      console.error(dbError);
    }
  },
  
  // Get a book in the database
  getBook: async(name) => {
    console.log("exec getBook");
    // We use a try catch block in case of db errors
    try {
      let result = await db.all(`SELECT * FROM books WHERE name="${name}"`);
      return result;
    } catch (dbError) {
      // Database connection error
      console.error(dbError);
    }
  },
  
  // Get all books in the database
  getBooks: async() => {
    console.log("exec getBooks");
    // We use a try catch block in case of db errors
    try {
      let result = await db.all("SELECT * FROM books WHERE quantity > 0");
      return result;
    } catch (dbError) {
      // Database connection error
      console.error(dbError);
    }
  },
  
  // Update book quantity in the database
  updateBook: async(isbn, quantity) => {
    console.log("exec updateBook");
    // We use a try catch block in case of db errors
    try {
      await db.run(`UPDATE books SET quantity=${quantity} WHERE isbn=${isbn}`);
    } catch (dbError) {
      // Database connection error
      console.error(dbError);
    }
  },
  
  // Get all Rents in the database
  getRents: async() => {
    console.log("exec getRents");
    // We use a try catch block in case of db errors
    try {
      let result = await db.all("SELECT * FROM rents");
      return result;
    } catch (dbError) {
      // Database connection error
      console.error(dbError);
    }
  },
  
  // Create a Rent in the database
  createRent: async(id_user, isbn, days) => {
    console.log("exec createRent");
    // We use a try catch block in case of db errors
    try {
      await db.run(`INSERT INTO rents (fk_user, isbn, end_date) VALUES (${id_user}, ${isbn}, date('now', '+${days} day'))`);
    } catch (dbError) {
      // Database connection error
      console.error(dbError);
    }
  },
  
  // Get all Rents from User in the database
  getUserRents: async(id_user) => {
    console.log("exec getUserRents");
    // We use a try catch block in case of db errors
    try {
      let result = await db.all(`SELECT * FROM rents WHERE fk_user = ${id_user}`);
      return result;
    } catch (dbError) {
      // Database connection error
      console.error(dbError);
    }
  }
  
};
