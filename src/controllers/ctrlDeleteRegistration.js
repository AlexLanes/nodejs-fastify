const ctrl   = require("./ctrlCookie.js");
const home   = require("./ctrlViewHome.js");
const db     = require("../database/sqlite.js");

module.exports = {
  
  listen: async(fastify) => {
    fastify.post("/delete/registration", module.exports.deleteRegistration);
  },
  
  deleteRegistration: async(request, reply) => {
    console.log("exec deleteRegistration");
    // Validate authentication cookie
      await ctrl.validateCookie(request, reply);
    
    // Variables
      let [user, password] = request.cookies.Authentication.split(":");
      let body_id   = request.body.id;
      let body_user = request.body.user;
      let body_pass = request.body.password;
      let result, params;
    
    // Validation
      // Parameters
        params = await home.parameters(request);
      // Length
        if( password.length <= 3 || user.length <= 3 ){
          console.error("Create registration validation ");
          params = await regist.parameters();
          params.message = { error: "Mínimo de 4 caracteres" };
          return reply.view("/src/pages/registration.hbs", params);
        }
      // Special caracter
        if( user.includes(":") || password.includes(":") ){
          console.error("Create registration validation ");
          params = await regist.parameters();
          params.message = { error: "Caracter especial não permitido" };
          return reply.view("/src/pages/registration.hbs", params);
        }
      // Find if user exists
        result = await db.getUser(user);
        if( result.length != 0 ){
          console.error("Create registration validation");
          params = await regist.parameters();
          params.message = { error: "Usuário já existente" };
          return reply.view("/src/pages/registration.hbs", params);
        }
    
    // Deletion
      try {
        // User id
          result  = await db.getUser(user);
          id_user = result[0].id;
        // Delete rent
          await db.deleteRent(id_user, isbn);
        // Update Books
          result = await db.getBook(isbn);
          // Book has not been deleted
          if(result.length != 0){
            name     = result[0].name;
            quantity = result[0].quantity + 1;
            await db.updateBook(isbn, quantity);
          }
        
      } catch {
        // Error
          // Parameters
            params = await home.parameters(request);
            params.message = { error: "Erro interno, veja o log para detalhes" };
          // Reply
            console.error(`Delete rent internal error`);
            return reply.view("/src/pages/home.hbs", params);
      }
    
    // Success
      // Parameters
        params = await home.parameters(request);
        params.message = { success: "Livro devolvido com sucesso" };
      // Reply
        console.log(`User: ${user} returned book: ${name}`);
        return reply.view("/src/pages/home.hbs", params);
  }
  
}