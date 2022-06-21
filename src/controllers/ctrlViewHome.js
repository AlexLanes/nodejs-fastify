const ctrl = require("./ctrlCookie.js");
const seo  = require("../util/seo.json");
const db   = require("../database/sqlite.js");

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
      let result, user_id, params;
    
    // User 
      // ID
        result  = await db.getUser(user);
        user_id = result[0].id;
      // Rents
        result  = await db.getUserRents(user_id);

    // Success
      // Admin view
        if( user == "Admin" ){
          // Parameters
            params = { 
              seo:    seo,
              rents:  result,
              admin:  "Admin",
              users:  await db.getUsers(),
              books0: await db.getBooks0()
            }
          // Reply
            return reply.view("/src/pages/home.hbs", params);
        
      // User view
        } else {
          // Parameters
            params = { 
              seo:   seo,
              rents: result
            };
          // Reply
            return reply.view("/src/pages/home.hbs", params);
        }
  }
  
  
}