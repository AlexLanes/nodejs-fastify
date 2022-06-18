const crypto = require("crypto-js");
const seo    = require("../util/seo.json");
const ctrl   = require("./ctrlViewBooks.js");
const db     = require("../database/sqlite.js");

module.exports = {
  
  listen: async(app) => {
    app.post("/", module.exports.validateLogin);
  },
  
  validateLogin: async(request, reply) => {
    console.log("exec validateLogin");
    // Parameters
      let params = { seo: seo };    
      
    // Validate Database
      let user     = request.body.user;
      let password = request.body.password;
      let result   = await db.getUser(user);
      
      // Find if user exists
        if( result.length === 0 ){
          console.error("User does not exists")
          params.error = "Usuário inexistente";
          reply.view("/src/pages/login.hbs", params);
          return;
        }
    
      // Find if password corresponds to user
        if( crypto.AES.decrypt(result[0].password, process.env.AES_Salt).toString(crypto.enc.Utf8) != password ){
          console.error("Wrong Password")
          params.error = "Senha incorreta";
          reply.view("/src/pages/login.hbs", params);
          return;
        }
    
    // Cookie Creation
      password = crypto.AES.encrypt(password, process.env.AES_Salt).toString();
      let credential = `${user}:${password}`;
      reply.setCookie('Authentication', credential, {
        domain: `${process.env.PROJECT_DOMAIN}.glitch.me`,
        path: '/',
        maxAge: 60 * 22, // 22 minutes
        secure: true,
        sameSite: 'lax',
        httpOnly: true
      });
      request.cookies.Authentication = credential;
    
    // Success
      console.log(`User: ${user} successfully logged in`);
      await ctrl.viewBooks(request, reply);
  }
  
};