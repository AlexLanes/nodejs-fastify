const crypto = require("crypto-js");
const db     = require("./sqlite.js");

module.exports = {
  
  // Validate Authentication Cookie
  isValid: async(Authentication) => {
    console.log("exec isValid");
    // Don't Exists
      if( Authentication == null || Authentication == undefined ) {
        console.error("User not Authenticated")
        return false;
      }
    // Not Valid
      let credentials = Authentication.split(":");
      let result = await db.getUser(credentials[0]);
      if( result.length === 0 || crypto.AES.decrypt(result[0].password, process.env.AES_Salt).toString(crypto.enc.Utf8) != crypto.AES.decrypt(credentials[1], process.env.AES_Salt).toString(crypto.enc.Utf8) ){
        console.error("Bad Cookie Value")
        return false;
      }
    // Success
    return true
  }

}