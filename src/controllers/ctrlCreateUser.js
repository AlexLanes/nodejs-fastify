const seo    = require("../seo.json");
const db     = require("../sqlite.js");
const crypto = require("crypto-js");

module.exports = {
  
  listen: async(servidor) => {
    // GET on /registration
    servidor.get("/registration", module.exports.viewRegistration);
    // POST on /registration
    servidor.post("/registration", module.exports.validateRegistration);
  },
  
  viewRegistration: async(request, reply) => {
    console.log("exec viewRegistration");
    // params
      let params = { seo: seo };
    // Show registration.hbs
      reply.view("/src/pages/registration.hbs", params);
  },
  
  validateRegistration: async(request, reply) => {
    console.log("exec validateRegistration");
    // params
      let params = { seo: seo };
    
    // Validate Length
      // user
        let user = request.body.user;
        if( user.length < 1 || user.length > 20 ){
          console.error("User must have between 1 and 20 character")
          params.error = "Usuário deve possuir entre 1 e 20 Caracteres";
          reply.view("/src/pages/registration.hbs", params);
          return;
        }
      // password
        let password = request.body.password;
        if( password.length < 1 || password.length > 20 ){
          console.error("Password must have between 1 and 20 character")
          params.error = "Senha deve possuir entre 1 e 20 Caracteres";
          reply.view("/src/pages/registration.hbs", params);
          return;
        }
    
    // Special Caracter Exception
      if( user.includes(":") || password.includes(":") ){
        console.error("Special character not allowed")
        params.error = "Caracter especial não permitido";
        reply.view("/src/pages/registration.hbs", params);
        return;
      }
      
    // Database
      // Find if user exists
        let result = await db.getUser(user);
        if( result.length != 0 ){
          console.error("User already exists")
          params.error = "Usuário já existente";
          reply.view("/src/pages/registration.hbs", params);
          return;
        }
      // Encrypt Password
        password = crypto.AES.encrypt(password, process.env.AES_Salt).toString();
      // Insert user in the database
        await db.createUser(user, password);
    
    //Success
      console.log(`User: ${user} successfully created`);
      reply.view("/src/pages/login.hbs", params);
  }
  
};