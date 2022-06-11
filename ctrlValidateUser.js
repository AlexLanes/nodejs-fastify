const seo = require("./src/seo.json");
var servidor = null

module.exports = {
  
  processLogin: async (request, reply) => {
    console.log("exec processLogin");
    let user = request.body.user;
    let password = request.body.password;
    return user + password;  
  }
  
};