const crypto = require("crypto-js");
const db     = require("./sqlite.js");

module.exports = {
  
  // Validate Authentication Cookie
  cookie: async(Authentication) => {
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
        console.error("Wrong Cookie Value")
        return false;
      }
    // Success
    return true
  },
  
  // Validate Book's ISBN - 10 digits
  isbn: async(ISBN) => {
    // ISBN generator https://generate.plus/en/number/isbn
    var isValid = function(str) {
      // Variaveis
      var sum, weight, digit, check, i;
      // Replace em caracteres indevidos
      str = str.replace(/[^0-9X]/gi, '');
      // Teste se for diferente de 10 digitos
      if (str.length != 10) {
          return false;
      }
      // Inicio
      if (str.length == 10) {
        weight = 10;
        sum = 0;
        for (i = 0; i < 9; i++) {
          digit = parseInt(str[i]);
          sum += weight*digit;
          weight--;
        }
        check = (11 - (sum % 11)) % 11
        if (check == 10) {
            check = 'X';
        }
        return (check == str[str.length-1].toUpperCase());
      }
    }

    if(ISBN == null || ISBN == "" || ISBN == undefined || isValid(ISBN) != true)
      console.error("ISBN Validation Failed");
      return false;

    return true;
  }

}