var path = require('path');
var Datastore = require('nedb');

var gui = require('nw.gui');

export default function db(application, models, log_enabled) {
  var prefix = gui.App.dataPath;
  var databases = {};

  log_enabled = log_enabled || true;

  function log(message) {
    if (log_enabled) {
      console.log("DB " + message);
    }
  }

  function create_database(name) {
    var db_path = path.join(prefix, application, name + '.nedb');
    log("Opening file: " + db_path);

    var db = new Datastore({filename: db_path, autoload: true});
    log('Opening ' + name + " database.");
    return db;
  }

  /* Genera todas las bases de datos en base a los modelos. */
  for (var i=0; i<models.length; i++) {
    databases[models[i]] = create_database(models[i]);
  }

  return {
    /*
     * Lista todos los modelos que conoce.
     */
    list: function() {
      return models;
    },

    /*
     * Retorna el diccionario de bases de datos.
     */
    databases: function() {
      return databases;
    },

    /*
     * Agrega un registro a la base de datos indicando el
     * nombre de la colección, por ejemplo:
     *
     *    var doc = {id: 1, titulo: 'grace'};
     *
     *    db.insert('cancion', doc, function(err, newDoc) {
     *        if (err) {console.error(log)};
     *    });
     *
     */
    insert: function(db_name, record, callback) {
      log("creando el registro " + record.id + "en la base de datos " + db_name);
      return databases[db_name].insert(record, callback);
    },

    /*
     * Realiza una búsqueda dentro de una colección.
     */
    find: function(db_name, query, callback) {
      return databases[db_name].find(query, callback);
    },

    /*
     * Actualiza uno o mas registros en base a un query.
     */
    update: function(db_name, query, update, options, callback) {
      return databases[db_name].update(query, update, options, callback);
    },

    /*
     * Elimina uno o mas registros dato un query.
     */
    remove: function(db_name, query, options, callback) {
      return databases[db_name].remove(query, options, callback);
    },


    findOne: function(db_name, query, projection, callback) {
      return databases[db_name].findOne(query, projection, callback);
    }

  };
}
