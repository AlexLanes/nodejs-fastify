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
  },

}