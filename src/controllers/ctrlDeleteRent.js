const ctrl = require("./ctrlCookie.js");
const seo  = require("../util/seo.json");
const db   = require("../database/sqlite.js");
var params = { seo: seo };

module.exports = {
  
  listen: async(fastify) => {
    fastify.get("/delete/rent", module.exports.deleteRent);
  },
  
  deleteRent: async(request, reply) => {
    console.log("exec deleteRent");
      let user   = request.cookies.Authentication.split(":")[0];
      user == "Admin" 
        ? params.admin = "Admin"
        : {};
    // Validate authentication cookie
      await ctrl.validateCookie(request, reply);
    
    // Variables
      let isbn    = request.query.isbn;
      let result, id_user, name, quantity;
    
    // Validation
      // Find if user has rents
        result  = await db.getUser(user);
        id_user = result[0].id;
        result  = await db.getUserRents(id_user);
        if( result.length == 0 ){
          console.error("Delete rent validation");
          params.message = { error: "Usuário não possui aluguel" };
          params.rents   = result;
          reply.view("/src/pages/home.hbs", params);
          return;
        }
      // Find if user rented this book
        if( !result.map( function(rent){return rent.isbn == isbn;} ).filter(Boolean)[0] ){
          console.error("Delete rent validation");
          params.message = { error: "Usuário não alugou esse livro" };
          params.rents   = result;
          reply.view("/src/pages/home.hbs", params);
          return;
        }
    
    // Deletion
      // Delete rent
        await db.deleteRent(id_user, isbn);
      // Update Books
        result   = await db.getBook(isbn);
        name     = result[0].name;
        quantity = result[0].quantity + 1;
        await db.updateBook(isbn, quantity);
    
    // Success
      // Parameters
        params.rents   = await db.getUserRents(id_user);
        params.message = { success: "Livro devolvido com sucesso" };
      // Reply
        console.log(`User: ${user} returned book: ${name}`);
        reply.view("/src/pages/home.hbs", params);
  }
  
}