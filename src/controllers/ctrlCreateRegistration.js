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
      let user     = request.body.user;
      let password = request.body.password;
    
      // Length
        if( password.length <= 3 || user.length <= 3 ){
          console.error("Mininum length required")
          params.error = "Mínimo de 4 caracteres";
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