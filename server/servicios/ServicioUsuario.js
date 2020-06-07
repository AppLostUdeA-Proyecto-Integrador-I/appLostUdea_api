const COLECCION_USUARIOS = "usuario";
const admin = require("firebase-admin");

class ServicioUsuario {
  constructor() {
    this.bd = admin.firestore();
  }

  //retorna los usuairos que permitan o no permitan notificaicones
  encontrarUsuarios(permiteNotificaciones,cb){
    let usuariosRef = this.bd.collection(COLECCION_USUARIOS);
    let usuarios = [];
    usuariosRef
      .where("permiteNotificaciones", "==", permiteNotificaciones)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          cb(null,[]);
        }else{
          snapshot.forEach((doc) => {
            usuarios.push(doc.data().correo);
          });
          cb(null,usuarios);
        }
      })
      .catch((err) => {
        console.log("Error obteniendo los usuarios", err);
        cb(err,null)
      });
  }

  //retorna el usuario, segun su correo
  encontrarUsuario(correo,cb){
    let usuariosRef = this.bd.collection(COLECCION_USUARIOS);
    let usuario;
    usuariosRef
      .where("correo", "==", correo)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          cb(null,new Object());
        }else{
          snapshot.forEach((doc) => {
            usuario = doc.data()
            usuario.id = doc.id
          });
          cb(null,usuario);
        }
      })
      .catch((err) => {
        console.log("Error obteniendo el usuario " + correo + ": " + err);
        cb(err,null)
      });

  }


}
module.exports = ServicioUsuario;
