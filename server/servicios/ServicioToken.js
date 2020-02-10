const COLECCION_TOKENS = 'fcmTokens';
const admin = require("firebase-admin");


class ServicioToken{
  constructor(){
    this.bd = admin.firestore();
  }

  encontrarTokens(cb) {
    let tokensRef = this.bd.collection(COLECCION_TOKENS);
    let tokens = [];
    tokensRef
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          tokens.push(
            doc.data().user001
          );
        });
       cb(tokens);
      })
      .catch(err => {
        console.log("Error obteniendo los dispositivos", err);
      });
  };
}
  module.exports = ServicioToken;
