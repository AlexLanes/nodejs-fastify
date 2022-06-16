const seo    = require("../json/seo.json");
const db     = require("../javascript/sqlite.js");
const ctrl   = require("./ctrlViewBooks.js");
const crypto = require("crypto-js");

module.exports = {
  
  listen: async(servidor) => {
    // GET on root 
    servidor.get("/", module.exports.viewLogin);
    // POST on root
    servidor.post("/", module.exports.validateLogin);
  },
  
  viewLogin: async(request, reply) => {
    console.log("exec viewLogin");
    // params
      let params = { seo: seo };
    // Show login.hbs
      reply.view("/src/pages/login.hbs", params).
            clearCookie('Authentication', {
              domain: `${process.env.PROJECT_DOMAIN}.glitch.me`,
              path: '/',
              secure: true,
              sameSite: 'lax',
              httpOnly: true
            });
  },
  
  validateLogin: async(request, reply) => {
    console.log("exec validateLogin");
    // params
      let params = { seo: seo };    
      
    // Validate Database
      let user     = request.body.user;
      let password = request.body.password;
      let result   = await db.getUser(user);
      
      // Find if user exists
        result = await db.getUser(user);
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