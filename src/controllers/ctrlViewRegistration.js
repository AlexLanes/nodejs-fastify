const seo  = require("../util/seo.json");
var params = { seo: seo };

module.exports = {
  
  listen: async(fastify) => {
    fastify.get("/registration", module.exports.viewRegistration);
  },
  
  viewRegistration: async(request, reply) => {
    console.log("exec viewRegistration");
    // Success
      // Reply
        reply.view("/src/pages/registration.hbs", params);
  }
  
};