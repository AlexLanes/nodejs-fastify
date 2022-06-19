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
    
    // Validation
      let user     = request.cookies.Authentication.split(":")[0];
      let isbn     = request.body.book; 
      let days     = request.body.days;
      let book     = await db.getBook(isbn);
      let name     = book[0].name;
      let quantity = book[0].quantity;
    
      // Find if book exists
      if( book.length == 0 ){
        console.error("Book not found")
        params.error = "Livro não encontrado";
        params.books = await db.getBooks();
        reply.view("/src/pages/rent.hbs", params);
        return;
      }
    
      // Find duplication of rent
      let result = await db.duplicatedRent(user, isbn);
      if( result.length >= 1 ){
        console.error("Duplicated rent")
        params.error = "Usuário já fez o aluguel desse livro";
        params.books = await db.getBooks();
        reply.view("/src/pages/rent.hbs", params);
        return;
      }
    
      // Admin can't rent
      if( user == "Admin" ){
        console.error("Admin not allowed to rent")
        params.error = "Admin não pode realizar aluguéis";
        params.books = await db.getBooks();
        reply.view("/src/pages/rent.hbs", params);
        return;
      }
    
    // Creation
      // ID from user
        result = await db.getUser(user);
        let id_user = result[0].id; 
      
      // Create rent
        await db.createRent(id_user, isbn, days);
      
      // Update book
        await db.updateBook(isbn, quantity - 1);
    
    // GET books
      params.books = await db.getBooks();
    // Success
      console.log(`User: ${user} has rent book: ${name}`);
      reply.view("/src/pages/books.hbs", params);
  }

}