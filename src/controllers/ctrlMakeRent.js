const seo    = require("../seo.json");
const db     = require("../sqlite.js");
const cookie = require("../validateCookie.js");
const ctrl   = require("./ctrlViewBooks.js");

module.exports = {
  
  listen: async(servidor) => {
    // GET on /rent
    servidor.get("/rent", module.exports.viewRent);
    // POST on /rent
    servidor.post("/rent", module.exports.createRent);
  },
  
  viewRent: async(request, reply) => {
    console.log("exec viewRent");
    // params
      let params = request.query.raw ? {} : { seo: seo };
    // Validate Authentication Cookie
      let isValid = await cookie.isValid(request.cookies.Authentication);
      if( !isValid ){
        params.error = "Usuário deve se autenticar";
        reply.view("/src/pages/login.hbs", params);
        return;
      }
    
    // Acessing book's table
      params.books = await db.getBooks();
    // Show login.hbs
      reply.view("/src/pages/rent.hbs", params);
  },
  
  createRent: async(request, reply) => {
    console.log("exec createRent");
    // params
      let params = request.query.raw ? {} : { seo: seo };
    // Validate Authentication Cookie
      let isValid = await cookie.isValid(request.cookies.Authentication);
      if( !isValid ){
        params.error = "Usuário deve se autenticar";
        reply.view("/src/pages/login.hbs", params);
        return;
      }
    
    // Variables from request
      let user = request.cookies.Authentication.split(":")[0];
      let book = request.body.book; 
      let days = request.body.days;
    // id from user
      let result  = await db.getUser(user);
      let id_user = result[0].id; 
    // isbn and quantity of book
      result   = await db.getBook(book);
      let isbn = result[0].isbn;
      let quantity = result[0].quantity - 1;
    // Create Rent
      await db.createRent(id_user, isbn, days);
    // Update Books
      await db.updateBook(isbn, quantity);
    
    // Success
      console.log(`User: ${user} has rent book: ${book}`);
      await ctrl.viewBooks(request, reply);
  }

}