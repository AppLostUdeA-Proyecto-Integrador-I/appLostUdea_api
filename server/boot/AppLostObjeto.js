/**
 * Clase que sobreescribe los métodos remotos para el modelo Objeto
 */

var ServicioObjeto = require("../servicios/ServicioObjeto");
const Notificaciones = require("../notificaciones/notificaciones");

module.exports = function(app) {
  var Objeto = app.models.Objeto;
  var crear = Objeto.create;
  var cache = {};
  var servicioObjeto = new ServicioObjeto(Objeto.getDataSource().connector.db);

  /* Método para encontrar objetos usando filtros.
     Parámetros: filter (Object) objeto json que contiene los filtros de la búsqueda. Requerido
                 arg (Object) configuracion adicional para la búsqueda. No es requerida.
                 cb (funtion) Callback que se invoca con los parámetros (err, retorna la instancia). Requerido*/

  Objeto.find = function(filter, arg, cb) {
    var key = "";
    var filtros;
    if (filter) {
      key = JSON.stringify(filter);
      if(filter.filtros){
        filtros = filter.filtros;
      }
    }
    var cachedResults = cache[key];
    if (cachedResults) {
      console.log("serving from cache");
      process.nextTick(function() {
        cb(null, cachedResults);
      });
    } else {
      console.log("serving from db");
      servicioObjeto.encontrarObjetos(filtros, resultado => {
        console.log("Servicio llamado exitosamente");
        cb(null, resultado);
      });
    }
  };

/* Método para crear objetos.
     Parámetros: data (Object) objeto que contiene los datos del modelo objeto. Requerido
                 arg (Object) configuracion adicional para la creación de un objeto. No es requerido.
                 cb (funtion) Callback que se invoca con los parámetros (err, obj). Requerido*/
  Objeto.create = function(data, arg, cb) {
    servicioObjeto.crear(data, function(err, obj) {
      if (err) {
        cb(err, null);
      } else {
        Notificaciones.enviarNotificacion({
          titulo: "Se reportó un nuevo objeto:",
          texto: data.nombreObjeto
        });
        cb(null, obj);
      }
    });
  };
};
