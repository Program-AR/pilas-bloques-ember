import Ember from 'ember';


export default Ember.Component.extend({
  ejecutando: false,
  cola_deshacer: [],
  data_observar_blockly: false,
  actividad: null,


  twitter: Ember.inject.service(),
  previewData: null, // representa la imagen previsualización del dialogo para twittear.
  mensajeCompartir: 'Comparto mi solución de pilas-engine-bloques',
  compartirEnCurso: false,
  browser: Ember.inject.service(),

  inyectarRedimensionado: Ember.on('init', function() {

    window.anterior_altura = 0;
    window.anterior_ancho = 0;
    var ancho_canvas = 445;

    function redimensionar() {
      var panel = document.getElementById('panel-derecho');
      var contenedorEditor = document.getElementById('contenedor-editor');
      var panelPilas = document.getElementById('panel-pilas');
      var e = document.getElementById('contenedor-blockly');


      if (!panel) {
        return null;
      }

      var altura = panel.getClientRects()[0].height;
      var ancho_total = contenedorEditor.getClientRects()[0].width;

      if (window.anterior_altura !== altura || window.anterior_ancho !== ancho_total) {

        e.style.width = (ancho_total - ancho_canvas) + 'px';
        e.style.height = (altura - 50) + 'px';
        panelPilas.style.width = (ancho_canvas - 20) + 'px';

        window.anterior_altura = altura;
        window.anterior_ancho = ancho_total;

        Blockly.fireUiEvent(window, 'resize');
      }
    }

    function forzar_redimensionado() {
      window.anterior_altura += 1;
      redimensionar();
    }

    window.onresize = redimensionar;
    window.forzar_redimensionado = forzar_redimensionado;

  }),

  iniciarBlockly: Ember.on('didInsertElement', function() {
    //var contenedor = this.$().find('#contenedor-blockly')[0];
    this.set('cola_deshacer', []);
    //this.cargar_codigo_desde_el_modelo();
    //this.observarCambiosEnBlocky();
  }),



  /**
   * Se conecta a los eventos y cambios de estado de blockly para implementar
   * la funcionalidad de 'deshacer'.
   */
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

    restaurar_codigo(codigo) {
      var xml = Blockly.Xml.textToDom(codigo);
      Blockly.mainWorkspace.clear();
      Blockly.Xml.domToWorkspace(Blockly.getMainWorkspace(), xml);
    },

    obtener_codigo_en_texto() {
      var xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
      return Blockly.Xml.domToText(xml);
    },

    cargar_codigo_desde_el_modelo() {
      if (this.get('model')) {
        var modelo = this.get('model');
        var codigo = modelo.get('codigo');
        this.restaurar_codigo(codigo);
      }
      this.sendAction('registrarPrimerCodigo');
    },


  actions: {
    ejecutar() {
      window.LoopTrap = 1000;
      //this.sendAction('reiniciar');
      Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';

      var code = this.get('actividad').generarCodigo();
      Blockly.JavaScript.INFINITE_LOOP_TRAP = null;

      try {
        this.set('ejecutando', true);
        eval(code);
        this.sendAction('parar');
      } catch (e) {
        console.error(e.stack);
        alert(e);
      }
    },
    reiniciar() {
      this.set('ejecutando', false);
      this.sendAction('reiniciar');
    },
    guardar() {
      this.sendAction('guardar');
    },
    alternar() {
      //this.sendAction('redimensionar');
      console.log(this.controllerFor('application'));
      //.sendAction('redimensionar');
    },
    ver_codigo() {
      Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
      var code = this.get('actividad').generarCodigo();
      alert(code);
    },
    deshacer_cambio() {
      this.noMirarCambiosEnBlockly();
      this.get('cola_deshacer').popObject();
      var c =  this.get('cola_deshacer').popObject();
      if(c) {
        console.log("deshacer");
        this.restaurar_codigo(c);
      }
      this.observarCambiosEnBlocky();
    },

    compartir() {
      this.set('abrirDialogoCompartir', true);
      let data = window['canvas'].toDataURL('image/png');
      this.set('previewData', data);
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
        })

      ;
    }

  },

});
