const seo    = require("../seo.json");
const db     = require("../sqlite.js");
const cookie = require("../validateCookie.js");

module.exports = {
  
  listen: async(servidor) => {
    // GET on /home
    servidor.get("/home", module.exports.viewHome);
    // POST on /home
    servidor.post("/home", module.exports.viewHome);
  },
  
  viewHome: async(request, reply) => {
    console.log("exec viewHome");
    // params
      let params = request.query.raw ? {} : { seo: seo };
    // Validate Authentication Cookie
      let isValid = await cookie.isValid(request.cookies.Authentication);
      if( !isValid ){
        params.error = "Usuário deve se autenticar";
        reply.view("/src/pages/login.hbs", params);
        return;
      }
    
    // is Admin ?
      let user = request.cookies.Authentication.split(":")[0];
      user == "Admin" ? params.admin = "Admin": {};
    // User id
      let result  = await db.getUser(user);
      let id_user = result[0].id;
    // User's Rents
      params.rents = await db.getUserRents(id_user);
    // Success
      reply.view("/src/pages/home.hbs", params);
  },

}