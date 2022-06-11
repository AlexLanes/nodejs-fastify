const seo = require("../seo.json");
const db  = require("../sqlite.js");
var servidor = null

module.exports = {
  
  listen: async(servidor) => {
    // GET / 
    servidor.get("/", module.exports.showLogin);
    // POST /
    servidor.post("/", module.exports.validateLogin);
  },
  
  showLogin: async(request, reply) => {
    console.log("exec showLogin");
    // params
      let params = { seo: seo };
    // Show index.hbs
      reply.view("/src/pages/index.hbs", params);
  },
  
  validateLogin: async(request, reply) => {
    console.log("exec validateLogin");
    // params
      let params = { seo: seo };
    
    // Validate Length
      let user = request.body.user;
      if( user.length < 1 || user.length > 20 ){
        console.error("Usuário deve possuir entre 1 e 20 Caracteres")
        params.error = "Usuário deve possuir entre 1 e 20 Caracteres";
        reply.view("/src/pages/index.hbs", params);
        return;
      }
      let password = request.body.password;
      if( password.length < 1 || password.length > 20 ){
        console.error("Senha deve possuir entre 1 e 20 Caracteres")
        params.error = "Senha deve possuir entre 1 e 20 Caracteres";
        reply.view("/src/pages/index.hbs", params);
        return;
      }
      
    // Validate Database
      let result = await db.getUser(user, password);
      if( result.length === 0 ){
        console.error("Usuário ou Senha incorreto")
        params.error = "Usuário ou Senha incorreto";
        reply.view("/src/pages/index.hbs", params);
        return;
      }
    // Success
      console.log(`User: ${user} successfully logged in`);
  }
  
};