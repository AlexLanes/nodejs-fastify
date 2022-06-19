const ctrl = require("./ctrlCookie.js");
const seo  = require("../util/seo.json");
const db   = require("../database/sqlite.js");
var params = { seo: seo };

module.exports = {
  
  listen: async(fastify) => {
    fastify.get("/home", module.exports.viewHome);
  },
  
  viewHome: async(request, reply) => {
    console.log("exec viewHome");
    // Validate authentication cookie
      await ctrl.validateCookie(request, reply);

    // Variables
      let [user, password] = request.cookies.Authentication.split(":");
      let result, user_id;
    
    // User 
      // ID
        result  = await db.getUser(user);
        user_id = result[0].id;
      // Rents
        result  = await db.getUserRents(user_id);

    // Success
      // Parameters
        user == "Admin" 
          ? params.admin = "Admin"
          : {};
        params.rents = result;
      // Reply
        reply.view("/src/pages/home.hbs", params);
  }
  
}