const ctrl = require("./ctrlCookie.js");
const seo  = require("../util/seo.json");
const db   = require("../database/sqlite.js");

module.exports = {
  
  listen: async(fastify) => {
    fastify.get("/rent/end", module.exports.deleteRent);
  },
  
  deleteRent: async(request, reply) => {
    console.log("exec deleteRent");
    // Parameters
      let params = { seo: seo };
    // Validate authentication cookie
      await ctrl.validateCookie(request, reply);
    
    // Deletion
      // ISBN from request
        let isbn = request.query.isbn;
      // User
        let user = request.cookies.Authentication.split(":")[0];
      // ID of user
        let result  = await db.getUser(user);
        let id_user = result[0].id;
      // Delete rent
        await db.deleteRent(id_user, isbn);
      // Update Books
        result = await db.getBook(parseInt(isbn));
        let quantity = result[0].quantity + 1;
        await db.updateBook(isbn, quantity);
    
    // Success
      user == "Admin" 
        ? params.admin = "Admin"
        : {};
      params.rents = await db.getUserRents(id_user);
      console.log(`User: ${request.cookies.Authentication.split(":")[0]} returned a book`);
      reply.view("/src/pages/home.hbs", params);
  }
  
}