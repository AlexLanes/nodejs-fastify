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
    // On Request
      let user_login = request.body.user;
      if( user_login.length < 1 || user_login.length > 20 ){
        console.error("Usuário deve possuir entre 1 e 20 Caracteres")
        reply.view("/src/pages/index.hbs");
      }
      let user_password = request.body.password;
      if( user_password.length < 1 || user_password.length > 20 ){
        console.error("Senha deve possuir entre 1 e 20 Caracteres")
        alert("Senha deve possuir entre 1 e 20 Caracteres");
      }
      console.log(user_login + user_password);
    // Database
      /*let all_users = await db.getUsers();
      console.log(all_users);
      for( let user of all_users ) {
        console.log( user["user"] );
        console.log( user["password"] );
      }*/
  }
  
};