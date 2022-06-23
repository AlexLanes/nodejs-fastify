const ctrl = require("./ctrlCookie.js");
const req  = require('request');

module.exports = {
  
  listen: async(fastify) => {
    fastify.post("/validate/image", module.exports.validateImage);
  },
  
  validateImage: async(request, reply) => {
    console.log("exec validateImage");
    // Validate authentication cookie
      await ctrl.validateCookie(request, reply);
    // is Admin ?
      if( request.cookies.Authentication.split(":")[0] != "Admin" ){
        return { error: "Apenas admin está autorizado a validar imagem" };
      }
    
    let json = JSON.parse(request.body);
    //let json = {link: "https://cdn.glitch.global/5cae7ba4-28a0-48b1-a944-4342e30bbaf1/No_image_available.svg?v=1655962375444"}
    req(json.link, function (error, response, body) {
                     if( response.statusCode == 200 ){
                       //console.log(response.statusCode);
                       return reply.send({ ok: true,  link: json.link });
                     } else {
                       //console.log(response.statusCode);
                       return reply.send({ ok: false, link: process.env.IMAGE_UNAVAILABLE });
                     }
                   }
    );
  }
  
}