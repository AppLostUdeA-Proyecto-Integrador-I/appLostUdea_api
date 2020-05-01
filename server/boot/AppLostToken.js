var ServicioToken = require("../servicios/ServicioToken");

module.exports = function(app) {
  var Token = app.models.Token;
  var servicioToken = new ServicioToken();

//Método de loopback que se sobreescribio para la creación del token en la BD
  Token.create = function(data, arg, cb) {
    servicioToken.existeToken(data,(existe)=>{
      if(!existe){
        servicioToken.crearToken(data, function(err, obj) {
          if (err) {
            cb(err, null);
          } else {
            cb(null, obj);
          }
        });
      }else{
        cb(null,{mensaje:"Token ya existe"});
      }
    })

  };
};
