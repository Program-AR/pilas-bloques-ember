import Ember from 'ember';
import { translationMacro as t } from "ember-i18n";

export default Ember.Service.extend({
  blockly: Ember.inject.service(),
  i18n: Ember.inject.service(),
  start() {
    this._generarLenguaje();
    this._definirColores();
    this._definirBloqueAlIniciar();
    this._definirBloquesAccion();
    this._definirBloquesAlias();
    this._definirBloquesSensores();
    this._definirBloquesQueRepresentanValores();
    this._definirBloquesEstructurasDeControl();
  },

  /*
   * Método auxiliar para crear un bloque acción.
   *
   * El argumento 'opciones' tiene que definir estas propiedades:
   *
   *   - descripcion
   *   - icono
   *   - comportamiento
   *   - argumentos
   *
   */
  crearBloqueAccion(nombre, opciones) {
    this._validar_opciones_obligatorias(nombre, opciones, ['descripcion','comportamiento','argumentos']);
    opciones.colour = opciones.colour || Blockly.Blocks.primitivas.COLOUR;

    let bloque = this.get('blockly').createCustomBlockWithHelper(nombre, opciones);
    bloque.categoria = this.get('i18n').t("Primitivas").toString();
    return bloque;
  },

  /*
   * Método auxiliar para crear un bloque nuevo a partir de otro original.
   *
   * Este método sirve para crear bloques como 'Si', 'Repetir' etc... ya que
   * esos bloques en realidad se generan a partir de los bloques estándar
   * como 'controls_if'.
   */
  crearBloqueAlias(nombre, nombreDelBloqueOriginal, categoria) {
    if (!Blockly.Blocks[nombreDelBloqueOriginal]) {
      throw new Error(`No existe el bloque ${nombreDelBloqueOriginal} al querer crear un alias, ¿Tal vez los argumentos están invertidos?`);
    }

    let bloque = this.get('blockly').createAlias(nombre, nombreDelBloqueOriginal); 
    bloque.categoria = categoria ||  Blockly.Blocks[nombreDelBloqueOriginal].categoria;

    return bloque;
  },

  /*
   * Método auxiliar para crear un bloque que sirva como sensor.
   *
   * El argumento 'opciones' tiene que definir estas propiedades:
   *
   *   - descripcion
   *   - icono
   *   - funcionSensor
   *
   */
  crearBloqueSensor(nombre, opciones) {
    this._validar_opciones_obligatorias(nombre, opciones, ['descripcion','icono','funcionSensor']);
    
    let blockly = this.get('blockly');
    let bloque = blockly.createCustomBlock(nombre, {
      message0: `%1 ¿${opciones.descripcion}?`,
      colour: opciones.colour || Blockly.Blocks.sensores.COLOUR,
      inputsInline: true,
      output: null,
      args0: [
        {
          type: "field_image",
          src: `iconos/${opciones.icono}`,
          width: 16,
          height: 16,
          alt: "*"
        }
      ],
      code: ``
    });
    // TODO: Arreglar generacion de codigo
    bloque.categoria = this.get('i18n').t("Sensores").toString();

    Blockly.MyLanguage[nombre] = function() {
      let codigo = `evaluar(${JSON.stringify(opciones.funcionSensor)})`;
      return [codigo, Blockly.MyLanguage.ORDER_ATOMIC];
    };

    return bloque;
  },

  crearBloqueValor(nombre, opciones) {
    this._validar_opciones_obligatorias(nombre, opciones, ['descripcion','icono','valor']);
    opciones.colour = opciones.colour || Blockly.Blocks.primitivas.COLOUR;

    let bloque = this.get('blockly').createBlockValue(nombre, opciones);
    bloque.categoria = this.get('i18n').t("Valores").toString();

    return bloque;
  },

  /*
   * Lanza una exception si un diccionario no presenta alguna clave obligatoria.
   */
  _validar_opciones_obligatorias(nombre, opciones, listaDeOpcionesObligatorias) {
    listaDeOpcionesObligatorias.forEach((opcion) => {
      if (!(opcion in opciones)) {
        throw new Error(`No se puede crear el bloque ${nombre} porque no se indicó un valor para la opción ${opcion}.`);
      }
    });
  },

  _definirColores(){
    // Pisar las globales de Blockly es necesario pues usamos algunos bloques de Blockly como aliases.
    Blockly.Blocks.math.HUE =  94; // En PB 1.1.2 era '#48930e'
    Blockly.Blocks.logic.HUE = 210; // En PB 1.1.2 era '#5cb712'
    Blockly.Blocks.procedures.HUE = 290; // En PB 1.1.2 era '#6C52EB'
    Blockly.Blocks.variables.HUE =  330; // En PB 1.1.2 era '#cc5b22'
    Blockly.Blocks.texts.HUE = 160; // En PB 1.1.2 era '#4a6cd4'
    Blockly.Blocks.lists.HUE = 206; // En PB 1.1.2 era '#cc5b22'

    // Para los bloques propios
    Blockly.Blocks.primitivas = {COLOUR: '#4a6cd4'};
    Blockly.Blocks.control = {COLOUR: '#ee7d16'};
    Blockly.Blocks.sensores = {COLOUR: '#2ca5e2'};
    Blockly.Blocks.direcciones = {COLOUR: '#2ba4e2'};
    Blockly.Blocks.eventos = {COLOUR: '#00a65a'}; // == boton ejecutar

    // IN SCRATCH THE COLOURS ARE
    // 4a6cd4 MOTION
    // 8a55d7 LOOKS
    // bb42c3 SOUND
    // 0e9a6c PEN
    // ee7d16 DATA Variables
    // cc5b22 DATA Lists
    // c88330 EVENTS
    // e1a91a CONTROL
    // 2ca5e2 SENSING
    // 5cb712 OPERATORS
    // 49930e OPERATORS dark
    // 632d99 MORE BLOCKS
    // 5e4db3 PARAMS
  },

  _definirBloquesAccion() {

    this.crearBloqueAccion('PrenderCompu', {
      descripcion: this.get('i18n').t('PrenderCompu'),
      icono: 'icono.computadora.png',
      comportamiento: 'PrenderCompuParaInstalar',
      argumentos: `{
        etiqueta: 'CompuAnimada',
        mensajeError: 'No hay una compu aqui',
        idTransicion: 'prender',
        animacionColisionadoPost: 'prendida',
        nombreAnimacion: 'escribir'
      }`,
    });

    this.crearBloqueAlias('Prendercompu', 'PrenderCompu');

    this.crearBloqueAccion('PrenderCompuConColision', {
      descripcion: this.get('i18n').t('PrenderCompu'),
      icono: 'icono.computadora.png',
      comportamiento: 'ComportamientoColision',
      argumentos: `{
        etiqueta: "CompuAnimada",
        animacionColisionadoPost: "prendida",
        nombreAnimacion: "escribir"
      }`,
    });

    this.crearBloqueAccion('ApretarBoton', {
      descripcion: this.get('i18n').t('ApretarBoton'),
      icono: 'iconos.botonRojo.png',
      comportamiento: 'ComportamientoColision',
      argumentos: `{
        animacionColisionadoPost: 'prendida',
        nombreAnimacion: 'apretar',
        etiqueta: 'BotonAnimado',
        mensajeError: 'No hay un botón aquí',
        idTransicion: 'apretarBoton'
      }`,
    });

    this.crearBloqueAccion('EncenderLuz', {
      descripcion: this.get('i18n').t('PrenderLaLuz'),
      icono: 'icono.Lamparita.png',
      comportamiento: 'EncenderPorEtiqueta',
      argumentos: "{'etiqueta':'Luz'}"
    });

    this.crearBloqueAccion('ComerBanana', {
      descripcion: this.get('i18n').t('ComerBanana'),
      icono: 'icono.banana.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: `{etiqueta: 'BananaAnimada', nombreAnimacion: "comerBanana"}`,
    });

    this.crearBloqueAccion('ComerBananaNano', {
      descripcion: this.get('i18n').t('ComerBanana'),
      icono: 'icono.banana.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: '{etiqueta: "BananaAnimada"}',
    });

    this.crearBloqueAccion('ComerManzana', {
      descripcion: this.get('i18n').t('ComerManzana'),
      icono: 'icono.manzana.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: '{\'etiqueta\' : \'ManzanaAnimada\',  nombreAnimacion: "comerManzana"}',
    });

    this.crearBloqueAccion('ComerQueso', {
      descripcion: this.get('i18n').t('ComerQueso'),
      icono: 'queso.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: '{etiqueta: "QuesoAnimado"}',
    });

    this.crearBloqueAccion('ComerNaranja', {
      descripcion: this.get('i18n').t('ComerNaranja'),
      icono: 'naranja.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: '{\'etiqueta\' : \'NaranjaAnimada\',  nombreAnimacion: "comerNaranja"}',
    });

    this.crearBloqueAccion('MoverACasillaDerecha', {
      descripcion: this.get('i18n').t('MoverDerecha'),
      icono: 'icono.derecha.png',
      comportamiento: 'MoverACasillaDerecha',
      argumentos: '{}',
    });

    this.crearBloqueAccion('MoverACasillaIzquierda', {
      descripcion: this.get('i18n').t('MoverIzquierda'),
      icono: 'icono.izquierda.png',
      comportamiento: 'MoverACasillaIzquierda',
      argumentos: '{}',
    });

    this.crearBloqueAccion('MoverACasillaArriba', {
      descripcion: this.get('i18n').t('MoverArriba'),
      icono: 'icono.arriba.png',
      comportamiento: 'MoverACasillaArriba',
      argumentos: '{}',
    });

    this.crearBloqueAccion('MoverACasillaAbajo', {
      descripcion: this.get('i18n').t('MoverAbajo'),
      icono: 'icono.abajo.png',
      comportamiento: 'MoverACasillaAbajo',
      argumentos: '{}',
    });

    this.crearBloqueAccion('LevantaTuerca', {
      descripcion: this.get('i18n').t('LevantarTuerca'),
      icono: 'tuerca.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: '{etiqueta: "TuercaAnimada", mensajeError: "No hay tuerca aquí", pasos: 50}',
    });

    this.crearBloqueAccion('Saludar', {
      descripcion: this.get('i18n').t('Saludar'),
      icono: 'icono.saludar.png',
      comportamiento: 'ComportamientoAnimado',
      argumentos: '{nombreAnimacion: "saludando", idTransicion: "saludar"}',
    });

    this.crearBloqueAccion('Abrirojos', {
      descripcion: this.get('i18n').t('AbrirOjos'),
      icono: 'icono.abrirOjos.png',
      comportamiento: 'AnimarSiNoEstoyYa',
      argumentos: '{nombreAnimacion: "abrirOjos", valorEstar: "con los ojos abiertos", descripcionEstar: "estadoOjos", nombreAnimacionSiguiente: "parado", arrancoAsi:true, idTransicion: "abrirOjos"}',
    });

    this.crearBloqueAccion('Cerrarojos', {
      descripcion: this.get('i18n').t('CerrarOjos'),
      icono: 'icono.cerrarOjos.png',
      comportamiento: 'AnimarSiNoEstoyYa',
      argumentos: '{nombreAnimacion: "cerrarOjos", valorEstar: "con los ojos cerrados", descripcionEstar: "estadoOjos", nombreAnimacionSiguiente: "ojosCerrados", idTransicion: "cerrarOjos"}',
    });

    this.crearBloqueAccion('Acostarse', {
      descripcion: this.get('i18n').t('Acostarse'),
      icono: 'icono.acostarse.png',
      comportamiento: 'ModificarRotacionYAltura',
      argumentos: '{alturaIr: -180 ,rotacionIr: 90, nombreAnimacion:"acostado", valorEstar: "acostado", descripcionEstar: "posicionCuerpo", idTransicion: "acostarse"}',
    });

    this.crearBloqueAccion('Pararse', {
      descripcion: this.get('i18n').t('Pararse'),
      icono: 'icono.pararse.png',
      comportamiento: 'ModificarRotacionYAltura',
      argumentos: '{alturaIr: -150 ,rotacionIr: 0, nombreAnimacion:"acostado", valorEstar: "parado", descripcionEstar: "posicionCuerpo", arrancoAsi:true, idTransicion: "levantarse"}',
    });

    this.crearBloqueAccion('Volver', {
      descripcion: this.get('i18n').t('Volver'),
      icono: 'icono.izquierda.png',
      comportamiento: 'MovimientoAnimado',
      argumentos: '{direccion: [-1,0], distancia: 50, idTransicion: "volver"}',
    });

    this.crearBloqueAccion('Avanzar', {
      descripcion: this.get('i18n').t('Avanzar'),
      icono: 'icono.derecha.png',
      comportamiento: 'MovimientoAnimado',
      argumentos: '{direccion: [1,0], distancia: 50, idTransicion: "avanzar"}',
    });

    this.crearBloqueAccion('Soar', {
      descripcion: this.get('i18n').t('Soñar'),
      icono: 'icono.soniar.png',
      comportamiento: 'Pensar',
      argumentos: '{mensaje: "ZZzzZzZ...", hayQueAnimar: false, idTransicion: "soniar"}',
    });

    this.crearBloqueAccion('saltar1', {
      descripcion: this.get('i18n').t('Saltar'),
      icono: 'icono.arriba.png',
      comportamiento: 'SaltarHablando',
      argumentos: `{
        velocidad_inicial: 30,
        alturaDeseada: 150,
        cantPasos: 20,
        velocidad: 50
      }`,
    });

    this.crearBloqueAccion('VolverABordeIzquierdo', {
      descripcion: this.get('i18n').t('IrBordeIzquierdo'),
      icono: 'icono.izquierdaTope.png',
      comportamiento: 'MoverTodoAIzquierda',
      argumentos: '{}',
    });

    this.crearBloqueAccion('TomarEstrella', {
      descripcion: this.get('i18n').t('TomarEstrella'),
      icono: 'icono.estrella.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: '{etiqueta: "EstrellaAnimada", "mensajeError": "Acá no hay una estrella"}',
    });

    this.crearBloqueAccion('MorderSandia', {
      descripcion: this.get('i18n').t('ComerSandia'),
      icono: 'icono.sandia.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: '{\'etiqueta\':\'SandiaAnimada\', \'mensajeError\': \'Acá no hay una sandia\'}',
    });

    this.crearBloqueAccion('AlimentarPez', {
      descripcion: this.get('i18n').t('AlimentarPez'),
      icono: 'icono.pez.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: '{etiqueta: "PezAnimado", idTransicion: "alimentarPez"}',
    });

    this.crearBloqueAccion('AgarrarComida', {
      descripcion: this.get('i18n').t('AgarrarComida'),
      icono: 'icono.alimento_pez.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: '{etiqueta: "AlimentoAnimado", idTransicion: "recogerComida"}',
    });

    this.crearBloqueAccion('SiguienteCompu', {
      descripcion: this.get('i18n').t('PasarSiguienteCompu'),
      icono: 'icono.derecha.png',
      comportamiento: 'MoverACasillaDerecha',
      argumentos: '{}',
    });

    this.crearBloqueAccion('ApagarCompu', {
      descripcion: this.get('i18n').t('ApagarCompu'),
      icono: 'icono.computadora.png',
      comportamiento: 'ComportamientoColision',
      argumentos: `{
        etiqueta: "CompuAnimada",
        mensajeError: "No hay una compu aqui",
        idTransicion: "apagar",
        animacionColisionadoPost: "parado",
        nombreAnimacion: "escribir"
      }`
    });

    this.crearBloqueAccion('InstalarJuego', {
      descripcion: this.get('i18n').t('InstalarJuego'),
      comportamiento: 'SecuenciaAnimada',
      argumentos:  `{
        idTransicion: "instalar",
        secuencia: [
          {
            comportamiento: "ComportamientoColision",
            argumentos: {
              etiqueta: "CompuAnimada",
              mensajeError: "No hay una compu aqui",
              nombreAnimacion: "escribir",
            }
          },
          {
            comportamiento: "EsperarAnimacionTocado",
            argumentos: {
              etiqueta: "CompuAnimada",
              nombreAnimacion: "instalando",
              nombreAnimacionSiguiente: "yaInstalado"
            }
          }
        ]
      }`
    });

    this.crearBloqueAccion('EscribirC', {
      descripcion: this.get('i18n').t('EscribirC'),
      comportamiento: 'EscribirEnCompuAnimada',
      argumentos: '{idTransicion : "escribirC"}',
    });

    this.crearBloqueAccion('EscribirB', {
      descripcion: this.get('i18n').t('EscribirB'),
      comportamiento: 'EscribirEnCompuAnimada',
      argumentos: '{idTransicion: "escribirB"}',
    });

    this.crearBloqueAccion('EscribirA', {
      descripcion: this.get('i18n').t('EscribirA'),
      comportamiento: 'EscribirEnCompuAnimada',
      argumentos: '{idTransicion: "escribirA"}',
    });

    this.crearBloqueAccion('Agarrarllave', {
      descripcion: this.get('i18n').t('TomarLlave'),
      icono: 'icono.llave.png',
      comportamiento: 'Sostener',
      argumentos: `{
        etiqueta: "LlaveAnimado",
        idTransicion: "agarrarLlave"
      }`,
    });

    this.crearBloqueAccion('Abrircofre', {
      descripcion: this.get('i18n').t('AbrirCofre'),
      icono: 'icono.cofre.png',
      comportamiento: 'Soltar',
      argumentos: `{
        etiqueta: "CofreAnimado",
        queSoltar: "LlaveAnimado",
        animacionColisionadoPost: "abrir",
        idTransicion: "abrirCofre"
      }`,
    });

    this.crearBloqueAccion('Darsombrero', {
      descripcion: this.get('i18n').t('DarSombrero'),
      icono: 'icono.sombrero.png',
      comportamiento: 'ComportamientoColision',
      argumentos: `{
        etiqueta: "MagoAnimado",
        nombreAnimacion: "cambiarSombreroPorEspada",
        animacionColisionadoMientras: "darEspada",
        idTransicion: "darSombrero"
      }`,
    });

    this.crearBloqueAccion('Atacarconespada', {
      id: 'Atacarconespada',
      descripcion: this.get('i18n').t('AtacarConEspada'),
      icono: 'icono.espada.png',
      comportamiento: 'SecuenciaAnimada',
      argumentos: `{
        idTransicion: "atacarConEspada",
        secuencia: [
          {
            comportamiento: "ComportamientoColision",
            argumentos: {
              etiqueta: "CaballeroAnimado",
              animacionColisionadoMientras: "defender",
              nombreAnimacion:"atacar"
            }
          },
          {
            comportamiento: "Sostener",
            argumentos: {
              etiqueta:"Principe"
            }
          }
        ]
      }`,
    });

    /* NUEVA */

    this.crearBloqueAccion('EscaparEnUnicornio', {
      descripcion: this.get('i18n').t('EscaparUnicornio'),
      icono: 'icono.unicornio.png',
      comportamiento: 'Escapar',
      argumentos: `{
        escaparCon: "unicornio"
      }`,
    });

    this.crearBloqueAlias('Escaparenunicornio', 'EscaparEnUnicornio');

    this.crearBloqueAccion('Escapar', {
      descripcion: this.get('i18n').t('Escapar'),
      comportamiento: 'Escapar',
      argumentos: `{
        receptor: "nave",
        escaparCon: "automata"
      }`,
    });

    this.crearBloqueAccion('TomarHierro', {
      descripcion: this.get('i18n').t('AgarrarHierro'),
      icono: 'icono.hierro.png',
      comportamiento: 'Sostener',
      argumentos: '{etiqueta: "HierroAnimado", nombreAnimacion: "recogerHierro"}',
    });

    this.crearBloqueAccion('TomarCarbon', {
      descripcion: this.get('i18n').t('AgarrarCarbon'),
      id: 'TomarCarbon',
      icono: 'icono.carbon.png',
      comportamiento: 'Sostener',
      argumentos: '{etiqueta: "CarbonAnimado", nombreAnimacion: "recogerCarbon"}',
    });

    this.crearBloqueAccion('PrenderFogata', {
      descripcion: this.get('i18n').t('PrenderFogata'),
      icono: 'icono.FogataPrendida.png',
      comportamiento: 'ComportamientoColision',
      argumentos: '{etiqueta: "FogataAnimada", animacionColisionadoPost: "prendida", nombreAnimacion: "prender" }',
    });

    this.crearBloqueAlias('Prenderfogata', 'PrenderFogata');

    this.crearBloqueAccion('Depositar', {
      descripcion: this.get('i18n').t('PonerEnNave'),
      comportamiento: 'Soltar',
      argumentos: `{
        idTransicion: "depositar",
        etiqueta: "NaveAnimada"
      }`,
    });


    this.crearBloqueAccion('AvanzarMono', {
      descripcion: this.get('i18n').t('MoverDerecha'),
      icono: 'icono.derecha.png',
      comportamiento: 'MoverACasillaDerecha',
      argumentos: '{velocidad: 25}',
    });

    this.crearBloqueAccion('DejarRegalo', {
      descripcion: this.get('i18n').t('DejarRegalo'),
      icono: 'icono.regalo.png',
      comportamiento: 'Depositar',
      argumentos: '{claseADepositar: "RegaloAnimado"}',
    });

    this.crearBloqueAlias('Dejarregalo', 'DejarRegalo');

    this.crearBloqueAccion('SiguienteFila', {
      descripcion: this.get('i18n').t('PasarSiguienteFila'),
      icono: 'icono.abajo.png',
      comportamiento: 'SiguienteFila',
      argumentos: '{}'
    });

    this.crearBloqueAccion('SiguienteFilaTotal', {
      descripcion: this.get('i18n').t('PasarSiguienteFila'),
      icono: 'icono.izquierdaAbajo.png',
      comportamiento: 'SecuenciaAnimada',

      argumentos: `{secuencia: [
        {
          comportamiento: "MoverTodoAIzquierda",
          argumentos: {}
        },
        {
          comportamiento: "MoverACasillaAbajo",
          argumentos: {}
        }
      ]}`,

    });

    this.crearBloqueAccion('SiguienteColumna', {
      descripcion: this.get('i18n').t('PasarSiguienteColumna'),
      icono: 'icono.derecha.png',
      comportamiento: 'SiguienteColumna',
      argumentos: '{}',
    });

    this.crearBloqueAccion('ContarBanana', {
      descripcion: this.get('i18n').t('ContarBanana'),
      icono: 'icono.banana.png',
      comportamiento: 'ContarPorEtiqueta',
      argumentos: '{etiqueta: "BananaAnimada", nombreAnimacion: "comerBanana"}',
    });

    this.crearBloqueAlias('Contarbanana', 'ContarBanana');

    this.crearBloqueAccion('ContarManzana', {
      descripcion: this.get('i18n').t('ContarManzana'),
      icono: 'icono.manzana.png',
      comportamiento: 'ContarPorEtiqueta',
      argumentos: '{etiqueta: "ManzanaAnimada", nombreAnimacion: "comerManzana"}',
    });

    this.crearBloqueAlias('Contarmanzana', 'ContarManzana');

    this.crearBloqueAccion('ExplotarGlobo', {
      descripcion: this.get('i18n').t('ExplotarGlobo'),
      icono: 'icono.globo.png',
      comportamiento: 'ComportamientoColision',

      argumentos: `{
        etiqueta: "GloboAnimado",
        nombreAnimacion: "recoger",
        idTransicion: "explotar",
        comportamientoAdicional: 'Eliminar',
        argumentosComportamiento: {
          nombreAnimacion: "explotar"
        }}`,
    });

    let blockly = this.get('blockly');

    let bloque = blockly.createCustomBlock('MoverA', {
      message0: "Mover a %1",
      colour: Blockly.Blocks.primitivas.COLOUR,
      inputsInline: true,
      previousStatement: true,
      nextStatement: true,
      args0: [
        {
          "type": "input_value",
          "name": "direccion",
        }
      ],
      code: 'hacer(actor_id, "MovimientoEnCuadricula", {claseDirCasilla: $direccion});'
    });

    bloque.categoria = "Primitivas";


    this.crearBloqueAccion('PatearPelota', {
      descripcion: this.get('i18n').t('PatearPelota'),
      icono: 'icono.pelota.png',
      comportamiento: 'DesencadenarComportamientoSiColisiona',
      argumentos: '{"comportamiento": "SerPateado", idTransicion: "patear", etiqueta: "PelotaAnimada", argumentosComportamiento: {tiempoEnElAire:25, aceleracion:0.0025, elevacionMaxima:25, gradosDeAumentoStep:-2}}',
    });

    this.crearBloqueAccion('Avanzar1km', {
      descripcion: this.get('i18n').t('Avanzar1Km'),
      icono: 'icono.derecha.png',
      comportamiento: 'VolarHeroicamente',
      argumentos: '{}',
    });

    this.crearBloqueAlias('AvanzarKm', 'Avanzar1km');

    this.crearBloqueAccion('CambiarColor', {
      descripcion: this.get('i18n').t('CambiarColorFoco'),
      icono: 'icono.cambiar.color.png',
      comportamiento: 'CambiarColor',
      argumentos: '{}',
    });

    this.crearBloqueAlias('cambiarColor', 'CambiarColor');

    this.crearBloqueAccion('SiguienteFoco', {
      descripcion: this.get('i18n').t('PasarSiguienteFoco'),
      icono: 'icono.derecha.png',
      comportamiento: 'MoverACasillaDerecha',
      argumentos: '{}',
    });

    this.crearBloqueAlias('siguienteFoco', 'SiguienteFoco');

    this.crearBloqueAccion('EmpezarFiesta', {
      descripcion: this.get('i18n').t('EmpezarFiesta'),
      icono: 'icono.empezar.fiesta.png',
      comportamiento: 'EmpezarFiesta',
      argumentos: '{idTransicion: "empezarFiesta"}',
    });

    this.crearBloqueAlias('empezarFiesta', 'EmpezarFiesta');

    this.crearBloqueAccion('VolverAlBordeIzquierdo', {
      descripcion: this.get('i18n').t('VolverBordeIzquierdo'),
      icono: 'icono.izquierdaTope.png',
      comportamiento: 'MoverTodoAIzquierda',
      argumentos: '{}',
    });

    this.crearBloqueAlias('Volveralbordeizquierdo', 'VolverAlBordeIzquierdo');

    this.crearBloqueAccion('PrimerSospechoso', {
      descripcion: this.get('i18n').t('IrPrimerSospechoso'),
      icono: 'icono.izquierda.png',
      comportamiento: 'MoverTodoAIzquierda',
      argumentos: '{}',
    });

    this.crearBloqueAlias('Primersospechoso', 'PrimerSospechoso');

    this.crearBloqueAccion('SiguienteSospechoso', {
      descripcion: this.get('i18n').t('PasarSospechoso'),
      icono: 'icono.derecha.png',
      comportamiento: 'MoverACasillaDerecha',
      argumentos: '{}',
    });

    this.crearBloqueAlias('Siguientesospechoso', 'SiguienteSospechoso');

    this.crearBloqueAccion('SacarDisfraz', {
      descripcion: this.get('i18n').t('InterrogarSospechoso'),
      icono: 'icono.sacar.disfraz.png',
      comportamiento: 'SacarDisfraz',
      argumentos: '{}',
    });

    this.crearBloqueAlias('Sacardisfraz', 'SacarDisfraz');

    const dibujarLado = this.get('i18n').t('DibujarLado').toString()
    blockly.createCustomBlock('DibujarLado', {
      message0: "%1" + dibujarLado + "%2",
      colour: Blockly.Blocks.primitivas.COLOUR,
      inputsInline: true,
      previousStatement: true,
      nextStatement: true,
      args0: [
        {
          "type": "field_image",
          "src": `iconos/icono.DibujarLinea.png`,
          "width": 16,
          "height": 16,
          "alt": "*"
        },
        {
          "type": "input_value",
          "name": "longitud",
        }
      ],
      code: 'hacer(actor_id, "DibujarHaciaAdelante", {distancia: $longitud, voltearAlIrAIzquierda: false, velocidad: 60});'
    });

    Blockly.Blocks['DibujarLado'].toolbox = `
      <block type="DibujarLado">
        <value name="longitud">
          <block type="math_number"><field name="NUM">100</field></block></value>
      </block>
    `;

    Blockly.Blocks['DibujarLado'].categoria = 'Primitivas';













    const girarGrados = this.get('i18n').t('GirarGrados').toString()
    blockly.createCustomBlock('GirarGrados', {
      message0: "%1" + girarGrados +"%2",
      colour: Blockly.Blocks.primitivas.COLOUR,
      inputsInline: true,
      previousStatement: true,
      nextStatement: true,
      args0: [
        {
          "type": "field_image",
          "src": `iconos/icono.Girar.png`,
          "width": 16,
          "height": 16,
          "alt": "*"
        },
        {
          "type": "input_value",
          "name": "grados",
        }
      ],
      code: 'hacer(actor_id, "Rotar", {angulo: - $grados, voltearAlIrAIzquierda: false, velocidad: 60});'
    });

    Blockly.Blocks['GirarGrados'].toolbox = `
      <block type="GirarGrados">
        <value name="grados">
          <block type="math_number"><field name="NUM">90</field></block></value>
      </block>
    `;

    Blockly.Blocks['GirarGrados'].categoria = 'Primitivas';

    this.crearBloqueAccion('MoverArribaDibujando', {
      descripcion: this.get('i18n').t('MoverArribaDibujando'),
      icono: 'icono.arribaDibujando.png',
      comportamiento: 'DibujarHaciaArriba',
      argumentos: '{distancia: 50, nombreAnimacion: "arribaDibujando"}',
    });

    this.crearBloqueAccion('MoverAbajoDibujando', {
      descripcion: this.get('i18n').t('MoverAbajoDibujando'),
      icono: 'icono.abajoDibujando.png',
      comportamiento: 'DibujarHaciaAbajo',
      argumentos: '{distancia: 50, nombreAnimacion: "abajoDibujando"}',
    });

    this.crearBloqueAccion('MoverDerechaDibujando', {
      descripcion: this.get('i18n').t('MoverDerechaDibujando'),
      icono: 'icono.derechaDibujando.png',
      comportamiento: 'DibujarHaciaLaDerecha',
      argumentos: '{distancia: 50, nombreAnimacion: "correrDibujando"}',
    });

    this.crearBloqueAccion('MoverIzquierdaDibujando', {
      descripcion: this.get('i18n').t('MoverIzquierdaDibujando'),
      icono: 'icono.izquierdaDibujando.png',
      comportamiento: 'DibujarHaciaLaIzquierda',
      argumentos: '{distancia: 50, nombreAnimacion: "correrDibujando"}',
    });

    this.crearBloqueAccion('SaltarArriba', {
      descripcion: this.get('i18n').t('SaltarArriba'),
      icono: 'icono.arriba.png',
      comportamiento: 'SaltarAnimado',
      argumentos: '{direccion: [0,1], distancia: 50, alturaDeseada: 50, velocidad_inicial: 20, nombreAnimacion: "arriba"}',
    });

    this.crearBloqueAccion('SaltarAbajo', {
      descripcion: this.get('i18n').t('SaltarAbajo'),
      icono: 'icono.abajo.png',
      comportamiento: 'SaltarAnimado',
      argumentos: '{direccion: [0,-1], distancia: 50, alturaDeseada: 50, velocidad_inicial: 20, nombreAnimacion: "abajo"}',
    });

    this.crearBloqueAccion('SaltarDerecha', {
      descripcion: this.get('i18n').t('SaltarDerecha'),
      icono: 'icono.derecha.png',
      comportamiento: 'SaltarAnimado',
      argumentos: '{direccion: [1,0], distancia: 50, alturaDeseada: 50, velocidad_inicial: 20, nombreAnimacion: "correr"}',
    });

    this.crearBloqueAccion('SaltarIzquierda', {
      descripcion: this.get('i18n').t('SaltarIzquierda'),
      icono: 'icono.izquierda.png',
      comportamiento: 'SaltarAnimado',
      argumentos: '{direccion: [-1,0], distancia: 50, alturaDeseada: 50, velocidad_inicial: 20, nombreAnimacion: "correr"}',
    });

  },

  _definirBloquesAlias() {
    this.crearBloqueAlias('Numero', 'math_number', 'Valores');
    this.crearBloqueAlias('OpAritmetica', 'math_arithmetic', 'Operadores');
    this.crearBloqueAlias('OpComparacion', 'logic_compare', 'Operadores');
    this.crearBloqueAlias('Booleano', 'logic_boolean', 'Valores');
  },

  _definirBloquesSensores() {

    this.crearBloqueSensor('Tocandobanana', {
      descripcion: this.get('i18n').t('HayBanana'),
      icono: 'icono.banana.png',
      funcionSensor: 'tocando("BananaAnimada")',
    });
    this.crearBloqueAlias('tocandoBanana', 'Tocandobanana');

    this.crearBloqueSensor('Tocandomanzana', {
      descripcion: this.get('i18n').t('HayManzana'),
      icono: 'icono.manzana.png',
      funcionSensor: 'tocando("ManzanaAnimada")',
    });

    this.crearBloqueAlias('tocandoManzana', 'Tocandomanzana');

    this.crearBloqueSensor('TocandoNaranja', {
      descripcion: this.get('i18n').t('HayNaranja'),
      icono: 'icono.naranja.png',
      funcionSensor: 'tocando("NaranjaAnimada")',
    });

    this.crearBloqueSensor('TocandoFogata', {
      descripcion: this.get('i18n').t('HayFogata'),
      icono: 'icono.FogataApagada.png',
      funcionSensor: 'tocando("FogataAnimada")',
    });

    this.crearBloqueAlias('tocandoFogata', 'TocandoFogata');

    this.crearBloqueSensor('TocandoInicio', {
      descripcion: this.get('i18n').t('EstoyInicio'),
      icono: 'icono.futbolInicio.png',
      funcionSensor: 'tocandoInicio()',
    });

    this.crearBloqueAlias('tocandoInicio', 'TocandoInicio');

    this.crearBloqueSensor('TocandoPelota', {
      descripcion: this.get('i18n').t('LleguePelota'),
      icono: 'icono.pelota.png',
      funcionSensor: 'tocando("PelotaAnimada")',
    });

    this.crearBloqueSensor('TocandoFinal', {
      descripcion: this.get('i18n').t('LlegueFinal'),
      icono: 'icono.titoFinalizacion.png',
      funcionSensor: 'estoyUltimaFila()',
    });

    this.crearBloqueAlias('tocandoFinal', 'TocandoFinal');


    this.crearBloqueAlias('tocandoPelota', 'TocandoPelota');

    this.crearBloqueSensor('KmsTotales', {
      descripcion: this.get('i18n').t('KilometrosRecorrer'),
      icono: 'icono.kms.png',
      funcionSensor: 'kmsTotales()',
    });

    this.crearBloqueSensor('EstoyEnEsquina', {
      descripcion: this.get('i18n').t('EstoyEsquina'),
      icono: 'icono.prendiendoLasCompus2.png',
      funcionSensor: 'casillaActual().esEsquina()',
    });

    this.crearBloqueAlias('Estoyenunaesquina', 'EstoyEnEsquina');


    this.crearBloqueSensor('TocandoManzana', {
      descripcion: this.get('i18n').t('HayManzana'),
      icono: 'icono.manzana.png',
      funcionSensor: 'tocando("ManzanaAnimada")',
    });

    this.crearBloqueAlias('tocandoManzana', 'TocandoManzana');

    this.crearBloqueSensor('TocandoBanana', {
      descripcion: this.get('i18n').t('HayBanana'),
      icono: 'icono.banana.png',
      funcionSensor: 'tocando("BananaAnimada")',
    });

    this.crearBloqueAlias('tocandoBanana', 'TocandoBanana');

    this.crearBloqueSensor('EstoyAlInicio', {
      descripcion: this.get('i18n').t('EstoyInicioColumna'),
      icono: 'icono.casillainiciomono.png',
      funcionSensor: 'casillaActual().esInicio()',
    });

    this.crearBloqueAlias('estoyInicio', 'EstoyAlInicio');

    this.crearBloqueSensor('EstoyAlFin', {
      descripcion: this.get('i18n').t('EstoyFinalColumna'),
      icono: 'icono.casillafinalmono.png',
      funcionSensor: 'casillaActual().esFin()',
    });

    this.crearBloqueAlias('estoyFinColumna', 'EstoyAlFin');

    this.crearBloqueSensor('LargoColumnaActual', {
      descripcion: this.get('i18n').t('LargoColumnaActual'),
      icono: 'icono.largoCol.png',
      funcionSensor: 'largoColumnaActual()-1',
    });

    this.crearBloqueSensor('TocandoAbajo', {
      descripcion: this.get('i18n').t('PuedoMoverAbajo'),
      icono: 'icono.abajo.png',
      funcionSensor: 'tocandoFlechaAbajo()',
    });

    this.crearBloqueSensor('TocandoDerecha', {
      descripcion: this.get('i18n').t('PuedoMoverDerecha'),
      icono: 'icono.derecha.png',
      funcionSensor: 'tocandoFlechaDerecha()',
    });

    this.crearBloqueSensor('TocandoFinCamino', {
      descripcion: this.get('i18n').t('LlegoAMeta'),
      icono: 'icono.finCamino.png',
      funcionSensor: 'alFinalDelCamino()',
    });

    this.crearBloqueSensor('TocandoQueso', {
      descripcion: this.get('i18n').t('HayQueso'),
      icono: 'queso.png',
      funcionSensor: 'tocando("QuesoAnimado")',
    });

    this.crearBloqueAlias('tocandoQueso', 'TocandoQueso');

    this.crearBloqueSensor('TocandoLuz', {
      descripcion: this.get('i18n').t('HayLamparita'),
      icono: 'icono.LamparitaApagada.png',
      funcionSensor: 'tocando("Lamparin")',
    });

    this.crearBloqueAlias('tocandoLuz', 'TocandoLuz');

    this.crearBloqueSensor('EsCulpable',  {
      id: 'Descubralculpable',
      descripcion: this.get('i18n').t('EstoyFrenteAlCulpable'),
      icono: 'icono.culpable.png',
      funcionSensor: 'colisionaConElCulpable() && pilas.escena_actual().culpable.teEncontraron()',
    });

    this.crearBloqueAlias('Descubralculpable', 'EsCulpable');
  },

  _definirBloquesQueRepresentanValores() {

    this.crearBloqueValor("ParaLaDerecha", {
      descripcion: this.get('i18n').t('laDerecha'),
      icono: 'icono.derecha.png',
      valor: 'DirCasillaDerecha',
      colour: Blockly.Blocks.direcciones.COLOUR,
    });

    this.crearBloqueValor('ParaLaIzquierda', {
      descripcion: this.get('i18n').t('laIzquierda'),
      icono: 'icono.izquierda.png',
      valor: 'DirCasillaIzquierda',
      colour: Blockly.Blocks.direcciones.COLOUR,
    });

    this.crearBloqueValor('ParaArriba', {
      descripcion: this.get('i18n').t('arriba'),
      icono: 'icono.arriba.png',
      valor: 'DirCasillaArriba',
      colour: Blockly.Blocks.direcciones.COLOUR,
    });

    this.crearBloqueValor('ParaAbajo', {
      descripcion: this.get('i18n').t('abajo'),
      icono: 'icono.abajo.png',
      valor: 'DirCasillaAbajo',
      colour: Blockly.Blocks.direcciones.COLOUR,
    });

  },
    
  _definirBloqueAlIniciar() {
    const tooltipText = this.get('i18n').t('AlEmpezar').toString();
    Blockly.Blocks['al_empezar_a_ejecutar'] = {
      init: function() {
        
        this.setColour(Blockly.Blocks.eventos.COLOUR);

        this.appendDummyInput().appendField(tooltipText);

        this.appendStatementInput('program');
        this.setDeletable(false);

        this.setEditable(false);
        this.setMovable(false);
      }
    };

  },

  _definirBloquesEstructurasDeControl() {
    const repetir = this.get('i18n').t('Repetir').toString();
    const veces = this.get('i18n').t('Veces').toString();
    Blockly.Blocks['RepetirVacio'] = {
      init: function() {
        this.setColour(Blockly.Blocks.control.COLOUR);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('count')
          .setCheck('Number')
          .appendField(repetir);
        this.appendDummyInput()
          .appendField(veces);
        this.appendStatementInput('block');
      },
      categoria: this.get('i18n').t('Repeticiones').toString(),
    };

    Blockly.Blocks['repetir'] = {
      init: Blockly.Blocks['RepetirVacio'].init,
      categoria: Blockly.Blocks['RepetirVacio'].categoria,
      toolbox: '<block type="repetir"><value name="count"><block type="math_number"><field name="NUM">10</field></block></value></block>'
    };

    let bloque_procedimiento = this.crearBloqueAlias('Procedimiento', 'procedures_defnoreturn');


    let init_base_callnoreturn = Blockly.Blocks['procedures_callnoreturn'].init;

    Blockly.Blocks['procedures_callnoreturn'].init = function() {
      this.setInputsInline(true);
      init_base_callnoreturn.call(this);
    };


    Blockly.Msg.PROCEDURES_DEFNORETURN_TITLE = "Definir";
    let init_base_procedimiento = Blockly.Blocks['procedures_defnoreturn'].init;

    Blockly.Blocks['procedures_defnoreturn'].init = function() {
      init_base_procedimiento.call(this);
    };

    this.crearBloqueAlias('param_get', 'variables_get');

    bloque_procedimiento.categoria = this.get('i18n').t('MisProcedimientos');
    bloque_procedimiento.categoria_custom = 'PROCEDURE';

    delete Blockly.Blocks.procedures_defreturn;
    delete Blockly.Blocks.procedures_ifreturn;

    this.crearBloqueAlias('Repetir', 'repetir', this.get('i18n').t('Repeticiones').toString());
    const si = this.get('i18n').t('Si').toString();
    Blockly.Blocks['Si'] = {
      
      init: function() {
        this.setColour(Blockly.Blocks.control.COLOUR);
        this.appendValueInput('condition')
            .setCheck('Boolean')
            .appendField(si);
        this.setInputsInline(true);
        this.appendStatementInput('block');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
      },
      categoria: this.get('i18n').t('Alternativas').toString(),
    };

    this.crearBloqueAlias('si', 'Si', this.get('i18n').t('Alternativas').toString());
    const sino = this.get('i18n').t('SiNo').toString();
    Blockly.Blocks['SiNo'] = {
      init: function() {
        this.setColour(Blockly.Blocks.control.COLOUR);
        this.appendValueInput('condition')
            .setCheck('Boolean')
            .appendField(si);
        this.appendStatementInput('block1');
        this.setInputsInline(true);
        this.appendDummyInput()
            .appendField(sino);
        this.appendStatementInput('block2');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
      },
      categoria: this.get('i18n').t('Alternativas').toString(),
    };

    this.crearBloqueAlias('Sino', 'SiNo', this.get('i18n').t('Alternativas').toString());
    this.crearBloqueAlias('sino', 'SiNo', this.get('i18n').t('Alternativas').toString());

    const repetirhasta = this.get('i18n').t('RepetirHasta').toString();
    Blockly.Blocks['Hasta'] = {
      init: function() {
        this.setColour(Blockly.Blocks.control.COLOUR);
        this.setInputsInline(true);
        this.appendValueInput('condition')
            .setCheck('Boolean')
            .appendField(repetirhasta);
        this.appendStatementInput('block');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
      },
      categoria: this.get('i18n').t('Repeticiones').toString(),
    };

    this.crearBloqueAlias('hasta', 'Hasta');

    this.crearBloqueAccion('ComerChurrasco', {
      descripcion: this.get('i18n').t('ComerChurrasco'),
      icono: 'icono.churrasco.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: '{etiqueta:"Churrasco", nombreAnimacion: "comerChurrasco"}',
    });

  },

  _generarLenguaje() {
    Blockly.MyLanguage = Blockly.JavaScript;
    Blockly.MyLanguage.addReservedWords('main', 'hacer', 'out_hacer', 'evaluar');

    Blockly.MyLanguage['al_empezar_a_ejecutar'] = function(block) {
      let programa = Blockly.JavaScript.statementToCode(block, 'program');
      let codigo = `${programa}`;
      return codigo;
    };

    Blockly.MyLanguage['RepetirVacio'] = function(block) {
      var repeats = Blockly.MyLanguage.valueToCode(block, 'count',
      Blockly.MyLanguage.ORDER_ASSIGNMENT) || '0';

      var branch = Blockly.MyLanguage.statementToCode(block, 'block');
      branch = Blockly.MyLanguage.addLoopTrap(branch, block.id);
      var code = '';

      var loopVar = Blockly.JavaScript.variableDB_.getDistinctName(
        'count', Blockly.Variables.NAME_TYPE);
      var endVar = repeats;
      if (!repeats.match(/^\w+$/) && !Blockly.isNumber(repeats)) {
        endVar = Blockly.MyLanguage.variableDB_.getDistinctName(
          'repeat_end', Blockly.Variables.NAME_TYPE);
        code += 'var ' + endVar + ' = ' + repeats + ';\n';
      }
      code += 'for (var ' + loopVar + ' = 0; ' +
        loopVar + ' < ' + endVar + '; ' +
        loopVar + '++) {\n' +
        branch + '}\n';
      return code;
    };

    Blockly.MyLanguage['repetir'] = Blockly.MyLanguage['RepetirVacio'];

    Blockly.MyLanguage['Si'] = function(block) {
      var condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
      var contenido = Blockly.MyLanguage.statementToCode(block, 'block');
      return `if (${condition}) {
        ${contenido}
      }`;
    };

    Blockly.MyLanguage['SiNo'] = function(block) {
      var condition = Blockly.MyLanguage.valueToCode(block, 'condition', Blockly.MyLanguage.ORDER_ASSIGNMENT) || 'false';
      var bloque_1 = Blockly.JavaScript.statementToCode(block, 'block1');
      var bloque_2 = Blockly.JavaScript.statementToCode(block, 'block2');

      return `if (${condition}) {
        ${bloque_1}
      } else {
        ${bloque_2}
      }`;
    };

    Blockly.MyLanguage['Hasta'] = function(block) {
      var condition = Blockly.MyLanguage.valueToCode(block, 'condition', Blockly.MyLanguage.ORDER_ASSIGNMENT) || 'false';
      var contenido = Blockly.MyLanguage.statementToCode(block, 'block');
      return `while (!${condition}) {
        ${contenido}
      }`;
    };


    Blockly.MyLanguage.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    Blockly.MyLanguage.addReservedWords('highlightBlock');
  }
});
