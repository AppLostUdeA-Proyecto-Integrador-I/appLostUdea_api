const admin = require("firebase-admin");
var ServicioToken = require("../servicios/ServicioToken");
var ServicioNotificacion = require("../servicios/ServicioNotificacion");

var app = require('../../server/server');
const timestamp = require('time-stamp');

//Envia las notificaciones usando Firebase Cloud Messaging
exports.enviarNotificacion = (mensaje) => {
  var servicioToken = new ServicioToken();
  var servicioNotificacion = new ServicioNotificacion();

  const notificacion = {
    data : mensaje,
    fecha: Date.now()
  }
  //se guarda en BD
  servicioNotificacion.guardarNotificacion(notificacion,(err,resp) =>{
   if(err){
     console.log("No se pudo guardar la notificación " + err)
   }else{
    //Se asocia a los usuarios que permiten notificaciones
    servicioNotificacion.asociarNotificacionAUsuarios(resp.id,true,()=>{
      servicioToken.encontrarTokens(respuesta => {
        console.log(respuesta);
        const notificacionBody = {
          notification: {
            title: mensaje.title,
            body: mensaje.body,
            click_action:"/notificaciones"
          },
          data: mensaje
        };

        admin.messaging().sendToDevice(respuesta,notificacionBody).then(response => {
            console.log(response.successCount + " messages were sent successfully");
          });

      });

    });
    // Se asocia la notificacion a los usuarios que no aceptan notificaciones
    servicioNotificacion.asociarNotificacionAUsuarios(resp.id,false);

   }
  })

};
