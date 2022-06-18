const ctrl = require("./ctrlCookie.js");
const seo  = require("../util/seo.json");
const db   = require("../database/sqlite.js");

module.exports = {
  
  listen: async(fastify) => {
    fastify.get("/rent", module.exports.viewRent);
  },
  
  viewRent: async(request, reply) => {
    console.log("exec viewRent");
    // params
      let params = { seo: seo };
    // Validate authentication cookie
      await ctrl.validateCookie(request, reply);
    
    // GET books
      params.books = await db.getBooks();
    // View rent.hbs
      reply.view("/src/pages/rent.hbs", params);
  }
}