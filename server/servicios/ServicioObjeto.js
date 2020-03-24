const OBJETOS_MODELO = 'objeto';
var constructorConsulta = require('../util/ConstructorConsultaUtil');

class ServicioObjeto{
  constructor(conexionBd){
    this.bd = conexionBd;
  }

  encontrarObjetos(filtro,cb){
    let consulta = this.bd.collection(OBJETOS_MODELO);

    constructorConsulta.construirConFiltros(consulta,filtro, (consultaFinal) => {
      consultaFinal.get().then(function (resultado){
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
    })

  }

  crear(data, cb) {
    this.bd.collection(OBJETOS_MODELO).add(data).then(obj => {
      cb(null,obj.id);
    }).catch(err =>{
      console.log(err);
      cb(err,null);
    });

  }
}
module.exports = ServicioObjeto;
