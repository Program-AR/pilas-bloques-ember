import Service, { inject as service } from '@ember/service'
import { isInsideProcedureDef, hasParam, isFlying, getName, requiredAllInputs } from './block-utils'
import Ember from 'ember'

export default Service.extend({
  blockly: service(), 
  intl: Ember.inject.service(),

  start() {
    //START TODO: Move these definitions to another file
    Blockly.textToBlock = this._textToBlock;
    Blockly.isProcedure = this._isProcedure;
    Blockly.shouldExecute = this._shouldExecute.bind(this);
    Blockly.aliases = this._aliases;
    Blockly.Events.fireRunCode = this._fireRunCodeEvent;
    //END TODO
    this._generarLenguaje();
    this._definirColores();
    this._definirBloquesIniciales();
    this._definirBloquesAccion();
    this._definirBloquesSensores();
    this._definirBloquesQueRepresentanValores();
    this._definirBloquesEstructurasDeControl();
    this._definirBloquesAlias();
    this._definirOperaciones(); // Should be after alias
    this._makeAllInputsRequired()
  },

  _textToBlock(text) {
    return Blockly.Xml.domToBlock(Blockly.Xml.textToDom(text), Blockly.mainWorkspace);
  },

  _fireRunCodeEvent() {
    let event = Blockly.Events.fromJson({ type: "ui", run: true }, Blockly.mainWorkspace)
    event.runCode = true
    Blockly.Events.fire(event)
  },

  _shouldExecute(block) {
    return block.allInputsFilled(false) || this._isEmptyProcedure(block)
  },
  
  _aliases(type) {
    return Blockly.Blocks[type].aliases || []
  },

  _isProcedure(type) {
    return type == "procedures_defnoreturn"
  },

  _isEmptyProcedure(block) {
    return Blockly.isProcedure(block.type) && this._hasEmptyStatement(block)
  },

  _hasEmptyStatement(procedureBlock) {
    let statement = procedureBlock.getInputTargetBlock("STACK")
    return !statement || statement.isShadow()
  },

  _makeAllInputsRequired() {
    Object.entries(Blockly.Blocks)
      .filter(([type, _]) => !Blockly.isProcedure(type)) // jshint ignore:line
      .map(([_, block]) => block) // jshint ignore:line
      .forEach(blockDef => {
        let oldInit = blockDef.init
        blockDef.init = function () {
          if (oldInit) oldInit.bind(this)()
          requiredAllInputs(this)
        }
      })
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
    this._validar_opciones_obligatorias(nombre, opciones, ['descripcion', 'comportamiento', 'argumentos']);
    opciones.colour = opciones.colour || Blockly.Blocks.primitivas.COLOUR;

    let bloque = this.blockly.createCustomBlockWithHelper(nombre, opciones);
    bloque.categoria = "Primitivas";
    return bloque;
  },

  /*
   * Método auxiliar para crear un bloque nuevo a partir de otro original.
   *
   * Este método sirve para crear bloques como 'Si', 'Repetir' etc... ya que
   * esos bloques en realidad se generan a partir de los bloques estándar
   * como 'controls_if'.
   */
  crearBloqueAlias(nombre, nombreDelBloqueOriginal, categoria, categoriaCustom) {
    if (!Blockly.Blocks[nombreDelBloqueOriginal]) {
      throw new Error(`No existe el bloque ${nombreDelBloqueOriginal} al querer crear un alias, ¿Tal vez los argumentos están invertidos?`);
    }

    let bloque = this.blockly.createAlias(nombre, nombreDelBloqueOriginal);
    bloque.categoria = categoria || Blockly.Blocks[nombreDelBloqueOriginal].categoria;

    if (categoriaCustom) {
      bloque.categoria_custom = categoriaCustom;
    }

    return bloque;
  },

  areAliases(alias, type) {
    return Blockly.aliases(type).includes(alias);
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
    this._validar_opciones_obligatorias(nombre, opciones, ['descripcion', 'funcionSensor']);

    var formaDelBloque = opciones.icono ? "%1 " : "";
    formaDelBloque += opciones.esBool ? "¿" : "";
    formaDelBloque += opciones.descripcion;
    formaDelBloque += opciones.esBool ? "?" : "";

    let blockly = this.blockly;
    let bloque = blockly.createCustomBlock(nombre, {
      message0: formaDelBloque,
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
    bloque.categoria = "Sensores";

    Blockly.MyLanguage[nombre] = function () {
      let codigo = `evaluar(${JSON.stringify(opciones.funcionSensor)})`;
      return [codigo, Blockly.MyLanguage.ORDER_ATOMIC];
    };

    return bloque;
  },

  crearBloqueValor(nombre, opciones) {
    this._validar_opciones_obligatorias(nombre, opciones, ['descripcion', 'icono', 'valor']);
    opciones.colour = opciones.colour || Blockly.Blocks.primitivas.COLOUR;

    let bloque = this.blockly.createBlockValue(nombre, opciones);
    bloque.categoria = "Valores";

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

  _definirColores() {
    // Pisar las globales de Blockly es necesario pues usamos algunos bloques de Blockly como aliases.
    Blockly.Blocks.math.HUE = 94; // En PB 1.1.2 era '#48930e'
    Blockly.Blocks.logic.HUE = 210; // En PB 1.1.2 era '#5cb712'
    Blockly.Blocks.procedures.HUE = 290; // En PB 1.1.2 era '#6C52EB'
    Blockly.Blocks.variables.HUE = 330; // En PB 1.1.2 era '#cc5b22'
    Blockly.Blocks.texts.HUE = 160; // En PB 1.1.2 era '#4a6cd4'
    Blockly.Blocks.lists.HUE = 206; // En PB 1.1.2 era '#cc5b22'

    // Para los bloques propios
    Blockly.Blocks.primitivas = { COLOUR: '#4a6cd4' };
    Blockly.Blocks.control = { COLOUR: '#ee7d16' };
    Blockly.Blocks.sensores = { COLOUR: '#2ca5e2' };
    Blockly.Blocks.direcciones = { COLOUR: '#2ba4e2' };
    Blockly.Blocks.eventos = { COLOUR: '#00a65a' }; // == boton ejecutar

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

    this.crearBloqueAccion('ApretarBoton', {
      descripcion: this.intl.t(`blocks.pushButton`),
      icono: 'iconos.botonRojo.png',
      comportamiento: 'Interactuar',
      argumentos: `{
        etiqueta: 'BotonAnimado',
        nombreAnimacion: 'apretar',
        animacionInteractuadoAlFinal: 'prendida',
        mensajeError: 'No hay un botón aquí',
        idTransicion: 'apretarBoton'
      }`,
    });

    this.crearBloqueAccion('EncenderLuz', {
      descripcion: this.intl.t(`blocks.turnOnTheLight`),
      icono: 'icono.Lamparita.png',
      comportamiento: 'Encender',
      argumentos: "{'etiqueta':'Luz'}"
    });

    this.crearBloqueAccion('ComerBanana', {
      descripcion: this.intl.t(`blocks.eatBanana`),
      icono: 'icono.banana.png',
      comportamiento: 'Recolectar',
      argumentos: `{etiqueta: 'BananaAnimada', nombreAnimacion: "comerBanana"}`,
    });

    this.crearBloqueAccion('ComerManzana', {
      descripcion: this.intl.t(`blocks.eatApple`),
      icono: 'icono.manzana.png',
      comportamiento: 'Recolectar',
      argumentos: `{etiqueta: 'ManzanaAnimada', nombreAnimacion: "comerManzana"}`,
    });

    this.crearBloqueAccion('ComerQueso', {
      descripcion: this.intl.t(`blocks.eatCheese`),
      icono: 'queso.png',
      comportamiento: 'Recolectar',
      argumentos: '{etiqueta: "QuesoAnimado"}',
    });

    this.crearBloqueAccion('ComerNaranja', {
      descripcion: this.intl.t(`blocks.eatOrange`),
      icono: 'naranja.png',
      comportamiento: 'Recolectar',
      argumentos: '{\'etiqueta\' : \'NaranjaAnimada\',  nombreAnimacion: "comerNaranja"}',
    });

    this.crearBloqueAccion('MoverACasillaDerecha', {
      descripcion: this.intl.t(`blocks.moveRight`),
      icono: 'icono.derecha.png',
      comportamiento: 'MoverACasillaDerecha',
      argumentos: '{}',
    });

    this.crearBloqueAccion('MoverACasillaIzquierda', {
      descripcion: this.intl.t(`blocks.moveLeft`),
      icono: 'icono.izquierda.png',
      comportamiento: 'MoverACasillaIzquierda',
      argumentos: '{}',
    });

    this.crearBloqueAccion('MoverACasillaArriba', {
      descripcion: this.intl.t(`blocks.moveUp`),
      icono: 'icono.arriba.png',
      comportamiento: 'MoverACasillaArriba',
      argumentos: '{}',
    });

    this.crearBloqueAccion('MoverACasillaAbajo', {
      descripcion: this.intl.t(`blocks.moveDown`),
      icono: 'icono.abajo.png',
      comportamiento: 'MoverACasillaAbajo',
      argumentos: '{}',
    });

    this.crearBloqueAccion('LevantaTuerca', {
      descripcion: this.intl.t(`blocks.pickNut`),
      icono: 'tuerca.png',
      comportamiento: 'Recolectar',
      argumentos: '{etiqueta: "TuercaAnimada", mensajeError: "No hay tuerca aquí", pasos: 50}',
    });

    this.crearBloqueAccion('Saludar', {
      descripcion: this.intl.t(`blocks.greet`),
      icono: 'icono.saludar.png',
      comportamiento: 'ComportamientoAnimado',
      argumentos: '{nombreAnimacion: "saludando", idTransicion: "saludar"}',
    });

    this.crearBloqueAccion('AbrirOjos', {
      descripcion: this.intl.t(`blocks.openEyes`),
      icono: 'icono.abrirOjos.png',
      comportamiento: 'AnimarSiNoEstoyYa',
      argumentos: '{nombreAnimacion: "abrirOjos", valorEstar: "con los ojos abiertos", descripcionEstar: "estadoOjos", nombreAnimacionSiguiente: "parado", arrancoAsi:true, idTransicion: "abrirOjos"}',
    });

    this.crearBloqueAccion('CerrarOjos', {
      descripcion: this.intl.t(`blocks.closeEyes`),
      icono: 'icono.cerrarOjos.png',
      comportamiento: 'AnimarSiNoEstoyYa',
      argumentos: '{nombreAnimacion: "cerrarOjos", valorEstar: "con los ojos cerrados", descripcionEstar: "estadoOjos", nombreAnimacionSiguiente: "ojosCerrados", idTransicion: "cerrarOjos"}',
    });


    this.crearBloqueAccion('Acostarse', {
      descripcion: this.intl.t(`blocks.lie`),
      icono: 'icono.acostarse.png',
      comportamiento: 'ModificarRotacionYAltura',
      argumentos: '{alturaIr: -180 ,rotacionIr: 90, nombreAnimacion:"acostado", valorEstar: "acostado", descripcionEstar: "posicionCuerpo", idTransicion: "acostarse"}',
    });

    this.crearBloqueAccion('Pararse', {
      descripcion: this.intl.t(`blocks.standUp`),
      icono: 'icono.pararse.png',
      comportamiento: 'ModificarRotacionYAltura',
      argumentos: '{alturaIr: -150 ,rotacionIr: 0, nombreAnimacion:"acostado", valorEstar: "parado", descripcionEstar: "posicionCuerpo", arrancoAsi:true, idTransicion: "levantarse"}',
    });

    this.crearBloqueAccion('Volver', {
      descripcion: this.intl.t(`blocks.return`),
      icono: 'icono.izquierda.png',
      comportamiento: 'MovimientoAnimado',
      argumentos: '{direccion: [-1,0], distancia: 50, idTransicion: "volver"}',
    });

    this.crearBloqueAccion('Avanzar', {
      descripcion: this.intl.t(`blocks.advance`),
      icono: 'icono.derecha.png',
      comportamiento: 'MovimientoAnimado',
      argumentos: '{direccion: [1,0], distancia: 50, idTransicion: "avanzar"}',
    });

    this.crearBloqueAccion('Soniar', {
      descripcion: this.intl.t(`blocks.dream`),
      icono: 'icono.soniar.png',
      comportamiento: 'Pensar',
      argumentos: '{mensaje: "ZZzzZzZ...", hayQueAnimar: false, idTransicion: "soniar"}',
    });

    this.crearBloqueAccion('SaltarHablando', {
      descripcion: this.intl.t(`blocks.jump`),
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
      descripcion: this.intl.t(`blocks.goToLeftBorder`),
      icono: 'icono.izquierdaTope.png',
      comportamiento: 'MoverTodoAIzquierda',
      argumentos: '{}',
    });

    this.crearBloqueAccion('TomarEstrella', {
      descripcion: this.intl.t(`blocks.takeStar`),
      icono: 'icono.estrella.png',
      comportamiento: 'Recolectar',
      argumentos: '{etiqueta: "EstrellaAnimada", "mensajeError": "Acá no hay una estrella"}',
    });

    this.crearBloqueAccion('MorderSandia', {
      descripcion: this.intl.t(`blocks.eatWatermelon`),
      icono: 'icono.sandia.png',
      comportamiento: 'Recolectar',
      argumentos: '{\'etiqueta\':\'SandiaAnimada\', \'mensajeError\': \'Acá no hay una sandia\'}',
    });

    this.crearBloqueAccion('AlimentarPez', {
      descripcion: this.intl.t(`blocks.feedFish`),
      icono: 'icono.pez.png',
      comportamiento: 'Recolectar',
      argumentos: '{etiqueta: "PezAnimado", idTransicion: "alimentarPez"}',
    });

    this.crearBloqueAccion('AgarrarComida', {
      descripcion: this.intl.t(`blocks.pickFood`),
      icono: 'icono.alimento_pez.png',
      comportamiento: 'Recolectar',
      argumentos: '{etiqueta: "AlimentoAnimado", idTransicion: "recogerComida"}',
    });

    this.crearBloqueAccion('PasarASiguienteComputadora', {
      descripcion: this.intl.t(`blocks.nextComputer`),
      icono: 'icono.derecha.png',
      comportamiento: 'MoverACasillaDerecha',
      argumentos: '{}',
    });

    this.crearBloqueAccion('PrenderComputadora', {
      descripcion: this.intl.t(`blocks.turnComputerOn`),
      icono: 'icono.turn_on.svg',
      comportamiento: 'PrenderComputadora',
      argumentos: '{}',
    });

    this.crearBloqueAccion('ApagarComputadora', {
      descripcion: this.intl.t(`blocks.turnComputerOff`),
      icono: 'icono.turn_off.svg',
      comportamiento: 'ApagarComputadora',
      argumentos: '{}'
    });

    this.crearBloqueAccion('InstalarJuego', {
      descripcion: this.intl.t(`blocks.installGame`),
      icono: 'icono.installation.svg',
      comportamiento: 'InstalarJuegoEnComputadora',
      argumentos: '{}'
    });

    this.crearBloqueAccion('EscribirA', {
      descripcion: this.intl.t(`blocks.writeA`),
      icono: 'icono.letter-a.svg',
      comportamiento: 'EscribirEnComputadora',
      argumentos: '{idTransicion: "escribirA"}',
    });

    this.crearBloqueAccion('EscribirB', {
      descripcion: this.intl.t(`blocks.writeB`),
      icono: 'icono.letter-b.svg',
      comportamiento: 'EscribirEnComputadora',
      argumentos: '{idTransicion: "escribirB"}',
    });

    this.crearBloqueAccion('EscribirC', {
      descripcion: this.intl.t(`blocks.writeC`),
      icono: 'icono.letter-c.svg',
      comportamiento: 'EscribirEnComputadora',
      argumentos: '{idTransicion : "escribirC"}',
    });

    this.crearBloqueAccion('AgarrarLlave', {
      descripcion: this.intl.t(`blocks.takeKey`),
      icono: 'icono.llave.png',
      comportamiento: 'Sostener',
      argumentos: `{
        etiqueta: "LlaveAnimado",
        idTransicion: "agarrarLlave"
      }`,
    });

    this.crearBloqueAccion('AbrirCofre', {
      descripcion: this.intl.t(`blocks.openSafeBoxTakeHat`),
      icono: 'icono.cofreConSombrero.png',
      comportamiento: 'Soltar',
      argumentos: `{
        etiqueta: "CofreAnimado",
        queSoltar: "LlaveAnimado",
        animacionInteractuadoAlFinal: "abrir",
        idTransicion: "abrirCofre"
      }`,
    });

    this.crearBloqueAccion('DarSombrero', {
      descripcion: this.intl.t(`blocks.leaveHat`),
      icono: 'icono.sombrero.png',
      comportamiento: 'Interactuar',
      argumentos: `{
        etiqueta: "MagoAnimado",
        nombreAnimacion: "cambiarSombreroPorEspada",
        animacionInteractuadoMientras: "darEspada",
        idTransicion: "darSombrero"
      }`,
    });

    this.crearBloqueAccion('AtacarConEspada', {
      id: 'Atacarconespada',
      descripcion: this.intl.t(`blocks.attackWithSword`),
      icono: 'icono.espada.png',
      comportamiento: 'SecuenciaAnimada',
      argumentos: `{
        idTransicion: "atacarConEspada",
        secuencia: [
          {
            comportamiento: "Interactuar",
            argumentos: {
              etiqueta: "CaballeroAnimado",
              animacionInteractuadoMientras: "defender",
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

    this.crearBloqueAccion('EscaparEnUnicornio', {
      descripcion: this.intl.t(`blocks.unicornEscape`),
      icono: 'icono.unicornio.png',
      comportamiento: 'Escapar',
      argumentos: `{
        escaparCon: "unicornio"
      }`,
    });

    this.crearBloqueAccion('Escapar', {
      descripcion: this.intl.t(`blocks.escape`),
      icono: 'icono.escapar.png',
      comportamiento: 'Escapar',
      argumentos: `{
        receptor: "nave",
        escaparCon: "automata"
      }`,
    });

    this.crearBloqueAccion('TomarHierro', {
      descripcion: this.intl.t(`blocks.pickIron`),
      icono: 'icono.hierro.png',
      comportamiento: 'Sostener',
      argumentos: `{
        etiqueta: "HierroAnimado",
        nombreAnimacion: "recogerHierro"
      }`,
    });

    this.crearBloqueAccion('TomarCarbon', {
      descripcion: this.intl.t(`blocks.pickCarbon`),
      id: 'TomarCarbon',
      icono: 'icono.carbon.png',
      comportamiento: 'Sostener',
      argumentos: `{
        etiqueta: "CarbonAnimado",
        nombreAnimacion: "recogerCarbon"
      }`,
    });

    this.crearBloqueAccion('PrenderFogata', {
      descripcion: this.intl.t(`blocks.lightCampfire`),
      icono: 'icono.FogataPrendida.png',
      comportamiento: 'Interactuar',
      argumentos: `{
        etiqueta: "FogataAnimada",
        nombreAnimacion: "prender",
        animacionInteractuadoAlFinal: "prendida"
      }`,
    });

    this.crearBloqueAccion('Depositar', {
      descripcion: this.intl.t(`blocks.putIntoTheShip`),
      icono: 'icono.PonerEnNave.png',
      comportamiento: 'Soltar',
      argumentos: `{
        idTransicion: "depositar",
        etiqueta: "NaveAnimada"
      }`,
    });

    this.crearBloqueAccion('AvanzarMono', {
      descripcion: this.intl.t(`blocks.moveRight`),
      icono: 'icono.derecha.png',
      comportamiento: 'MoverACasillaDerecha',
      argumentos: '{velocidad: 25}',
    });

    this.crearBloqueAccion('DejarRegalo', {
      descripcion: this.intl.t(`blocks.leavePresent`),
      icono: 'icono.regalo.png',
      comportamiento: 'Depositar',
      argumentos: '{claseADepositar: "RegaloAnimado"}',
    });

    this.crearBloqueAccion('SiguienteFila', {
      descripcion: this.intl.t(`blocks.nextLine`),
      icono: 'icono.abajo.png',
      comportamiento: 'SiguienteFila',
      argumentos: '{}'
    });

    this.crearBloqueAccion('SiguienteFilaTotal', {
      descripcion: this.intl.t(`blocks.nextLine`),
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
      descripcion: this.intl.t(`blocks.nextColumn`),
      icono: 'icono.derecha.png',
      comportamiento: 'SiguienteColumna',
      argumentos: '{}',
    });

    this.crearBloqueAccion('ContarBanana', {
      descripcion: this.intl.t(`blocks.countBanana`),
      icono: 'icono.banana.png',
      comportamiento: 'Contar',
      argumentos: '{etiqueta: "BananaAnimada", nombreAnimacion: "comerBanana"}',
    });

    this.crearBloqueAccion('ContarManzana', {
      descripcion: this.intl.t(`blocks.countManzana`),
      icono: 'icono.manzana.png',
      comportamiento: 'Contar',
      argumentos: '{etiqueta: "ManzanaAnimada", nombreAnimacion: "comerManzana"}',
    });

    this.crearBloqueAccion('ExplotarGlobo', {
      descripcion: this.intl.t(`blocks.blowUpBallon`),
      icono: 'icono.globo.png',
      comportamiento: 'Interactuar',
      argumentos: `{
        etiqueta: "GloboAnimado",
        nombreAnimacion: "recoger",
        idTransicion: "explotar",
        comportamientoAdicional: 'Eliminar',
        argumentosComportamiento: {
          nombreAnimacion: "explotar"
        }}`,
    });

    let blockly = this.blockly;

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
      code: 'hacer(actor_id, "MovimientoEnCuadricula", {direccionCasilla: $direccion});'
    });

    bloque.categoria = "Primitivas";


    this.crearBloqueAccion('PatearPelota', {
      descripcion: this.intl.t(`blocks.kickBall`),
      icono: 'icono.pelota.png',
      comportamiento: 'PatearPelota',
      argumentos: `{
        idTransicion: "patear",
      }`,
    });

    this.crearBloqueAccion('Avanzar1km', {
      descripcion: this.intl.t(`blocks.move1Km`),
      icono: 'icono.derecha.png',
      comportamiento: 'VolarHeroicamente',
      argumentos: '{}',
    });

    this.crearBloqueAccion('CambiarColor', {
      descripcion: this.intl.t(`blocks.changeLightColor`),
      icono: 'icono.cambiar.color.png',
      comportamiento: 'CambiarColor',
      argumentos: '{}',
    });

    this.crearBloqueAccion('SiguienteFoco', {
      descripcion: this.intl.t(`blocks.moveNextLight`),
      icono: 'icono.derecha.png',
      comportamiento: 'MoverACasillaDerecha',
      argumentos: '{}',
    });

    this.crearBloqueAccion('EmpezarFiesta', {
      descripcion: this.intl.t(`blocks.startParty`),
      icono: 'icono.empezar.fiesta.png',
      comportamiento: 'EmpezarFiesta',
      argumentos: '{idTransicion: "empezarFiesta"}',
    });

    this.crearBloqueAccion('VolverAlBordeIzquierdo', {
      descripcion: this.intl.t(`blocks.backToLeftBorder`),
      icono: 'icono.izquierdaTope.png',
      comportamiento: 'MoverTodoAIzquierda',
      argumentos: '{}',
    });

    this.crearBloqueAccion('IrAlPrimerSospechoso', {
      descripcion: this.intl.t(`blocks.goToFirstSuspect`),
      icono: 'icono.izquierda.png',
      comportamiento: 'MoverTodoAIzquierda',
      argumentos: '{}',
    });

    this.crearBloqueAccion('IrAlSiguienteSospechoso', {
      descripcion: this.intl.t(`blocks.nextSuspect`),
      icono: 'icono.derecha.png',
      comportamiento: 'MoverACasillaDerecha',
      argumentos: '{}',
    });

    this.crearBloqueAccion('InterrogarSospechoso', {
      descripcion: this.intl.t(`blocks.askSuspect`),
      icono: 'icono.sacar.disfraz.png',
      comportamiento: 'SacarDisfraz',
      argumentos: '{}',
    });

    blockly.createCustomBlock('SaltarHaciaAdelante', {
      message0: "%1 Saltar hacia adelante %2",
      colour: Blockly.Blocks.primitivas.COLOUR,
      inputsInline: true,
      previousStatement: true,
      nextStatement: true,
      args0: [
        {
          "type": "field_image",
          "src": `iconos/icono.arriba.png`,
          "width": 16,
          "height": 20,
          "alt": "*"
        },
        {
          "type": "input_value",
          "name": "longitud",
        }
      ],
      code: 'hacer(actor_id, "SaltarHaciaAdelante", {distancia: $longitud, alturaDeseada: 50, velocidad_inicial: 20, nombreAnimacion: "saltar"});'
    });

    Blockly.Blocks.SaltarHaciaAdelante.toolbox = `
    <block type="SaltarHaciaAdelante">
      <value name="longitud">
        <block type="math_number"><field name="NUM">100</field></block></value>
    </block>
  `;

    Blockly.Blocks.SaltarHaciaAdelante.categoria = 'Primitivas';



    blockly.createCustomBlock('DibujarLado', {
      message0: "%1 Dibujar lado de %2",
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

    Blockly.Blocks.DibujarLado.toolbox = `
      <block type="DibujarLado">
        <value name="longitud">
          <block type="math_number"><field name="NUM">100</field></block></value>
      </block>
    `;

    Blockly.Blocks.DibujarLado.categoria = 'Primitivas';

    this.crearBloqueAccion('ComerChurrasco', {
      descripcion: this.intl.t(`blocks.eatSteak`),
      icono: 'icono.churrasco.png',
      comportamiento: 'Recolectar',
      argumentos: '{etiqueta:"Churrasco", nombreAnimacion: "comerChurrasco", animacionInteractuadoMientras: "desaparecer"}',
    });

    this.crearBloqueAccion('AgarrarTomate', {
      descripcion: this.intl.t(`blocks.pickTomato`),
      icono: 'icono.tomate.png',
      comportamiento: 'Recolectar',
      argumentos: `{
        etiqueta: "Tomate",
        nombreAnimacion: "agarrarTomate",
        animacionInteractuadoMientras: "desaparecer",
        idTransicion: "agarrarTomate"
        
      }`,
    });

    this.crearBloqueAccion('AgarrarLechuga', {
      descripcion: this.intl.t(`blocks.pickLettuce`),
      icono: 'icono.lechuga.png',
      comportamiento: 'Recolectar',
      argumentos: `{
        etiqueta: "Lechuga",
        nombreAnimacion: "agarrarLechuga",
        animacionInteractuadoMientras: "desaparecer",
        idTransicion: "agarrarLechuga"
      }`,
    });

    this.crearBloqueAccion('PrepararEnsalada', {
      descripcion: this.intl.t(`blocks.prepareSalad`),
      icono: 'icono.ensaladera.png',
      comportamiento: 'PrepararEnsalada',
      argumentos: `{}`,
    });

    // Para los desafíos de escribir y leer letras

    this.crearBloqueAccion('EscribirLetraActualEnOtraCuadricula', {
      descripcion: this.intl.t(`blocks.writeLetter`),
      icono: 'icono.DibujarLinea.png',
      comportamiento: 'EscribirLetraActualEnOtraCuadricula',
      argumentos: '{}',
    });

    blockly.createCustomBlock('EscribirTextoDadoEnOtraCuadricula', {
      message0: "%1 Escribir: %2",
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
          "type": "field_input",
          "name": "texto",
          "text": ""
        }
      ],
    });

    Blockly.Blocks.EscribirTextoDadoEnOtraCuadricula.categoria = 'Primitivas';

    Blockly.MyLanguage.EscribirTextoDadoEnOtraCuadricula = function (block) {
      return 'hacer(actor_id, "EscribirTextoDadoEnOtraCuadricula", {texto: "' + (block.getFieldValue('texto') || '') + '"});';
    };

    blockly.createCustomBlock('GirarGrados', {
      message0: "%1 Girar %2 grados",
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
      code: 'hacer(actor_id, "Rotar", {angulo: - ($grados), voltearAlIrAIzquierda: false, velocidad: 60});'
    });


    Blockly.Blocks.GirarGrados.toolbox = `
      <block type="GirarGrados">
        <value name="grados">
          <block type="math_number"><field name="NUM">90</field></block></value>
      </block>
    `;

    Blockly.Blocks.GirarGrados.categoria = 'Primitivas';

    this.crearBloqueAccion('MoverArribaDibujando', {
      descripcion: this.intl.t(`blocks.moveAndDrawUp`),
      icono: 'icono.arribaDibujando.png',
      comportamiento: 'DibujarLinea',
      argumentos: '{direccion: [0,1], nombreAnimacion: "correrDibujando", dibujarPuntos: true}',
    });

    this.crearBloqueAccion('MoverAbajoDibujando', {
      descripcion: this.intl.t(`blocks.moveAndDrawDown`),
      icono: 'icono.abajoDibujando.png',
      comportamiento: 'DibujarLinea',
      argumentos: '{direccion: [0,-1], nombreAnimacion: "correrDibujando", dibujarPuntos: true}',
    });

    this.crearBloqueAccion('MoverDerechaDibujando', {
      descripcion: this.intl.t(`blocks.moveAndDrawRight`),
      icono: 'icono.derechaDibujando.png',
      comportamiento: 'DibujarLinea',
      argumentos: '{direccion: [1,0], nombreAnimacion: "correrDibujando", dibujarPuntos: true}',
    });

    this.crearBloqueAccion('MoverIzquierdaDibujando', {
      descripcion: this.intl.t(`blocks.moveAndDrawLeft`),
      icono: 'icono.izquierdaDibujando.png',
      comportamiento: 'DibujarLinea',
      argumentos: '{direccion: [-1,0], nombreAnimacion: "correrDibujando", dibujarPuntos: true}',
    });

    this.crearBloqueAccion('SaltarArriba', {
      descripcion: this.intl.t(`blocks.jumpUp`),
      icono: 'icono.arriba.png',
      comportamiento: 'SaltarAnimado',
      argumentos: '{direccion: [0,1], distancia: 50, alturaDeseada: 50, velocidad_inicial: 20, nombreAnimacion: "saltar"}',
    });

    this.crearBloqueAccion('SaltarAbajo', {
      descripcion: this.intl.t(`blocks.jumpDown`),
      icono: 'icono.abajo.png',
      comportamiento: 'SaltarAnimado',
      argumentos: '{direccion: [0,-1], distancia: 50, alturaDeseada: 50, velocidad_inicial: 20, nombreAnimacion: "saltar"}',
    });

    this.crearBloqueAccion('SaltarDerecha', {
      descripcion: this.intl.t(`blocks.jumpRight`),
      icono: 'icono.derecha.png',
      comportamiento: 'SaltarAnimado',
      argumentos: '{direccion: [1,0], distancia: 50, alturaDeseada: 50, velocidad_inicial: 20, nombreAnimacion: "saltar"}',
    });

    this.crearBloqueAccion('SaltarIzquierda', {
      descripcion: this.intl.t(`blocks.jumpLeft`),
      icono: 'icono.izquierda.png',
      comportamiento: 'SaltarAnimado',
      argumentos: '{direccion: [-1,0], distancia: 50, alturaDeseada: 50, velocidad_inicial: 20, nombreAnimacion: "saltar"}',
    });

    this.crearBloqueAccion('MoverLeyendoDerecha', {
      descripcion: this.intl.t(`blocks.moveRight`),
      icono: 'icono.derecha.png',
      comportamiento: 'MoverLeyendoDerecha',
      argumentos: '{}',
    });

    this.crearBloqueAccion('MoverLeyendoIzquierda', {
      descripcion: this.intl.t(`blocks.moveLeft`),
      icono: 'icono.izquierda.png',
      comportamiento: 'MoverLeyendoIzquierda',
      argumentos: '{}',
    });

    this.crearBloqueAccion('MoverLeyendoArriba', {
      descripcion: this.intl.t(`blocks.moveUp`),
      icono: 'icono.arriba.png',
      comportamiento: 'MoverLeyendoArriba',
      argumentos: '{}',
    });

    this.crearBloqueAccion('MoverLeyendoAbajo', {
      descripcion: this.intl.t(`blocks.moveDown`),
      icono: 'icono.abajo.png',
      comportamiento: 'MoverLeyendoAbajo',
      argumentos: '{}',
    });

  },

  _definirBloquesSensores() {

    this.crearBloqueSensor('TocandoBanana', {
      descripcion: this.intl.t(`blocks.bananaHere`),
      icono: 'icono.banana.png',
      funcionSensor: 'tocando("BananaAnimada")',
      esBool: true
    });

    this.crearBloqueSensor('TocandoManzana', {
      descripcion: this.intl.t(`blocks.appleHere`),
      icono: 'icono.manzana.png',
      funcionSensor: 'tocando("ManzanaAnimada")',
      esBool: true
    });

    this.crearBloqueSensor('TocandoNaranja', {
      descripcion: this.intl.t(`blocks.orangeHere`),
      icono: 'icono.naranja.png',
      funcionSensor: 'tocando("NaranjaAnimada")',
      esBool: true
    });

    this.crearBloqueSensor('TocandoFogata', {
      descripcion: this.intl.t(`blocks.campfireHere`),
      icono: 'icono.FogataApagada.png',
      funcionSensor: 'tocando("FogataAnimada")',
      esBool: true
    });

    this.crearBloqueSensor('TocandoInicio', {
      descripcion: this.intl.t(`blocks.atTheBeginning`),
      icono: 'icono.futbolInicio.png',
      funcionSensor: 'tocandoInicio()',
      esBool: true
    });

    this.crearBloqueSensor('TocandoPelota', {
      descripcion: this.intl.t(`blocks.getToTheBall`),
      icono: 'icono.pelota.png',
      funcionSensor: 'tocando("PelotaAnimada")',
      esBool: true
    });

    this.crearBloqueSensor('TocandoFinal', {
      descripcion: this.intl.t(`blocks.comeToTheEnd`),
      icono: 'icono.titoFinalizacion.png',
      funcionSensor: 'estoyUltimaFila()',
      esBool: true
    });

    this.crearBloqueSensor('KmsTotales', {
      descripcion: this.intl.t(`blocks.kmToTravel`),
      icono: 'icono.kms.png',
      funcionSensor: 'kmsTotales()',
    });

    this.crearBloqueSensor('EstoyEnEsquina', {
      descripcion: this.intl.t(`blocks.atTheSquare`),
      icono: 'icono.prendiendoLasCompus2.png',
      funcionSensor: 'casillaActual().esEsquina()',
      esBool: true
    });

    this.crearBloqueSensor('EstoySobreElInicio', {
      descripcion: this.intl.t(`blocks.atColumnBeginning`),
      icono: 'icono.casillainiciomono.png',
      funcionSensor: 'casillaActual().esInicio()',
      esBool: true
    });

    this.crearBloqueSensor('EstoySobreElFinal', {
      descripcion: this.intl.t(`blocks.atColumnEnd`),
      icono: 'icono.casillafinalmono.png',
      funcionSensor: 'casillaActual().esFin()',
      esBool: true
    });

    this.crearBloqueSensor('LargoColumnaActual', {
      descripcion: this.intl.t(`blocks.currentColumnLength`),
      icono: 'icono.largoCol.png',
      funcionSensor: 'largoColumnaActual()-1',
    });

    this.crearBloqueSensor('TocandoAbajo', {
      descripcion: this.intl.t(`blocks.canMoveDown`),
      icono: 'icono.abajo.png',
      funcionSensor: 'tocandoFlechaAbajo()',
      esBool: true
    });

    this.crearBloqueSensor('TocandoDerecha', {
      descripcion: this.intl.t(`blocks.canMoveRight`),
      icono: 'icono.derecha.png',
      funcionSensor: 'tocandoFlechaDerecha()',
      esBool: true
    });

    this.crearBloqueSensor('TocandoFinCamino', {
      descripcion: this.intl.t(`blocks.reachedGoal`),
      icono: 'icono.finCamino.png',
      funcionSensor: 'alFinalDelCamino()',
      esBool: true
    });

    this.crearBloqueSensor('TocandoQueso', {
      descripcion: this.intl.t(`blocks.cheeseHere`),
      icono: 'queso.png',
      funcionSensor: 'tocando("QuesoAnimado")',
      esBool: true
    });

    this.crearBloqueSensor('TocandoLuz', {
      descripcion: this.intl.t(`blocks.lampHere`),
      icono: 'icono.LamparitaApagada.png',
      funcionSensor: 'tocando("Lamparin")',
      esBool: true
    });

    this.crearBloqueSensor('EsCulpable', {
      id: 'Descubralculpable',
      descripcion: this.intl.t(`blocks.frontOfGuilty`),
      icono: 'icono.culpable.png',
      funcionSensor: 'colisionaConElCulpable() && pilas.escena_actual().culpable.teEncontraron()',
      esBool: true
    });

    this.crearBloqueSensor('HayChurrasco', {
      descripcion: this.intl.t(`blocks.steakHere`),
      icono: 'icono.churrasco.png',
      funcionSensor: 'tocando("Churrasco")',
      esBool: true
    });

    this.crearBloqueSensor('HayObstaculoArriba', {
      descripcion: this.intl.t(`blocks.obstacleUp`),
      icono: 'icono.arriba.png',
      funcionSensor: 'tieneEnLaCasillaDeArriba("Obstaculo")',
      esBool: true
    });

    this.crearBloqueSensor('HayObstaculoAbajo', {
      descripcion: this.intl.t(`blocks.obstacleDown`),
      icono: 'icono.abajo.png',
      funcionSensor: 'tieneEnLaCasillaDeAbajo("Obstaculo")',
      esBool: true
    });

    this.crearBloqueSensor('HayObstaculoIzquierda', {
      descripcion: this.intl.t(`blocks.obstacleAtLeft`),
      icono: 'icono.izquierda.png',
      funcionSensor: 'tieneEnLaCasillaASuIzquierda("Obstaculo")',
      esBool: true
    });

    this.crearBloqueSensor('HayObstaculoDerecha', {
      descripcion: this.intl.t(`blocks.obstacleAtRight`),
      icono: 'icono.derecha.png',
      funcionSensor: 'tieneEnLaCasillaASuDerecha("Obstaculo")',
      esBool: true
    });

    this.crearBloqueSensor('HayCharco', {
      descripcion: this.intl.t(`blocks.puddleHere`),
      icono: 'icono.charco.png',
      funcionSensor: 'hayEnEscena("Charco")',
      esBool: true
    });

    let sensorHayVocal = this.blockly.createCustomBlock('hayVocalRMT', {
      "type": "block_type",
      "message0": "%1 ¿La letra actual es una %2 ?",
      "args0": [
        {
          type: "field_image",
          src: `iconos/icono.DibujarLinea.png`,
          width: 16,
          height: 16,
          alt: "*"
        },
        {
          "type": "field_dropdown",
          "name": "letra",
          "options": [
            ["R", "r"], ["M", "m"], ["T", "t"], ["A", "a"], ["E", "e"], ["I", "i"], ["O", "o"], ["U", "u"]
          ]
        }
      ],
      "output": null,
      "colour": Blockly.Blocks.sensores.COLOUR,
      "tooltip": "Es cierto cuando estoy leyendo esta letra ahora",
      "helpUrl": ""
    });
    sensorHayVocal.categoria = "Sensores";

    Blockly.MyLanguage.hayVocalRMT = function (block) {
      let codigo = `evaluar("leyendoCaracter('${block.getFieldValue('letra')}')")`;
      return [codigo, Blockly.MyLanguage.ORDER_ATOMIC];
    };

    this.crearBloqueSensor('HayLechuga', {
      descripcion: this.intl.t(`blocks.lettuceHere`),
      icono: 'icono.lechuga.png',
      funcionSensor: 'tocando("Lechuga")',
      esBool: true
    });

    this.crearBloqueSensor('HayTomate', {
      descripcion: this.intl.t(`blocks.tomatoHere`),
      icono: 'icono.tomate.png',
      funcionSensor: 'tocando("Tomate")',
      esBool: true
    });

  },

  _definirBloquesQueRepresentanValores() {

    this.crearBloqueValor("ParaLaDerecha", {
      descripcion: this.intl.t(`blocks.right`),
      icono: 'icono.derecha.png',
      valor: 'derecha',
      colour: Blockly.Blocks.direcciones.COLOUR,
    });

    this.crearBloqueValor('ParaLaIzquierda', {
      descripcion: this.intl.t(`blocks.left`),
      icono: 'icono.izquierda.png',
      valor: 'izquierda',
      colour: Blockly.Blocks.direcciones.COLOUR,
    });

    this.crearBloqueValor('ParaArriba', {
      descripcion: this.intl.t(`blocks.up`),
      icono: 'icono.arriba.png',
      valor: 'arriba',
      colour: Blockly.Blocks.direcciones.COLOUR,
    });

    this.crearBloqueValor('ParaAbajo', {
      descripcion: this.intl.t(`blocks.down`),
      icono: 'icono.abajo.png',
      valor: 'abajo',
      colour: Blockly.Blocks.direcciones.COLOUR,
    });

  },

  _definirBloquesIniciales() {

    function fillOpacity(block, opacity) {
      block.getSvgRoot().style["fill-opacity"] = opacity
    }

    function transparent(block) {
      fillOpacity(block, 0)
    }

    function opaque(block) {
      fillOpacity(block, 1)
    }

    function onChangeRequired(warningText) {
      return function (event) {
        if (event && event.runCode) {
          this.setWarningText(warningText)
          opaque(this)
        }
        if (this.warning && this.warning.bubble_) this.warning.bubble_.setColour('red')
      }
    }

    Blockly.Blocks.required_value = {
      init: function () {
        this.jsonInit({
          "type": "required_value",
          "message0": "",
          "output": null,
          "colour": "#ffffff",
          "tooltip": "",
          "helpUrl": "",
        });
        this.setShadow(true)
        transparent(this)
      },
      onchange: onChangeRequired("¡Acá falta un bloque expresión!")
    };

    Blockly.Blocks.required_statement = {
      init: function () {
        this.jsonInit({
          "type": "required_statement",
          "message0": "",
          "previousStatement": null,
          "colour": "#ffffff",
          "tooltip": "",
          "helpUrl": "",
        });
        this.setShadow(true)
        transparent(this)
      },
      onchange: onChangeRequired("¡Acá faltan bloques comandos!")
    };

    Blockly.Blocks.al_empezar_a_ejecutar = {
      init: function () {
        this.setColour(Blockly.Blocks.eventos.COLOUR);
        this.appendDummyInput().appendField('Al empezar a ejecutar');
        this.appendStatementInput('program');
        this.setDeletable(false);
        this.setEditable(false);
        this.setMovable(false);
      },
    };

  },

  _definirBloquesEstructurasDeControl() {

    Blockly.Blocks.RepetirVacio = {
      init: function () {
        this.setColour(Blockly.Blocks.control.COLOUR);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('count')
          .setCheck('Number')
          .appendField('Repetir');
        this.appendDummyInput()
          .appendField('veces');
        this.appendStatementInput('block');
      },
      categoria: 'Repeticiones',
    };

    Blockly.Blocks.Repetir = {
      init: Blockly.Blocks['RepetirVacio'].init,
      categoria: Blockly.Blocks['RepetirVacio'].categoria,
      toolbox: `
      <block type="repetir">
        <value name="count">
          <block type="math_number"><field name="NUM">10</field></block>
        </value>
      </block>
      `
    };

    Blockly.Blocks.Hasta = {
      init: function () {
        this.setColour(Blockly.Blocks.control.COLOUR);
        this.setInputsInline(true);
        this.appendValueInput('condition')
          .setCheck('Boolean')
          .appendField('Repetir hasta que');
        this.appendStatementInput('block');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
      },
      categoria: 'Repeticiones',
    };


    Blockly.Blocks.Si = {
      init: function () {
        this.setColour(Blockly.Blocks.control.COLOUR);
        this.appendValueInput('condition')
          .setCheck('Boolean')
          .appendField('Si');
        this.setInputsInline(true);
        this.appendStatementInput('block');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
      },
      categoria: 'Alternativas',
    };

    Blockly.Blocks.SiNo = {
      init: function () {
        this.setColour(Blockly.Blocks.control.COLOUR);
        this.appendValueInput('condition')
          .setCheck('Boolean')
          .appendField('Si');
        this.appendStatementInput('block1');
        this.setInputsInline(true);
        this.appendDummyInput()
          .appendField('sino');
        this.appendStatementInput('block2');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
      },
      categoria: 'Alternativas',
    };


    let init_base_callnoreturn = Blockly.Blocks.procedures_callnoreturn.init;

    Blockly.Blocks.procedures_callnoreturn.init = function () {
      this.setInputsInline(true);
      init_base_callnoreturn.call(this);
    };

    Blockly.Blocks.procedures_callnoreturn.onchange = function () {
      requiredAllInputs(this) // Input fields are added after instantiation 
    };

    Blockly.Blocks.variables_get = {
      init: function () {
        this.jsonInit({
          "type": "variables_get",
          "message0": "%1",
          "args0": [
            {
              "type": "field_label",
              "name": "VAR",
              "text": "nombre de variable"
            }
          ],
          "output": null,
          "colour": Blockly.Blocks.variables.HUE,
          "tooltip": "",
          "helpUrl": "",
        });
      },
      mutationToDom: function () {
        var container = document.createElement('mutation');
        container.setAttribute('var', this.getFieldValue('VAR'));
        if (this.$parent) {
          container.setAttribute("parent", this.$parent);
        }
        return container;
      },
      domToMutation: function (xmlElement) {
        var var_name = xmlElement.getAttribute('var');
        this.setFieldValue(var_name, 'VAR');
        this.$parent = xmlElement.getAttribute("parent") || null;
      },
      onchange: function (event) {
        if (event && event.blockId === this.$parent && event.type === Blockly.Events.BLOCK_DELETE) {
          this.dispose();
          return;
        }
        if (this.$parent) { // Este if sirve para las soluciones viejas que no tienen $parent
          var procedureDef = this.workspace.getBlockById(this.$parent)
          var ok = isInsideProcedureDef(this) && hasParam(procedureDef, this)
          this.setDisabled(!ok)
          var warning =
            (ok || isFlying(this) || !procedureDef)
              ? null
              : (hasParam(procedureDef, this))
                ? `Este bloque no puede usarse aquí. Es un parámetro que sólo puede usarse en ${getName(procedureDef)}.`
                : "Este bloque ya no puede usarse, el parámetro ha sido eliminado."
          this.setWarningText(warning)
        }
      }
    };

    Blockly.Msg.PROCEDURES_DEFNORETURN_TITLE = "Definir";
    let init_base_procedimiento = Blockly.Blocks.procedures_defnoreturn.init;

    Blockly.Blocks.procedures_defnoreturn.init = function () {
      init_base_procedimiento.call(this);
    };

    delete Blockly.Blocks.procedures_defreturn;
    delete Blockly.Blocks.procedures_ifreturn;

  },

  _generarLenguaje() {
    Blockly.MyLanguage = Blockly.JavaScript;
    Blockly.MyLanguage.addReservedWords('main', 'hacer', 'out_hacer', 'evaluar');

    Blockly.MyLanguage.required_value = function () {
      return null
    };

    Blockly.MyLanguage.required_statement = function () {
      return null
    };

    Blockly.MyLanguage.al_empezar_a_ejecutar = function (block) {
      let programa = Blockly.JavaScript.statementToCode(block, 'program');
      let codigo = `${programa}`;
      return codigo;
    };

    Blockly.MyLanguage.RepetirVacio = function (block) {
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

    Blockly.MyLanguage.Repetir = Blockly.MyLanguage.RepetirVacio;

    Blockly.MyLanguage.Si = function (block) {
      var condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
      var contenido = Blockly.MyLanguage.statementToCode(block, 'block');
      return `if (${condition}) {
        ${contenido}
      }`;
    };

    Blockly.MyLanguage.SiNo = function (block) {
      var condition = Blockly.MyLanguage.valueToCode(block, 'condition', Blockly.MyLanguage.ORDER_ASSIGNMENT) || 'false';
      var bloque_1 = Blockly.JavaScript.statementToCode(block, 'block1');
      var bloque_2 = Blockly.JavaScript.statementToCode(block, 'block2');

      return `if (${condition}) {
        ${bloque_1}
      } else {
        ${bloque_2}
      }`;
    };

    Blockly.MyLanguage.Hasta = function (block) {
      var condition = Blockly.MyLanguage.valueToCode(block, 'condition', Blockly.MyLanguage.ORDER_ASSIGNMENT) || 'false';
      var contenido = Blockly.MyLanguage.statementToCode(block, 'block');
      return `while (!${condition}) {
        ${contenido}
      }`;
    };

    Blockly.MyLanguage.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    Blockly.MyLanguage.addReservedWords('highlightBlock');
  },

  _definirOperaciones() { //Este código fue sacado de Blockly
    this.blockly.createCustomBlock('OpAritmetica', {
      "type": "math_arithmetic",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "input_value",
          "name": "A",
          "check": "Number"
        },
        {
          "type": "field_dropdown",
          "name": "OP",
          "options": [
            ["%{BKY_MATH_ADDITION_SYMBOL}", "ADD"],
            ["%{BKY_MATH_SUBTRACTION_SYMBOL}", "MINUS"],
            ["%{BKY_MATH_MULTIPLICATION_SYMBOL}", "MULTIPLY"],
            ["%{BKY_MATH_DIVISION_SYMBOL}", "DIVIDE"],
            ["%{BKY_MATH_POWER_SYMBOL}", "POWER"]
          ]
        },
        {
          "type": "input_value",
          "name": "B",
          "check": "Number"
        }
      ],
      "inputsInline": true,
      "output": "Number",
      "colour": "%{BKY_MATH_HUE}",
      "helpUrl": "%{BKY_MATH_ARITHMETIC_HELPURL}",
      "extensions": ["math_op_tooltip"]
    });

    Blockly.MyLanguage.OpAritmetica = function (block) {
      // Basic arithmetic operators, and power.
      var OPERATORS = {
        'ADD': [' + ', Blockly.JavaScript.ORDER_ADDITION],
        'MINUS': [' - ', Blockly.JavaScript.ORDER_SUBTRACTION],
        'MULTIPLY': [' * ', Blockly.JavaScript.ORDER_MULTIPLICATION],
        'DIVIDE': [' / ', Blockly.JavaScript.ORDER_DIVISION],
        'POWER': [null, Blockly.JavaScript.ORDER_COMMA]  // Handle power separately.
      };
      var argument0 = Blockly.JavaScript.valueToCode(block, 'A', order) || '0';
      var argument1 = Blockly.JavaScript.valueToCode(block, 'B', order) || '0';
      var op = block.getFieldValue('OP');
      var tuple = OPERATORS[op];
      var operator = tuple[0];
      var order = tuple[1];
      var isPow = !operator;
      var isDivision = op === 'DIVIDE';
      var code;
      // Power in JavaScript requires a special case since it has no operator.
      if (isPow) {
        code = 'Math.pow(' + argument0 + ', ' + argument1 + ')';
        return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
      }
      code = `
      (function(){
        if (${isDivision} && ${argument1} === 0)
          evaluar("lanzarActividadError('No se puede dividir por 0')")
        else
          return ${argument0 + operator + argument1}
      })()
      `;
      return [code, order];
    };

    Blockly.Blocks.OpAritmetica.categoria = 'Operadores';
  },

  _definirBloquesAlias() {
    this.crearBloqueAlias('OpComparacion', 'logic_compare', 'Operadores');
    this.crearBloqueAlias('OpAritmetica', 'math_arithmetic', 'Operadores');
    this.crearBloqueAlias('Booleano', 'logic_boolean', 'Valores');
    this.crearBloqueAlias('Numero', 'math_number', 'Valores');
    this.crearBloqueAlias('Texto', 'text', 'Valores');
    this.crearBloqueAlias('param_get', 'variables_get');
    this.crearBloqueAlias('Procedimiento', 'procedures_defnoreturn', 'Mis procedimientos', 'PROCEDURE');
    this._agregarAliasParaCompatibilidadHaciaAtras();
  },

  /**
   * Crea alias con nombres de bloques que fueron previamente usados
   * en pilas bloques, pero que han cambiado el nombre por otro actualmente.
   * Esto es necesario para mantener la retrocompatibilidad con ejercicios
   * que utilizan los bloques anteriormente citados.
   */
  _agregarAliasParaCompatibilidadHaciaAtras() {
    this.crearBloqueAlias('si', 'Si');
    this.crearBloqueAlias('Sino', 'SiNo');
    this.crearBloqueAlias('sino', 'SiNo');
    this.crearBloqueAlias('Descubralculpable', 'EsCulpable');
    this.crearBloqueAlias('hasta', 'Hasta');
    this.crearBloqueAlias('repetir', 'Repetir');
    this.crearBloqueAlias('tocandoBanana', 'TocandoBanana');
    this.crearBloqueAlias('tocandoManzana', 'TocandoManzana');
    this.crearBloqueAlias('prenderCompuConColision', 'PrenderComputadora');
    this.crearBloqueAlias('PrenderCompuConColision', 'PrenderComputadora');
    this.crearBloqueAlias('Prendercompu', 'PrenderComputadora');
    this.crearBloqueAlias('PrenderCompu', 'PrenderComputadora');
    this.crearBloqueAlias('ApagarCompu', 'ApagarComputadora');
    this.crearBloqueAlias('SiguienteCompu', 'PasarASiguienteComputadora');
    this.crearBloqueAlias('Prenderfogata', 'PrenderFogata');
    this.crearBloqueAlias('Dejarregalo', 'DejarRegalo');
    this.crearBloqueAlias('Contarbanana', 'ContarBanana');
    this.crearBloqueAlias('Contarmanzana', 'ContarManzana');
    this.crearBloqueAlias('AvanzarKm', 'Avanzar1km');
    this.crearBloqueAlias('cambiarColor', 'CambiarColor');
    this.crearBloqueAlias('siguienteFoco', 'SiguienteFoco');
    this.crearBloqueAlias('empezarFiesta', 'EmpezarFiesta');
    this.crearBloqueAlias('Volveralbordeizquierdo', 'VolverAlBordeIzquierdo');
    this.crearBloqueAlias('Primersospechoso', 'IrAlPrimerSospechoso');
    this.crearBloqueAlias('PrimerSospechoso', "IrAlPrimerSospechoso");
    this.crearBloqueAlias('Siguientesospechoso', 'IrAlSiguienteSospechoso');
    this.crearBloqueAlias('SiguienteSospechoso', "IrAlSiguienteSospechoso");
    this.crearBloqueAlias('Sacardisfraz', 'InterrogarSospechoso');
    this.crearBloqueAlias('SacarDisfraz', 'InterrogarSospechoso');
    this.crearBloqueAlias('tocandoFogata', 'TocandoFogata');
    this.crearBloqueAlias('tocandoInicio', 'TocandoInicio');
    this.crearBloqueAlias('tocandoFinal', 'TocandoFinal');
    this.crearBloqueAlias('tocandoPelota', 'TocandoPelota');
    this.crearBloqueAlias('Estoyenunaesquina', 'EstoyEnEsquina');
    this.crearBloqueAlias('tocandoQueso', 'TocandoQueso');
    this.crearBloqueAlias('tocandoLuz', 'TocandoLuz');
    this.crearBloqueAlias('Abrirojos', 'AbrirOjos');
    this.crearBloqueAlias('Cerrarojos', 'CerrarOjos');
    this.crearBloqueAlias('Soar', "Soniar");
    this.crearBloqueAlias('Agarrarllave', "AgarrarLlave");
    this.crearBloqueAlias('Abrircofre', "AbrirCofre");
    this.crearBloqueAlias('Darsombrero', "DarSombrero");
    this.crearBloqueAlias('Atacarconespada', "AtacarConEspada");
    this.crearBloqueAlias('Escaparenunicornio', 'EscaparEnUnicornio');
    this.crearBloqueAlias('estoyInicio', 'EstoySobreElInicio');
    this.crearBloqueAlias('estoyAlInicio', 'EstoySobreElInicio');
    this.crearBloqueAlias('estoyFinColumna', 'EstoySobreElFinal');
    this.crearBloqueAlias('EstoyAlFin', 'EstoySobreElFinal');
    this.crearBloqueAlias('ComerBananaNano', 'ComerBanana');
    this.crearBloqueAlias('saltar1', 'SaltarHablando');
  }

})