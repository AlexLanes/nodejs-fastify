const ctrl = require("./ctrlCookie.js");
const seo  = require("../util/seo.json");
const db   = require("../database/sqlite.js");

module.exports = {
  
  listen: async(fastify) => {
    fastify.post("/rent", module.exports.createRent);
  },
  
  createRent: async(request, reply) => {
    console.log("exec createRent");
    // Parameters
      let params = { seo: seo };
    // Validate authentication cookie
      await ctrl.validateCookie(request, reply);
    
    // Creation
      // Variables from request
        let user = request.cookies.Authentication.split(":")[0];
        let book = request.body.book; 
        let days = request.body.days;
      
      // id from user
        let result  = await db.getUser(user);
        let id_user = result[0].id; 
      
      // Validate duplication of rent
        result = await db.duplicateRent(id_user, book);
        if( result.length != 0 ){
          console.error("Duplicated Rent")
          params.error = "Usuário já fez o aluguel desse livro";
          params.books = await db.getBooks();
          reply.view("/src/pages/rent.hbs", params);
          return;
        }
      
      // isbn and quantity of book
        result   = await db.getBook(book);
        let isbn = result[0].isbn;
        let quantity = result[0].quantity - 1;
      
      // Create rent
        await db.createRent(id_user, isbn, days);
      
      // Update books
        await db.updateBook(isbn, quantity);
    
    // GET books
      params.books = await db.getBooks();
    // Success
      console.log(`User: ${user} has rent book: ${book}`);
      reply.view("/src/pages/books.hbs", params);
  }

}