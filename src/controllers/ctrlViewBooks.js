const seo = require("../seo.json");
const db  = require("../sqlite.js");
var servidor = null

module.exports = {
  
  listen: async(servidor) => {
    // GET on root 
    servidor.get("/books", module.exports.viewBooks);
    // POST on root
    //servidor.post("/books", module.exports.validateLogin);
  },
  
  viewBooks: async(request, reply) => {
    console.log("exec viewBooks");
    // params
      let params = request.query.raw ? {} : { seo: seo };
    // Checking for the authentication cookie
      let Authentication = request.cookies.Authentication;
      if(Authentication == null || Authentication == undefined) {
        params.error = "Usuário deve se autenticar";
        reply.view("/src/pages/login.hbs", params);
        return;
      }
    // Show registration.hbs
      reply.view("/src/pages/books.hbs", params);
  }
  
}