const ctrl = require("./ctrlCookie.js");
const seo  = require("../util/seo.json");
const db   = require("../database/sqlite.js");
var params = { seo: seo };

module.exports = {
  
  listen: async(fastify) => {
    fastify.post("/create/book", module.exports.createBook);
  },
  
  createBook: async(request, reply) => {
    console.log("exec createBook");
    // Validate authentication cookie
      await ctrl.validateCookie(request, reply);
    
    // Variables
      let [user, password] = request.cookies.Authentication.split(":");
      let isbn     = request.body.isbn;
      let name     = request.body.name;
      let author   = request.body.author;
      let pages    = request.body.pages;
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
        function validateISBN(isbn){ 
          if( typeof(isbn) != "string" || isbn.length  != 10 ){ 
            return false 
          };
          isbn = isbn.split("").map( function(char){ 
            return parseInt( char.replace(/X/i, "10") );
          });
          let sum = 0;
          isbn.forEach( (number, index) => 
            sum += number * (10 - index) 
          );
          return sum % 11 == 0;
        };
        if( !validateISBN(isbn) ){
          console.error("Create book validation");
          params.message = { error: "ISBN inválido" };
          reply.view("/src/pages/home.hbs", params);
          return;
        }      
      // ISBN duplication
        result = await db.getBook(isbn);
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
        result = await db.getBookName(name);
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
      // Pages
        if( pages < 1 ){
          console.error("Create book validation");
          params.message = { error: "Pagina não pode ser menor que 1" };
          reply.view("/src/pages/home.hbs", params);
          return;
        }
      // Quantity
        if( quantity < 1 ){
          console.error("Create book validation");
          params.message = { error: "Quantidade não pode ser menor que 1" };
          reply.view("/src/pages/home.hbs", params);
          return;
        }
    
    // Creation
      try {
        await db.createBook(isbn, name, author,pages, quantity);
        
      } catch {
        // Error
          // Parameters
            params.message = { error: "Erro interno, veja o log para detalhes" };
          // Reply
            console.error(`Create book internal error`);
            reply.view("/src/pages/home.hbs", params);
      }
    
    // Success
      // Parameters
        params.message = { success: "Livro criado com sucesso" };
      // Reply
        console.log(`Book: ${name} successfully created`);
        reply.view("/src/pages/home.hbs", params);
  }

}