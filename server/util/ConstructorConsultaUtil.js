
const admin = require("firebase-admin");

exports.construirConFiltros = function (consulta,filter,cb){
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


  //paginacion
  if(filter && filter.paginacion && filter.paginacion != null){
    let pag = filter.paginacion
    if(pag.ultimoElemento){
      let docRef = db.collection('objeto').doc(pag.ultimoElemento)
      docRef.get().then(snapshot => {
        cb(consulta,snapshot);
        return
      })
    }else{
      console.log(consulta)
      cb(consulta)
    }

  }else{
    cb(consulta)
  }
}



