import Ember from 'ember';

let VERSION_DEL_FORMATO_DE_ARCHIVO = 1;

export default Ember.Component.extend({
  classNames: 'desafio-panel-derecho',
  ejecutando: false,
  cola_deshacer: [],
  data_observar_blockly: false,
  actividad: null,
  environment: Ember.inject.service(),
  abrirConsignaInicial: false,
  solucion: null,
  pilas: null,          // Se espera que sea una referencia al servicio pilas.
  codigoJavascript: "", // Se carga como parametro
  persistirSolucionEnURL: true,
  debeMostrarFinDeDesafio: false,

  twitter: Ember.inject.service(),
  previewData: null, // representa la imagen previsualización del dialogo para twittear.
  mensajeCompartir: 'Comparto mi solución de Pilas Bloques',
  compartirEnCurso: false,
  //browser: Ember.inject.service(),

  anterior_ancho: -1,
  anterior_alto: -1,

  blockly_toolbox:    [ {
      category: '...',
      blocks: []
  }],

  blockly_workspace: Ember.computed(function() {

    let workspace_inicial = `
      <xml xmlns="http://www.w3.org/1999/xhtml">
        <block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0">
        </block>
      </xml>';
    `;

    if (this.get('codigo')) {
      return atob(this.get('codigo'));
    } else {
      return workspace_inicial;
    }

  }),


  inyectarRedimensionado: Ember.on('init', function() {

    // Muestra el dialogo inicial si está definida la consigna inicial.
    if (this.get('actividad.actividad.consignaInicial')) {
      Ember.run.later(() => {
        this.set('abrirConsignaInicial', true);
      });
    }

  }),


  didInsertElement() {

    if (!this.get('actividad')) {
      return null;
    }

    this.get('actividad').crear_bloques_iniciales();

    var event = new Event('terminaCargaInicial');
    window.dispatchEvent(event);


    Ember.run.scheduleOnce('afterRender', () => {
      this.set('blockly_toolbox', this.get('actividad').obtenerLenguaje());
      this.set('blockly_comments', this.get('actividad.puedeComentar'));
      this.set('blockly_disable', this.get('actividad.puedeDesactivar'));
      this.set('blockly_duplicate', this.get('actividad.puedeDuplicar'));
    });


    if (this.get("persistirSolucionEnURL")) {
      Blockly.getMainWorkspace().addChangeListener(() => {
        this.guardarEnURL();
        this.generarCodigoTemporal();
      });
    }

    if (this.get("debeMostrarFinDeDesafio")) {
      this.get('pilas').on('terminaEjecucion', () => {
        this.cuandoTerminaEjecucion();
      });
    }

    // this.set('cola_deshacer', []);
    // this.cargar_codigo_desde_el_modelo();
    // this.observarCambiosEnBlocky();

    $(window).trigger('resize');
  },

  guardarEnURL() {
    let codigo = this.obtener_codigo_en_texto();
    this.set("codigo", btoa(codigo));
  },

  generarCodigoTemporal() {
    var codigoJavascript = this.get('actividad').generarCodigo();
    this.set("codigoJavascript", codigoJavascript);
  },

  cuandoTerminaEjecucion() {
    if (this.get('pilas').estaResueltoElProblema() && this.get('actividad').debeFelicitarse()){
      this.send('abrirFinDesafio');
    }
  },

  willDestroyElement() {
    window.removeEventListener('terminaCargaInicial', this.handlerCargaInicial, false);
    window.removeEventListener('terminaEjecucion', this.handlerTerminaEjecucion, false);
  },

  /**
  * Se conecta a los eventos y cambios de estado de blockly para implementar
  * la funcionalidad de 'deshacer'.
  */
  /*
  observarCambiosEnBlocky() {
    var f = this.almacenar_cambio.bind(this);
    var d = Blockly.addChangeListener(f);
    this.set('data_observar_blockly', d);
  },

  noMirarCambiosEnBlockly() {
    if(this.get('data_observar_blockly')) {
      Blockly.removeChangeListener(this.get('data_observar_blockly'));
    }
  },

  almacenar_cambio() {
    this.get('cola_deshacer').pushObject(this.obtener_codigo_en_texto());
    console.log("guardar");
  },
  */

  restaurar_codigo(codigo) {
    var xml = Blockly.Xml.textToDom(codigo);

    if (Blockly.mainWorkspace) {
      Blockly.mainWorkspace.clear();
      Blockly.Xml.domToWorkspace(xml, Blockly.getMainWorkspace());
    }
  },

  obtener_codigo_en_texto() {
    var xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
    return Blockly.Xml.domToText(xml);
  },

  /*
  cargar_codigo_desde_el_modelo() {
    if (this.get('model')) {
      var modelo = this.get('model');
      var codigo = modelo.get('codigo');
      this.restaurar_codigo(codigo);
    }
    this.sendAction('registrarPrimerCodigo');
  },
  */


  actions: {
    ejecutar() {
      window.LoopTrap = 1000;
      //this.sendAction('reiniciar');
      Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';

      var code = this.get('actividad').generarCodigo();
      //console.log(code);

      Blockly.JavaScript.INFINITE_LOOP_TRAP = null;


      this.set('ejecutando', true);
      this.get('pilas').ejecutarCodigoSinReiniciar(code);

      /*
      Ember.run(() => {
        try {
          this.set('ejecutando', true);
          eval(code);
          this.sendAction('parar');
        } catch (e) {
          console.error(e.stack);
          alert(e);
        }
      });
      */

    },

    reiniciar() {
      this.set('ejecutando', false);
      this.get('pilas').reiniciarEscenaCompleta();
    },

    guardar() {
      this.sendAction('guardar');
    },

    guardar_solucion_en_el_backend() {
      let codigo_xml = this.get('actividad').generarCodigoXMLComoString();
      this.sendAction('guardar_solucion_en_el_backend', codigo_xml);
    },

    alternar() {
      //this.sendAction('redimensionar');
      console.log(this.controllerFor('application'));
      //.sendAction('redimensionar');
    },

    ver_codigo() {
      let codigo_como_string = this.get('actividad').generarCodigoXMLComoString();
      alert(codigo_como_string);
    },

    ingresar_codigo() {
      var codigo = prompt("Ingrese el código");

      if (codigo) {
        this.get('actividad').cargarCodigoDesdeStringXML(codigo);
      }

    },

    /*
    deshacer_cambio() {
      this.noMirarCambiosEnBlockly();
      this.get('cola_deshacer').popObject();
      var c =  this.get('cola_deshacer').popObject();
      if (c) {
        console.log("deshacer");
        this.restaurar_codigo(c);
      }
      this.observarCambiosEnBlocky();
    },
    */

    compartir() {
      this.set('abrirDialogoCompartir', true);
      let data = this.get("pilas").obtenerCapturaDePantalla();
      this.set('previewData', data);
    },

    ocultarModalTwitter() {
      this.set('abrirDialogoCompartir', false);
    },

    abrirFinDesafio() {
      this.set('mostrarDialogoFinDesafio', true);
    },

    ocultarFinDesafio() {
      this.set('mostrarDialogoFinDesafio', false);
    },

    abrirMensajePublicado() {
      let url = this.get('mensajePublicadoURL');
      this.get('browser').openLink(url);
    },

    enviarMensaje() {
      this.set('envioEnCurso', true);

      let mensaje = this.get('mensajeCompartir');
      let imagen = this.get('previewData');

      this.get('twitter').compartir(mensaje, imagen).
      then((data) => {
        this.set('envioEnCurso', false);
        this.set('mensajePublicadoURL', data.url);
      }).
      catch((err) => {
        alert(err);
        this.set('envioEnCurso', false);
      });
    },

    cargarSolucion(archivo, contenido) {
      let regex_file = /\.spbq$/;
      let regex_version = /^\d+$/;
      let data = null;
      let solucion = null;

      if (!regex_file.test(archivo.name)) {
        alert("Lo siento, solo se permiten cargar archivos .spbq");
        return;
      }

      try {
        data = JSON.parse(contenido);
        solucion = atob(data.solucion);
      } catch (e) {
        console.error(e);
        alert("Lo siento, el archivo está dañando.");
        return;
      }

      if (!regex_version.test(data.version)) {
        alert("Lo siento, la especificación de versión es incorrecta.");
        return;
      }


      if (parseInt(data.version) > VERSION_DEL_FORMATO_DE_ARCHIVO) {
        alert("Cuidado, el archivo corresponde a otra versión de la aplicación. Se cargará de todas formas, pero puede fallar.");
      }

      if (this.get("actividad").id !== data.actividad) {
        alert(`Cuidado, el archivo indica que es para otra actividad (${data.actividad}). Se cargará de todas formas, pero puede fallar.`);
      }

      this.get('actividad').cargarCodigoDesdeStringXML(solucion);
    },

    guardarSolucion() {
      let nombre_de_la_actividad = this.get("actividad").id;
      let nombre_surgerido = `${nombre_de_la_actividad}.spbq`;
      let contenido = {
        version: VERSION_DEL_FORMATO_DE_ARCHIVO,
        actividad: nombre_de_la_actividad,
        solucion: btoa(this.get('actividad').generarCodigoXMLComoString())
      };
      let contenido_como_string = JSON.stringify(contenido);

      function descargar(text, name, type) {
        var a = document.getElementById("placeholder");
        var file = new Blob([text], {type: type});
        a.href = URL.createObjectURL(file);
        a.download = name;
        a.click();
      }

      descargar(contenido_como_string, nombre_surgerido, 'application/octet-stream');
    }

  },

});
