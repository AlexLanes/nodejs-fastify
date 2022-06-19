const ctrl = require("./ctrlCookie.js");
const seo  = require("../util/seo.json");
const db   = require("../database/sqlite.js");
var params = { seo: seo };

module.exports = {
  
  listen: async(fastify) => {
    fastify.get("/books", module.exports.viewBooks);
  },
  
  viewBooks: async(request, reply) => {
    console.log("exec viewBooks");
    // Validate authentication cookie
      await ctrl.validateCookie(request, reply);
    
    // Success
      // Parameters
        params.books = await db.getBooks();
      // Reply
        reply.view("/src/pages/books.hbs", params);
  }
  
}