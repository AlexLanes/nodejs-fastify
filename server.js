/**
 * This is the main server script that provides the API endpoints
 * The script uses the database helper in /src
 * The endpoints retrieve, update, and return data to the page handlebars files
 *
 * The API returns the front-end UI handlebars pages, or
 * Raw json if the client requests it with a query parameter ?raw=json
**/

// Utilities we need
const fs = require("fs");
const path = require("path");
// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false
});
// Setup our static files
fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "public"),
  prefix: "/" // optional: default '/'
});
// fastify-formbody lets us parse incoming forms
fastify.register(require("fastify-formbody"));
// point-of-view is a templating manager for fastify
fastify.register(require("point-of-view"), {
  engine: {
    handlebars: require("handlebars")
  }
});

// Load and parse SEO data
const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}

// We use a module for handling database operations in /src
const data = require("./src/data.json");
const db = require("./src/" + data.database);





//
// .evn CONTROLLERS Dependency Injection
//
let nomesCtrl = process.env.CONTROLLERS.split(", "); 
for(let i = 0; i < nomesCtrl.length; i++) {
  let path = "./src/controllers/" + nomesCtrl[i] + ".js";
  let ctrl = require(path);
  console.log("CONTROLLER injected: " + path);
  ctrl.configurar(fastify);
}

 

// Run the server and report out to the logs
fastify.listen(process.env.PORT, '0.0.0.0', function(err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Your app is listening on ${address}`);
  fastify.log.info(`server listening on ${address}`);
});