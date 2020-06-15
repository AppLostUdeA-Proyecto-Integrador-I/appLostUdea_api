
const admin = require("firebase-admin");

exports.construirConFiltros = function (consulta,filter,coleccion,cb){
  var db = admin.firestore();

  //filtros
  if(filter && filter.filtros && filter.filtros != null){
    let filtro = filter.filtros
    filtro.forEach(elemento => {
      var llave = Object.keys(elemento)[0];
      var condicion = elemento[llave];
      var operador = Object.keys(condicion)[0];
      var valor = condicion[operador];
      consulta = consulta.where(llave, operador, valor);
     });
  }

  if(filter && filter.where && filter.where.id){
    consulta = consulta.doc(filter.where.id)
  }
  //paginacion
  if(filter && filter.paginacion && filter.paginacion != null){
    let pag = filter.paginacion
    if(pag.limite){
      consulta = consulta.limit(pag.limite)
    }
    if(pag.ultimoElemento){
      let docRef = db.collection(coleccion).doc(pag.ultimoElemento)
      docRef.get().then(snapshot => {
        cb(consulta,snapshot);
        return
      })
    }else{
      cb(consulta)
    }

  }else{
    cb(consulta)
  }
}



