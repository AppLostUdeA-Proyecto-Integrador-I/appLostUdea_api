const admin = require("firebase-admin");
var ServicioToken = require("../servicios/ServicioToken");

exports.enviarNotificacion = (mensaje) => {
  var servicioToken = new ServicioToken();
  servicioToken.encontrarTokens(respuesta => {
    console.log(respuesta);
    const notificacion = {
      data: mensaje
    };

    admin.messaging().sendToDevice(respuesta,notificacion).then(response => {
        console.log(response.successCount + " messages were sent successfully");
      });

  });
};
