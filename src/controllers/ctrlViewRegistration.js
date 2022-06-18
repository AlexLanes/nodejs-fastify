const seo = require("../util/seo.json");

module.exports = {
  
  listen: async(fastify) => {
    fastify.get("/registration", module.exports.viewRegistration);
  },
  
  viewRegistration: async(request, reply) => {
    console.log("exec viewRegistration");
    // Parameters
      let params = { seo: seo };
    
    // View registration.hbs
      reply.view("/src/pages/registration.hbs", params);
  }
  
};