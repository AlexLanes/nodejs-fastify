const ctrl = require("./ctrlCookie.js");
const seo  = require("../util/seo.json");
const db   = require("../database/sqlite.js");

module.exports = {
  
  listen: async(fastify) => {
    fastify.get("/home", module.exports.viewHome);
  },
  
  viewHome: async(request, reply) => {
    console.log("exec viewHome");
    // Parameters
      let params = { seo: seo };
    // Validate authentication cookie
      await ctrl.validateCookie(request, reply);

    // User id
      let user    = request.cookies.Authentication.split(":")[0];
      let result  = await db.getUser(user);
      let user_id = result[0].id;
    // User's Rents
      params.rents = await db.getUserRents(user_id);

    // Success
      user == "Admin" 
        ? params.admin = "Admin"
        : {};
      reply.view("/src/pages/home.hbs", params);
  }
  
}