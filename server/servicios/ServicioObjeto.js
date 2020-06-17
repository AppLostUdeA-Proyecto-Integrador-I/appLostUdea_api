const OBJETOS_MODELO = "objeto";
var constructorConsulta = require("../util/ConstructorConsultaUtil");
const admin = require("firebase-admin");

class ServicioObjeto {
  constructor(conexionBd) {
    this.bd = conexionBd;
  }

  encontrarObjetos(filtro, cb) {
    let consulta = this.bd.collection(OBJETOS_MODELO);

    constructorConsulta.construirConFiltros(
      consulta,
      filtro,
      OBJETOS_MODELO,
      (consultaFinal, ultimo) => {
        //Se ordena por fecha descendente y paginacion de
        if (ultimo) {
          consultaFinal = consultaFinal
            .orderBy("fechaEncontrado", "desc")
            .startAfter(ultimo);
        } else if (filtro && !filtro.where) {
          consultaFinal = consultaFinal.orderBy("fechaEncontrado", "desc");
        }
        consultaFinal
          .get()
          .then(function (resultado) {
            let objetos = [];
            if (resultado.exists) {
              let data = resultado.data();
              data.id = resultado.id;
              if(typeof data.fechaEncontrado !== "string"){
                data.fechaEncontrado = data.fechaEncontrado.toDate()
              }
              objetos.push(data);
            } else {
              resultado.forEach(function (objeto) {
                let data = objeto.data();
                if(typeof data.fechaEncontrado !== "string"){
                  data.fechaEncontrado = data.fechaEncontrado.toDate()
                }
                data.id = objeto.id;
                objetos.push(data);
              });
            }
            cb(objetos);
          })
          .catch((err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Error obteniendo los datos");
            }
          });
      }
    );
  }

  crear(data, cb) {
    data.fechaEncontrado =  admin.firestore.Timestamp.fromDate(new Date(data.fechaEncontrado))
    this.bd
      .collection(OBJETOS_MODELO)
      .add(data)
      .then((obj) => {
        cb(null, obj.id);
      })
      .catch((err) => {
        console.log(err);
        cb(err, null);
      });
  }
}
module.exports = ServicioObjeto;
