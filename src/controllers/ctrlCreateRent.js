const ctrl = require("./ctrlCookie.js");
const seo  = require("../util/seo.json");
const db   = require("../database/sqlite.js");
var params = { seo: seo };

module.exports = {
  
  listen: async(fastify) => {
    fastify.post("/create/rent", module.exports.createRent);
  },
  
  createRent: async(request, reply) => {
    console.log("exec createRent");
    // Validate authentication cookie
      await ctrl.validateCookie(request, reply);
    
    // Variables
      let [user, password] = request.cookies.Authentication.split(":");
      let isbn = request.body.book; 
      let days = request.body.days;
      let name, quantity, result;
    
    // Validation
      // Find if book exists
        result   = await db.getBook(isbn);
        name     = result[0].name;
        quantity = result[0].quantity;
        if( result.length == 0 ){
          console.error("Create rent validation");
          params.message = { error: "Livro não encontrado" };
          params.books = await db.getBooks();
          reply.view("/src/pages/rent.hbs", params);
          return;
        }
      // Find duplication of rent
        result = await db.duplicatedRent(user, isbn);
        if( result.length >= 1 ){
          console.error("Create rent validation");
          params.message = { error: "Usuário já fez o aluguel desse livro" };
          params.books = await db.getBooks();
          reply.view("/src/pages/rent.hbs", params);
          return;
        }
      // Admin can't rent books
        if( user == "Admin" ){
          console.error("Create rent validation");
          params.message = { error: "Admin não pode realizar aluguéis" };
          params.books = await db.getBooks();
          reply.view("/src/pages/rent.hbs", params);
          return;
        }
    
    // Creation
      // ID of user
        result = await db.getUser(user);
        let id_user = result[0].id; 
      // Create rent
        await db.createRent(id_user, isbn, days);      
      // Update book
        await db.updateBook(isbn, quantity - 1);
    
    // Success
      // Parameters
        params.books   = await db.getBooks();
        params.message = { success: "Livro alugado com sucesso" };
      // Reply
        console.log(`User: ${user} has rent book: ${name}`);
        reply.view("/src/pages/books.hbs", params);
  }

}