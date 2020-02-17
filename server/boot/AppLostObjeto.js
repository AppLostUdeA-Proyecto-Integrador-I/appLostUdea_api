var ServicioObjeto = require("../servicios/ServicioObjeto");
const Notificaciones = require("../notificaciones/notificaciones");

module.exports = function(app) {
  var Objeto = app.models.Objeto;
  var crear = Objeto.create;
  var cache = {};
  var servicioObjeto = new ServicioObjeto(Objeto.getDataSource().connector.db);

  Objeto.find = function(filter, arg, cb) {
    var key = "";
    if (filter) {
      key = JSON.stringify(filter);
    }
    var cachedResults = cache[key];
    if (cachedResults) {
      console.log("serving from cache");
      process.nextTick(function() {
        cb(null, cachedResults);
      });
    } else {
      console.log("serving from db");
      console.log(filter);
      servicioObjeto.encontrarObjetos(filter.filtros, resultado => {
        console.log("Servicio llamado exitosamente");
        cb(null, resultado);
      });
    }
  };

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
