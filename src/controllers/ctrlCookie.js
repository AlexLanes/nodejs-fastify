const crypto = require("crypto-js");
const seo    = require("../util/seo.json");
const db     = require("../database/sqlite.js");

module.exports = {
  
  listen: async(fastify) => {
    fastify.head("/", module.exports.validateCookie);
  },
  
  // Validate authentication cookie
  validateCookie: async(request, reply) => {
    console.log("exec validateCookie");
    // Parameters
      let params = { seo: seo };  
    
    // Cookie to authenticate
      let Authentication = request.cookies.Authentication;
    
    // Cookie don't exists
      if( Authentication == null || Authentication == undefined || Authentication == "" ) {
        console.error("User not Authenticated");
        params.error = "Usuário deve se autenticar";
        reply.view("/src/pages/login.hbs", params);
        return;
      }
    
    // Cookie not valid
      let [user, password] = Authentication.split(":");
      let result = await db.getUser(user);
      if( result.length == 0 || crypto.AES.decrypt(result[0].password, process.env.AES_Salt).toString(crypto.enc.Utf8) != crypto.AES.decrypt(password, process.env.AES_Salt).toString(crypto.enc.Utf8) ){
        console.error("Wrong Cookie Value");
        params.error = "Usuário deve se autenticar";
        reply.view("/src/pages/login.hbs", params);
        return;
      }
    
    // Success
      return;
  }
  
};