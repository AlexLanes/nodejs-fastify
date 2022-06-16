const seo      = require("../json/seo.json");
const db       = require("../javascript/sqlite.js");
const validate = require("../javascript/validate.js");

module.exports = {
  
  listen: async(servidor) => {
    // GET on /rent/end
    servidor.get("/rent/end", module.exports.endRent);
    // POST on /rent/end
    //servidor.post("/rent/end", module.exports.endRent);
  },
  
  endRent: async(request, reply) => {
    console.log("exec endRent");
    // params
      let params = request.query.raw ? {} : { seo: seo };
    // Validate Authentication Cookie
      let isValid = await validate.cookie(request.cookies.Authentication);
      if( !isValid ){
        params.error = "Usuário deve se autenticar";
        reply.view("/src/pages/login.hbs", params);
        return;
      }
    
    // Query Parameter
      let isbn = request.query.isbn;
    // is Admin ?
      let user = request.cookies.Authentication.split(":")[0];
      user == "Admin" ? params.admin = "Admin": {};
    // User id
      let result  = await db.getUser(user);
      let id_user = result[0].id;
    // End Rent
      await db.deleteRent(id_user, isbn);
    // Update Books
      result = await db.getBook(parseInt(isbn));
      let quantity = result[0].quantity + 1;
      await db.updateBook(isbn, quantity);
    // New user's Rents
      params.rents = await db.getUserRents(id_user);
    // Success
      console.log(`User: ${request.cookies.Authentication.split(":")[0]} returned a book`);
      reply.view("/src/pages/home.hbs", params);
  }
  
}