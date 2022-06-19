const ctrl = require("./ctrlCookie.js");
const seo  = require("../util/seo.json");
const db   = require("../database/sqlite.js");

module.exports = {
  
  listen: async(fastify) => {
    fastify.get("/delete/rent", module.exports.deleteRent);
  },
  
  deleteRent: async(request, reply) => {
    console.log("exec deleteRent");
    // Parameters
      let params = { seo: seo };
      let user   = request.cookies.Authentication.split(":")[0];
      user == "Admin" 
        ? params.admin = "Admin"
        : {};
    // Validate authentication cookie
      await ctrl.validateCookie(request, reply);
    
    // Validation
      let isbn    = request.query.isbn;
      let result  = await db.getUser(user);
      let id_user = result[0].id;
      let rents   = await db.getUserRents(id_user);
      
      // Find if user has rents
        if( rents.length == 0 ){
          console.error("User doesn't have rent");
          params.error = "Usuário não possui aluguel";
          params.rents = rents;
          reply.view("/src/pages/home.hbs", params);
          return;
        }
    
      // Find if user rented this book
        if( !rents.map( function(rent){return rent.isbn == isbn;} ).filter(Boolean)[0] ){
          console.error("User didn't rent this book");
          params.error = "Usuário não alugou esse livro";
          params.rents = rents;
          reply.view("/src/pages/home.hbs", params);
          return;
        }
    
    // Deletion
      // Delete rent
        await db.deleteRent(id_user, isbn);
      // Update Books
        result = await db.getBook(isbn);
        let name     = result[0].name;
        let quantity = result[0].quantity + 1;
        await db.updateBook(isbn, quantity);
    
    // GET user rents
      params.rents = await db.getUserRents(id_user);
    // Success
      console.log(`User: ${user} returned book: ${name}`);
      reply.view("/src/pages/home.hbs", params);
  }
  
}