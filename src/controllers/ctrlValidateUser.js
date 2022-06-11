const seo = require("../seo.json");
var servidor = null

module.exports = {
  configurar: async(srv) => {
    // Fastify Server 
    servidor = srv;
    // GET / 
    servidor.get("/", module.exports.showIndex);
    // POST /
    servidor.post("/", module.exports.processLogin);
  },
  
  showIndex: async (request, reply) => {
    let params = { seo: seo };
    // Show index.hbs
    reply.view("/src/pages/index.hbs", params);
  },
  
  processLogin: async (request, reply) => {
    console.log("exec processLogin");
    let user = request.body.user;
    let password = request.body.password;
    console.log(user + password);
    //return user + password;  
  }
  
};