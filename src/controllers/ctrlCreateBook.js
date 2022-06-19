const ctrl = require("./ctrlCookie.js");
const seo  = require("../util/seo.json");
const db   = require("../database/sqlite.js");

module.exports = {
  
  listen: async(fastify) => {
    fastify.post("/create/book", module.exports.createBook);
  },
  
  createBook: async(request, reply) => {
    console.log("exec createBook");
    // Parameters
      let params = { seo: seo };
    // Validate authentication cookie
      await ctrl.validateCookie(request, reply);
    
    // Variables
      let [user, password] = request.cookies.Authentication.split(":");
      let isbn     = request.body.isbn;
      let name     = request.body.name;
      let author   = request.body.author;
      let quantity = request.body.quantity;
      let result, id_user;
    
    // User
      // ID
        result  = await db.getUser(user);
        id_user = result[0].id; 
      // Rents
        params.rents = await db.getUserRents(id_user);
      // is Admin ?
      user == "Admin" 
        ? params.admin = "Admin"
        : {};
    
    // Validation
      // is Admin ?
        if( user != "Admin" ){
          console.error("Create book validation");
          params.message = { error: "Apenas Admin pode criar livro" };
          reply.view("/src/pages/home.hbs", params);
          return;
        }
      // ISBN length
        if( isbn.length != 10 ){
          console.error("Create book validation");
          params.message = { error: "ISBN deve possuir 10 caracteres" };
          reply.view("/src/pages/home.hbs", params);
          return;
        }
      // ISBN value
    
      // ISBN duplication
        result = db.getBook(isbn);
        if( result.length != 0 ){
          console.error("Create book validation");
          params.message = { error: "ISBN Duplicado" };
          reply.view("/src/pages/home.hbs", params);
          return;
        }
      // Name length
        if( name.length < 1 ){
          console.error("Create book validation");
          params.message = { error: "Nome não pode ser vazio" };
          reply.view("/src/pages/home.hbs", params);
          return;
        }
      // Name duplication
        result = db.getBookName(name);
        if( result.length != 0 ){
          console.error("Create book validation");
          params.message = { error: "Nome duplicado" };
          reply.view("/src/pages/home.hbs", params);
          return;
        }
      // Author length
        if( author.length < 1 ){
          console.error("Create book validation");
          params.message = { error: "Autor não pode ser vazio" };
          reply.view("/src/pages/home.hbs", params);
          return;
        }
      // Quantity length
        if( quantity < 1 ){
          console.error("Create book validation");
          params.message = { error: "Quantidade não pode ser menor que 1" };
          reply.view("/src/pages/home.hbs", params);
          return;
        }
    
    // Creation
      await db.createBook(isbn, name, author, quantity);
    
    // Success
      // Parameters
        params.message = { success: "Livro criado com sucesso" };
      // Reply
        console.log(`Book: ${name} successfully created`);
        reply.view("/src/pages/home.hbs", params);
  }

}