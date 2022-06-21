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
        if( user == "Admin" ){
          params.admin  = "Admin";
          params.users  = await db.getUsers();
          params.books0 = await db.getBooks0();
        };
        params.rents = result;
      // Reply
        console.log(params);
        return reply.view("/src/pages/home.hbs", params);
  }
  
}