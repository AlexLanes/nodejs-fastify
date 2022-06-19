const seo = require("../util/seo.json");

module.exports = {
  
  listen: async(fastify) => {
    fastify.get("/login", module.exports.viewLogin);
    fastify.get("/", module.exports.viewLogin);
  },
  
  viewLogin: async(request, reply) => {
    console.log("exec viewLogin");
    // Parameters
      let params = { seo: seo };
    
    // View login.hbs
      reply.view("/src/pages/login.hbs", params)
           .clearCookie('Authentication', {
              domain: `${process.env.PROJECT_DOMAIN}.glitch.me`,
              path: '/',
              secure: true,
              sameSite: 'lax',
              httpOnly: true
            });
  }
  
};