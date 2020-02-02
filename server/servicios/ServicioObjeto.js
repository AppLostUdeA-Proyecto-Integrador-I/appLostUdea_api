const OBJETOS_MODELO = 'objeto';

class ServicioObjeto{
  constructor(conexionBd){
    this.bd = conexionBd;
  }

  encontrarObjetos(filtro,cb){
    let refColeccion = this.bd.collection(OBJETOS_MODELO);

    var atributo  = [];
    filtro.forEach(elemento => {
     atributo.push(Object.keys(elemento));
     console.log(atributo);
    });
    cb(atributo);

  }
}
module.exports = ServicioObjeto;
