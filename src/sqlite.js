/**
 * Module handles database management
 *
 * Server API calls the methods in here to query and update the SQLite database
 */

// Utilities we need
const fs = require("fs");

// Initialize the database
const dbFile = "./.data/users.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
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
      // The async / await syntax lets us write the db operations in a way that won't block the app
      if (!exists) {
        // Database doesn't exist yet - create users table
        console.log("Criando o Database users");
        await db.run(
          "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, user VARCHAR[20], password VARCHAR[20])"
        );
        // Add default Admin user to the table
        await db.run(
          "INSERT INTO users (user, password) VALUES ('Admin', '123456')"
        );

        // We have a database already - write users records to log for info
      } else {
        console.log("Database already exists");
        console.log(await db.all("SELECT * FROM users"));
      }
    } catch (dbError) {
      console.error(dbError);
    }
  });

// Our server script will call these methods to connect to the db
module.exports = {
  
  //Get all users in the database
  getUsers: async() => {
    console.log("exec getUsers");
    // We use a try catch block in case of db errors
    try {
      let result = db.all("SELECT * FROM users");
      return result;
    } catch (dbError) {
      // Database connection error
      console.error(dbError);
    }
  },
  
  //Get specific user in the database
  getUser: async(user, password) => {
    console.log("exec getUser");
    // We use a try catch block in case of db errors
    try {
      let result = db.all(`SELECT * FROM users WHERE user="${user}" and password="${password}"`);
      return result;
    } catch (dbError) {
      // Database connection error
      console.error(dbError);
    }
  }
  
};
