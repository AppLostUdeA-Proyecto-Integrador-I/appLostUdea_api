const OBJETOS_MODELO = 'objeto';

class ServicioObjeto{
  constructor(conexionBd){
    this.bd = conexionBd;
  }

  encontrarObjetos(filtro,cb){
    let consulta = this.bd.collection(OBJETOS_MODELO);

    filtro.forEach(elemento => {
     var llave = Object.keys(elemento)[0];
     var condicion = elemento[llave];
     var operador = Object.keys(condicion)[0];
     var valor = condicion[operador];
     console.log(llave);
     console.log(operador);
     console.log(valor);
     consulta = consulta.where(llave, operador, valor);
    });
    consulta.get().then(function (resultado){
      let objetos = [];
      resultado.forEach(function (objeto){
        objeto.data().id = objeto.id;
        objetos.push(objeto.data());
      });
      cb(objetos);
    }).catch((err)=> {
      if (err) {
      console.log(err);
      } else{
        console.log("Error obteniendo los datos");
      }
    });
  }
}
module.exports = ServicioObjeto;
