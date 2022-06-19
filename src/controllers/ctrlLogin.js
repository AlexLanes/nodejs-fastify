const crypto = require("crypto-js");
const seo    = require("../util/seo.json");
const db     = require("../database/sqlite.js");
var params   = { seo: seo };

module.exports = {
  
  listen: async(fastify) => {
    fastify.post("/login", module.exports.validateLogin);
  },
  
  validateLogin: async(request, reply) => {
    console.log("exec validateLogin");
      
    // Variables
      let user     = request.body.user;
      let password = request.body.password;
      let result;
      
    // Validation
      // User exists
        result = await db.getUser(user);
        if( result.length == 0 ){
          console.error("Login validation");
          params.message = { error: "Usuário inexistente" };
          reply.view("/src/pages/login.hbs", params);
          return;
        }
      // Password is correct
        if( crypto.AES.decrypt(result[0].password, process.env.AES_Salt).toString(crypto.enc.Utf8) != password ){
          console.error("Login validation");
          params.message = { error: "Senha incorreta" };
          reply.view("/src/pages/login.hbs", params);
          return;
        }
    
    // Success
      // Parameters
        params.books   = await db.getBooks();
        params.message = { success: "Seja bem-vindo" };
      // Reply
        console.log(`User: ${user} successfully logged in`);
        password = crypto.AES.encrypt(password, process.env.AES_Salt).toString();
        reply.view("/src/pages/books.hbs", params)
             .setCookie('Authentication', `${user}:${password}`, {
                domain: `${process.env.PROJECT_DOMAIN}.glitch.me`,
                path: '/',
                maxAge: 60 * 222, // 222 minutes
                secure: true,
                sameSite: 'lax',
                httpOnly: true
              });
  }
  
};