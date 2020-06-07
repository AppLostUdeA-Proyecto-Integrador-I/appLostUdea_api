var ServicioToken = require("../servicios/ServicioToken");
var ServicioUsuario = require("../servicios/ServicioUsuario");

module.exports = function(app) {
  var Token = app.models.Token;
  var usuarioModel = app.models.usuario;
  var servicioToken = new ServicioToken();

//Método de loopback que se sobreescribio para la creación del token en la BD
  Token.create = function(data, arg, cb) {
    const servicioUsuario = new ServicioUsuario();
    servicioToken.existeToken(data,(existe)=>{
      if(!existe){
        servicioToken.crearToken(data, function(err, obj) {
          if (err) {
            cb(err, null);
          } else {
            servicioUsuario.encontrarUsuario(data.usuarioId,function (err,usuario){
              if(err){
                console.log("Error obteniendo usuario " + data.usuarioId + ": "+ err)
              }else{
                usuario.permiteNotificaciones = true
                usuarioModel.replaceById(usuario.id,usuario, function (err){
                  if(err) {
                    console.log("Error actualizando usuario " + data.usuarioId + ": "+ err)
                  }
                })
              }
            })
            cb(null, obj);
          }
        });
      }else{
        cb(null,{mensaje:"Token ya existe"});
      }
    })

  };
};
