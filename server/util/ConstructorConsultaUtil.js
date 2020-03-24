exports.construirConFiltros = function (consulta,filtro,cb){
  if(filtro && filtro != null){
    filtro.forEach(elemento => {
      var llave = Object.keys(elemento)[0];
      var condicion = elemento[llave];
      var operador = Object.keys(condicion)[0];
      var valor = condicion[operador];
      consulta = consulta.where(llave, operador, valor);
     });
  }
  cb(consulta);
}



