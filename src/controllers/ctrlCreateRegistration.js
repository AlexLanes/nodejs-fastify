const crypto = require("crypto-js");
const seo    = require("../util/seo.json");
const db     = require("../database/sqlite.js");

module.exports = {
  
  listen: async(fastify) => {
    fastify.post("/registration", module.exports.createRegistration);
  },
  
  createRegistration: async(request, reply) => {
    console.log("exec createRegistration");
    // Parameters
      let params = { seo: seo };
    
    // Validation
      // User
        let user = request.body.user;
        if( user.length < 1 || user.length > 20 ){
          console.error("User must have between 1 and 20 character")
          params.error = "Usuário deve possuir entre 1 e 20 Caracteres";
          reply.view("/src/pages/registration.hbs", params);
          return;
        }
    
      // Password
        let password = request.body.password;
        if( password.length < 1 || password.length > 20 ){
          console.error("Password must have between 1 and 20 character")
          params.error = "Senha deve possuir entre 1 e 20 Caracteres";
          reply.view("/src/pages/registration.hbs", params);
          return;
        }
    
      // Special caracter
        if( user.includes(":") || password.includes(":") ){
          console.error("Special character not allowed")
          params.error = "Caracter especial não permitido";
          reply.view("/src/pages/registration.hbs", params);
          return;
        }
      
      // Find if user exists
        let result = await db.getUser(user);
        if( result.length != 0 ){
          console.error("User already exists")
          params.error = "Usuário já existente";
          reply.view("/src/pages/registration.hbs", params);
          return;
        }
      
    // Creation
      // Encrypt password
        password = crypto.AES.encrypt(password, process.env.AES_Salt).toString();
      // Insert user and password in the database
        await db.createUser(user, password);
    
    // Success
      console.log(`User: ${user} successfully created`);
      reply.view("/src/pages/login.hbs", params);
  }
  
};