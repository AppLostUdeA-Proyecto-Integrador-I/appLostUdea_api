const COLECCION_TOKENS = "token";
const admin = require("firebase-admin");

class ServicioToken {
  constructor() {
    this.bd = admin.firestore();
  }

  /*
  Recorre los documentos de la colección TOKEN y captura su atributo valor,
  los guarda en el array "tokens", el cual es enviado como respuesta al "cb"
  retornando asi, la lista de tokens encontrados en la BD.
   */
  encontrarTokens(cb) {
    let tokensRef = this.bd.collection(COLECCION_TOKENS);
    let tokens = [];
    tokensRef
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          tokens.push(doc.data().valor);
        });
        cb(tokens);
      })
      .catch((err) => {
        console.log("Error obteniendo los dispositivos", err);
      });
  }

  /*
  Por medio del parametro "data" recibe el token generado desde firebase,
  lo almacena en la colección TOKEN de la bd
  Y retorna en el parametro "cb", el id del token creado.
  */
  crearToken(data, cb) {
    this.bd
      .collection(COLECCION_TOKENS)
      .add(data)
      .then((token) => {
        cb(null, token.id);
      })
      .catch((err) => {
        console.log(err);
        cb(err, null);
      });
  }

  /*
  Recibe el token por el parametro "data", consulta en la BD si dicho "usuarioID" y "valor"
  ya existen en la colección TOKEN. Retorna al "cb" un booleano si ya existe o no el token.
  */
  existeToken(data, cb) {
    let tokensRef = this.bd.collection(COLECCION_TOKENS);
    tokensRef
      .where("usuarioId", "==", data.usuarioId)
      .where("valor", "==", data.valor)
      .get()
      .then(function (resultado) {
        if (resultado.empty) {
          cb(false);
        } else {
          cb(true);
        }
      })
      .catch((err) => {
        cb(false);
      });
  }
}
module.exports = ServicioToken;
