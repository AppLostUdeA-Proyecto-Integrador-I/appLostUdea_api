var app = require("../../server/server");
const admin = require("firebase-admin");
const USUARIOXNOTIFICACION_COLECCION = "usuarioXnotificacion";

class ServicioNotificacion {
  constructor() {
    this.bd = admin.firestore();
  }

  guardarNotificacion(notificacion, cb) {
    var notificacionModel = app.models.notificacion;
    notificacionModel.create(notificacion, (err, modelo) => {
      if (err) {
        console.log("No se pudo crear la notificación " + err);
        cb(err, null);
      } else {
        cb(null, modelo);
      }
    });
  }

  asociarNotificacionAUsuarios(idNotificacion) {
    var usuarioModel = app.models.Usuario;
    var usuarioXnotificacionModel = app.models.usuarioXnotificacion;

    usuarioModel.find((err, usuarios) => {
      usuarios.forEach((usuario) => {
        var usuarioXnotificacion = {
          usuarioId: usuario.id,
          notificacionId: idNotificacion,
          leido: false,
        };
        usuarioXnotificacionModel.create(
          usuarioXnotificacion,
          (err, modelo) => {
            if (err) {
              console.log(
                "No se pudo asociar la notificacion " +
                  usuarioXnotificacion.notificacionId +
                  " al usuario " +
                  usuarioXnotificacion.usuarioId +
                  " " +
                  err
              );
            }
          }
        );
      });
    });
  }

  /*Metodo que retorna en su callback "cb" las notificiaciones que pertenecen a un "usuarioId",
  o las notificiones leidas o no leidas por medio del parametro opcional "leido"   */
  obtenerNotificaciones(usuarioId, leido, cb) {
    var notificacionModel = app.models.notificacion;
    var usuario = app.models.usuario;
    var notificaciones = [];
    var notificacionesData = [];

    usuario.findById(usuarioId, (err, usuario) => {
      if (err) {
        console.log("No se pudo obtener el usuario " + usuarioId + " " + err);
      }

      if (usuario == undefined || usuario == null) {
        cb({ mensaje: "El usuario no existe" },null );
        return;
      } else {
        var consulta = this.bd
          .collection(USUARIOXNOTIFICACION_COLECCION)
          .where("usuarioId", "==", usuarioId);

        if (leido || leido != null) {
          consulta = consulta.where("leido", "==", leido);
        }

        consulta
          .get()
          .then((notificacionesId) => {
            if (notificacionesId.empty) {
              cb(null, notificaciones);
            } else {
              notificacionesId.forEach((res) => {
                notificaciones.push(res.data().notificacionId);
              });

              notificaciones.forEach((item, ind, array) => {
                notificacionModel.findById(item, (err, notificacion) => {
                  if (err) {
                    console.log(
                      "No se puede obtener la notificacion " +
                        res.data().notificacionId +
                        " " +
                        err
                    );
                  } else {
                    notificacionesData.push(notificacion);
                  }
                  if (ind == array.length - 1) {
                    cb(null, notificacionesData);
                  }
                });
              });
            }
          })
          .catch((err) => {
            console.log(
              "No se pudo retornar las notificaciones del usuario " +
                usuarioId +
                " " +
                err
            );
            cb(err, null);
          });
      }
    });
  }
}
module.exports = ServicioNotificacion;
