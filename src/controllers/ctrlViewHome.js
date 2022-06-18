const seo      = require("../util/seo.json");
const db       = require("../database/sqlite.js");
const validate = require("../database/validate.js");

module.exports = {
  
  listen: async(app) => {
    // GET on /home
    app.get("/home", module.exports.viewHome);
    // POST on /home
    app.post("/home", module.exports.createBook);
  },
  
  viewHome: async(request, reply) => {
    console.log("exec viewHome");
    // params
      let params = request.query.raw ? {} : { seo: seo };
    // Validate Authentication Cookie
      let isValid = await validate.cookie(request.cookies.Authentication);
      if( !isValid ){
        params.error = "Usuário deve se autenticar";
        reply.view("/src/pages/login.hbs", params);
        return;
      }

    // is Admin ?
      let user = request.cookies.Authentication.split(":")[0];
      user == "Admin" 
        ? params.admin = "Admin"
        : {};
    // User id
      let result  = await db.getUser(user);
      let user_id = result[0].id;
    // User's Rents
      params.rents = await db.getUserRents(user_id);

    // Success
      reply.view("/src/pages/home.hbs", params);
  },
  
  createBook: async(request, reply) => {
    console.log("exec createBook");
    // params
      let params = request.query.raw ? {} : { seo: seo, admin: "Admin", rents: await db.getUserRents(1) };
    // Validate Authentication Cookie
      var isValid = await validate.cookie(request.cookies.Authentication);
      if( !isValid ){
        params.error = "Usuário deve se autenticar";
        reply.view("/src/pages/login.hbs", params);
        return;
      }
    
    // Variables
      const isbn     = request.body.isbn;
      const name     = request.body.name;
      const author   = request.body.author;
      const quantity = request.body.quantity;
    
    // Validate ISBN
      // Length
        if( isbn.length != 10 ){
          params.error = "ISBN deve possuir 10 caracteres";
          reply.view("/src/pages/home.hbs", params);
          return;
        }
      // Value
        isValid = await validate.isbn(isbn);
        console.log(isValid);
        if( !isValid ){
          params.error = "ISBN Inválido";
          reply.view("/src/pages/home.hbs", params);
          return;
        }
      // Duplication
        var result = db.getBook(isbn);
        if( result.length != 0 ){
          params.error = "ISBN Duplicado";
          reply.view("/src/pages/home.hbs", params);
          return;
        }
    
    // Validate Name
      // Length
        if( name.length < 1 || name.length > 20 ){
          params.error = "Nome deve possuir entre 1 e 20 caracteres";
          reply.view("/src/pages/home.hbs", params);
          return;
        }
      // Duplication
        result = db.getBook(name);
        if( result.length != 0 ){
          params.error = "Livro já existente";
          reply.view("/src/pages/home.hbs", params);
          return;
        }
    
    // Validate Author
      if( author.length < 1 || author.length > 20 ){
        params.error = "Autor deve possuir entre 1 e 20 caracteres";
        reply.view("/src/pages/home.hbs", params);
        return;
      }
    
    // Success
      await db.createBook(isbn, name, author, quantity);
      reply.view("/src/pages/home.hbs", params);
  }

}