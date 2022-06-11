const seo = require("../seo.json");
const db  = require("../sqlite.js");
var servidor = null

module.exports = {
  
  listen: async(servidor) => {
    // GET / 
    servidor.get("/", module.exports.showLogin);
    // POST /
    servidor.post("/", module.exports.validateLogin);
  },
  
  showLogin: async(request, reply) => {
    console.log("exec showLogin");
    let params = { seo: seo };
    // Show index.hbs
    reply.view("/src/pages/index.hbs", params);
  },
  
  validateLogin: async(request, reply) => {
    // On Request
    console.log("exec validateLogin");
    let user = request.body.user;
    let password = request.body.password;
    console.log(user + password);
    // Database
    let all_users = await db.getUsers();
    console.log(all_users);
  }
  
};