"use strict";
var ServicioNotificacion = require("../servicios/ServicioNotificacion");

module.exports = function (Usuario) {

  /* Método que recibe el token y actualiza la información del usuario
    según su respectivo id, luego guarda el usuario actualizado en la BD */
  Usuario.actualizarToken = function (token, id, cb) {
    Usuario.findById(id, (err, data) => {
      if (err) {
        console.log("Error obteniendo el usuario con id " + id);
        cb(err, null);
      } else {
        data.token = token;
        Usuario.replaceById(id, data, (err, usuarioActualizado) => {
          if (err) {
            console.log("Error actualizando el usuario con id " + id);
            cb(err, null);
          } else {
            cb(null, usuarioActualizado);
          }
        });
      }
    });
  };

  Usuario.obtenerNotificaciones = function (id,leido, cb) {
    var servicioNotificacion = new ServicioNotificacion();
    servicioNotificacion.obtenerNotificaciones(id,leido,(err,notificaciones)=>{
      if(err){
        cb(err,null)
      }else{
        cb(null,notificaciones);
      }
    })
  };


  /* Endpoint actualizarToken, al recurso usuario */
  Usuario.remoteMethod("actualizarToken", {
    accepts: [
      { arg: "token", type: "string" },
      { arg: "id", type: "string" },
    ],
    returns: { arg: "usuario", type: "Usuario" },
  });

  Usuario.remoteMethod(
    'obtenerNotificaciones', {
      http: {
        path: '/:id/notificaciones',
        verb: 'get'
      },
      accepts: [
        {arg: 'id', type: 'string', required: true},
        {arg: 'leido', type: 'boolean', required: false, http: {source: 'query'}}
      ],
      returns: {
        arg: 'notificaciones',
        type: 'array'
      }
    }
  )

};
