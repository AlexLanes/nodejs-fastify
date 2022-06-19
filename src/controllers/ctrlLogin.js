const crypto = require("crypto-js");
const seo    = require("../util/seo.json");
const db     = require("../database/sqlite.js");

module.exports = {
  
  listen: async(fastify) => {
    fastify.post("/login", module.exports.validateLogin);
  },
  
  validateLogin: async(request, reply) => {
    console.log("exec validateLogin");
    // Parameters
      let params = { seo: seo };    
      
    // Validation
      let user     = request.body.user;
      let password = request.body.password;
      let result   = await db.getUser(user);
      
      // User exists
        if( result.length == 0 ){
          console.error("User does not exists")
          params.error = "Usuário inexistente";
          reply.view("/src/pages/login.hbs", params);
          return;
        }
    
      // Password is correct
        if( crypto.AES.decrypt(result[0].password, process.env.AES_Salt).toString(crypto.enc.Utf8) != password ){
          console.error("Wrong Password")
          params.error = "Senha incorreta";
          reply.view("/src/pages/login.hbs", params);
          return;
        }
    
    // GET books
      params.books = await db.getBooks();
    // Success
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