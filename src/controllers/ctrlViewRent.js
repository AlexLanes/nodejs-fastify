const ctrl = require("./ctrlCookie.js");
const seo  = require("../util/seo.json");
const db   = require("../database/sqlite.js");
var params = { seo: seo };

module.exports = {
  
  listen: async(fastify) => {
    fastify.get("/rent", module.exports.viewRent);
  },
  
  viewRent: async(request, reply) => {
    console.log("exec viewRent");
    // Validate authentication cookie
      await ctrl.validateCookie(request, reply);
    
    // Sucess
      // Parameters
        params.books = await db.getBooks();
      // Reply
        reply.view("/src/pages/rent.hbs", params);
  }
}