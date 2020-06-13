const OBJETOS_MODELO = 'objeto';
var constructorConsulta = require('../util/ConstructorConsultaUtil');

class ServicioObjeto{
  constructor(conexionBd){
    this.bd = conexionBd;
  }

  encontrarObjetos(filtro,cb){
    let consulta = this.bd.collection(OBJETOS_MODELO);

    constructorConsulta.construirConFiltros(consulta,filtro, (consultaFinal,ultimo) => {
      //Se ordena por fecha descendente y paginacion de
      if(ultimo){
        consultaFinal = consultaFinal.orderBy('fechaEncontrado','desc').startAfter(ultimo)
      }else{
        consultaFinal = consultaFinal.orderBy('fechaEncontrado','desc')

      }
      consultaFinal.get().then(function (resultado){
        let objetos = [];
        resultado.forEach(function (objeto){
          let data = objeto.data()
          data.id = objeto.id;
          objetos.push(data);
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
