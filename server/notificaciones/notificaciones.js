const admin = require("firebase-admin");
var ServicioToken = require("../servicios/ServicioToken");
var ServicioNotificacion = require("../servicios/ServicioNotificacion");

var app = require('../../server/server');
const timestamp = require('time-stamp');

exports.enviarNotificacion = (mensaje) => {
  var servicioToken = new ServicioToken();
  var servicioNotificacion = new ServicioNotificacion();

  const notificacion = {
    data : mensaje,
    fecha: timestamp()
  }
  servicioNotificacion.guardarNotificacion(notificacion,(err,resp) =>{
   if(err){
     console.log("No se pudo guardar la notificación " + err)
   }else{
    servicioNotificacion.asociarNotificacionAUsuarios(resp.id);
   }
  })
  servicioToken.encontrarTokens(respuesta => {
    console.log(respuesta);
    const notificacionBody = {
      notification: {
        title: mensaje.title,
        body: mensaje.body,
        click_action:"/home"
      },
      data: mensaje
    };

    admin.messaging().sendToDevice(respuesta,notificacionBody).then(response => {
        console.log(response.successCount + " messages were sent successfully");
      });

  });
};
