const ctrl  = require("./ctrlCookie.js");
const seo   = require("../util/seo.json");
const view  = require("./ctrlViewHome.js");
const db    = require("../database/sqlite.js");
var params  = { seo: seo };

module.exports = {
  
  listen: async(fastify) => {
    fastify.post("/delete/rent", module.exports.deleteRent);
  },
  
  deleteRent: async(request, reply) => {
    console.log("exec deleteRent");
    // Validate authentication cookie
      await ctrl.validateCookie(request, reply);
    
    // Variables
      let [user, password] = request.cookies.Authentication.split(":");
      let isbn = request.body.isbn;
      let result, id_user, name, quantity;
    
    // is Admin ?
      if( user == "Admin" ){
        user = request.body.user;
        // Parameters for validation reply
          params.users  = await db.getUsers();
          params.books0 = await db.getBooks0();
      }
    
    // Validation
      // Find if user has rents
        result  = await db.getUser(user);
        id_user = result[0].id;
        result  = await db.getUserRents(id_user);
        if( result.length == 0 ){
          console.error("Delete rent validation");
          params.message = { error: "Usuário não possui aluguel" };
          params.rents   = result;
          return reply.view("/src/pages/home.hbs", params);
        }
      // Find if user rented this book
        if( !result.map( function(rent){return rent.isbn == isbn;} ).filter(Boolean)[0] ){
          console.error("Delete rent validation");
          params.message = { error: "Usuário não alugou esse livro" };
          params.rents   = result;
          return reply.view("/src/pages/home.hbs", params);
        }
    
    // Deletion
      try {
        // Delete rent
          await db.deleteRent(id_user, isbn);
        // Update Books
          result   = await db.getBook(isbn);
          name     = result[0].name;
          quantity = result[0].quantity + 1;
          await db.updateBook(isbn, quantity);
        
      } catch {
        // Error
          // Parameters
            params.message = { error: "Erro interno, veja o log para detalhes" };
          // Reply
            console.error(`Delete rent internal error`);
            return reply.view("/src/pages/home.hbs", params);
      }
    
    // Success
      // Parameters User && Admin  
        params.rents = await db.getUserRents(id_user);
      
      // Admin reply
        if( request.cookies.Authentication.split(":")[0] == "Admin" ){
          // Parameters
            params.books0 = await db.getBooks0();
            params.message = { success: "Livro devolvido com sucesso" };
          // Reply
            console.log(`Admin returned Book: ${name}`);
            return reply.view("/src/pages/admin_home.hbs", params);
      
      // User reply
        } else {
          // Parameters
            params.message = { success: "Livro devolvido com sucesso" };
          // Reply
            console.log(`User: ${user} returned book: ${name}`);
            return reply.view("/src/pages/home.hbs", params);
        }
  }
  
}