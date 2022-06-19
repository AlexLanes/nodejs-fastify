const ctrl = require("./ctrlCookie.js");
const seo  = require("../util/seo.json");
const db   = require("../database/sqlite.js");

module.exports = {
  
  listen: async(fastify) => {
    fastify.post("/create/book", module.exports.createBook);
  },
  
  createBook: async(request, reply) => {
    console.log("exec createBook");
    // Parameters
      let params = { seo: seo };
    // Validate authentication cookie
      await ctrl.validateCookie(request, reply);
    
    // Variables
      const isbn     = request.body.isbn;
      const name     = request.body.name;
      const author   = request.body.author;
      const quantity = request.body.quantity;
    
    // Validate ISBN
      // Length
        if( isbn.length != 10 ){
          params.error = "ISBN deve possuir 10 caracteres";
          reply.view("/src/pages/home.hbs", params);
          return;
        }
      
      // Value
    
      // Duplication
        var result = db.getBook(isbn);
        if( result.length != 0 ){
          params.error = "ISBN Duplicado";
          reply.view("/src/pages/home.hbs", params);
          return;
        }
    
    // Validate Name
      // Length
        if( name.length < 1 || name.length > 20 ){
          params.error = "Nome deve possuir entre 1 e 20 caracteres";
          reply.view("/src/pages/home.hbs", params);
          return;
        }
      // Duplication
        result = db.getBook(name);
        if( result.length != 0 ){
          params.error = "Livro já existente";
          reply.view("/src/pages/home.hbs", params);
          return;
        }
    
    // Validate Author
      if( author.length < 1 || author.length > 20 ){
        params.error = "Autor deve possuir entre 1 e 20 caracteres";
        reply.view("/src/pages/home.hbs", params);
        return;
      }
    
    // Success
      params.rents = await db.getUserRents(1)
      await db.createBook(isbn, name, author, quantity);
      reply.view("/src/pages/home.hbs", params);
  }

}