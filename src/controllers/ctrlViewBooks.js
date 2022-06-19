const ctrl = require("./ctrlCookie.js");
const seo  = require("../util/seo.json");
const db   = require("../database/sqlite.js");

module.exports = {
  
  listen: async(fastify) => {
    fastify.get("/books", module.exports.viewBooks);
  },
  
  viewBooks: async(request, reply) => {
    console.log("exec viewBooks");
    // Parameters
      let params = { seo: seo };
    // Validate authentication cookie
      await ctrl.validateCookie(request, reply);
    
    // GET books
      params.books = await db.getBooks();
    // Success
      reply.view("/src/pages/books.hbs", params);
  }
  
}