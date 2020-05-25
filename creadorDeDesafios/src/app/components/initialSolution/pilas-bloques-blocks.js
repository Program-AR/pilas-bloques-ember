import blockBuilder from "./pbBlockBuilder.js"
import Blockly from 'blockly'

function shouldAddRequiredShadow(connection) {
  return  connection.getShadowDom() == null // Should have not a shadow block
  &&      [Blockly.INPUT_VALUE, Blockly.NEXT_STATEMENT].includes(connection.type) // Should be a "block hole"
}

// Agrega un required shadow a todos los input que sean para encastrar otros bloques
function requiredAllInputs(block) {
  block.inputList
  .filter(input => input.connection && shouldAddRequiredShadow(input.connection))
  .forEach(input => requiredInput(block, input.name))
}

function requiredInput(block, inputName) {
  let connection = block.getInput(inputName).connection;
  let shadowType =  (connection.type === Blockly.INPUT_VALUE)
                    ? "required_value"
                    : "required_statement"
  var shadowValue = Blockly.Xml.textToDom(`<shadow type="${shadowType}"/>`);
  connection.setShadowDom(shadowValue);
  if (!connection.targetConnection)
    connection.respawnShadow_()
}

let pbBlocks = {
  blockBuilder: blockBuilder,
  iconsPath: "iconos",

  setIconsPath(path){
    this.iconsPath = path;
  },

  make() {
    Blockly.textToBlock = this._textToBlock;
    Blockly.Events.fireRunCode = this._fireRunCodeEvent;
    this._generarLenguaje();
    this._definirColores();
    this._definirBloquesIniciales();
    this._definirBloquesAccion();
    this._definirBloquesSensores();
    this._definirBloquesQueRepresentanValores();
    this._definirBloquesEstructurasDeControl();
    this._definirBloquesAlias();
    this._definirOperaciones(); // Should be after alias
  },

  types(){
    return Object.getOwnPropertyNames(Blockly.Blocks).filter(
      prop => Blockly.Blocks[prop].categoria
    );
  },

  _textToBlock(text) {
    return Blockly.Xml.domToBlock(Blockly.Xml.textToDom(text), Blockly.mainWorkspace);
  },

  _fireRunCodeEvent() {
    let event = Blockly.Events.fromJson({type:"ui", run: true}, Blockly.mainWorkspace)
    event.runCode = true
    Blockly.Events.fire(event)
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
    opciones.icono = opciones.icono ? `${this.iconsPath}/${opciones.icono}` : opciones.icono;

    let bloque = this.blockBuilder.createCustomBlockWithHelper(nombre, opciones);
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

    let bloque = this.blockBuilder.createAlias(nombre, nombreDelBloqueOriginal);
    bloque.categoria = categoria || Blockly.Blocks[nombreDelBloqueOriginal].categoria;

    if (categoriaCustom) {
      bloque.categoria_custom = categoriaCustom;
    }

    return bloque;
  },

  areAliases(alias, type) {
    return Blockly.Blocks[alias].init === Blockly.Blocks[type].init;
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

    let blockBuilder = this.blockBuilder;
    let bloque = blockBuilder.createCustomBlock(nombre, {
      message0: formaDelBloque,
      colour: opciones.colour || Blockly.Blocks.sensores.COLOUR,
      inputsInline: true,
      output: null,
      args0: [
        {
          type: "field_image",
          src: `${this.iconsPath}/${opciones.icono}`,
          width: 16,
          height: 16,
          alt: "*"
        }
      ],
      code: ``
    });
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
    opciones.icono = opciones.icono ? `${this.iconsPath}/${opciones.icono}` : opciones.icono;

    let bloque = this.blockBuilder.createBlockValue(nombre, opciones);
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
      descripcion: 'Apretar botón',
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
      descripcion: 'Prender la luz',
      icono: 'icono.Lamparita.png',
      comportamiento: 'Encender',
      argumentos: "{'etiqueta':'Luz'}"
    });

    this.crearBloqueAccion('ComerBanana', {
      descripcion: 'Comer banana',
      icono: 'icono.banana.png',
      comportamiento: 'Recolectar',
      argumentos: `{etiqueta: 'BananaAnimada', nombreAnimacion: "comerBanana"}`,
    });

    this.crearBloqueAccion('ComerManzana', {
      descripcion: 'Comer manzana',
      icono: 'icono.manzana.png',
      comportamiento: 'Recolectar',
      argumentos: `{etiqueta: 'ManzanaAnimada', nombreAnimacion: "comerManzana"}`,
    });

    this.crearBloqueAccion('ComerQueso', {
      descripcion: 'Comer queso',
      icono: 'queso.png',
      comportamiento: 'Recolectar',
      argumentos: '{etiqueta: "QuesoAnimado"}',
    });

    this.crearBloqueAccion('ComerNaranja', {
      descripcion: 'Comer naranja',
      icono: 'naranja.png',
      comportamiento: 'Recolectar',
      argumentos: '{\'etiqueta\' : \'NaranjaAnimada\',  nombreAnimacion: "comerNaranja"}',
    });

    this.crearBloqueAccion('MoverACasillaDerecha', {
      descripcion: 'Mover a la derecha',
      icono: 'icono.derecha.png',
      comportamiento: 'MoverACasillaDerecha',
      argumentos: '{}',
    });

    this.crearBloqueAccion('MoverACasillaIzquierda', {
      descripcion: 'Mover a la izquierda',
      icono: 'icono.izquierda.png',
      comportamiento: 'MoverACasillaIzquierda',
      argumentos: '{}',
    });

    this.crearBloqueAccion('MoverACasillaArriba', {
      descripcion: 'Mover arriba',
      icono: 'icono.arriba.png',
      comportamiento: 'MoverACasillaArriba',
      argumentos: '{}',
    });

    this.crearBloqueAccion('MoverACasillaAbajo', {
      descripcion: 'Mover abajo',
      icono: 'icono.abajo.png',
      comportamiento: 'MoverACasillaAbajo',
      argumentos: '{}',
    });

    this.crearBloqueAccion('LevantaTuerca', {
      descripcion: 'Levantar tuerca',
      icono: 'tuerca.png',
      comportamiento: 'Recolectar',
      argumentos: '{etiqueta: "TuercaAnimada", mensajeError: "No hay tuerca aquí", pasos: 50}',
    });

    this.crearBloqueAccion('Saludar', {
      descripcion: 'Saludar',
      icono: 'icono.saludar.png',
      comportamiento: 'ComportamientoAnimado',
      argumentos: '{nombreAnimacion: "saludando", idTransicion: "saludar"}',
    });

    this.crearBloqueAccion('AbrirOjos', {
      descripcion: 'Abrir ojos',
      icono: 'icono.abrirOjos.png',
      comportamiento: 'AnimarSiNoEstoyYa',
      argumentos: '{nombreAnimacion: "abrirOjos", valorEstar: "con los ojos abiertos", descripcionEstar: "estadoOjos", nombreAnimacionSiguiente: "parado", arrancoAsi:true, idTransicion: "abrirOjos"}',
    });

    this.crearBloqueAccion('CerrarOjos', {
      descripcion: 'Cerrar ojos',
      icono: 'icono.cerrarOjos.png',
      comportamiento: 'AnimarSiNoEstoyYa',
      argumentos: '{nombreAnimacion: "cerrarOjos", valorEstar: "con los ojos cerrados", descripcionEstar: "estadoOjos", nombreAnimacionSiguiente: "ojosCerrados", idTransicion: "cerrarOjos"}',
    });


    this.crearBloqueAccion('Acostarse', {
      descripcion: 'Acostarse',
      icono: 'icono.acostarse.png',
      comportamiento: 'ModificarRotacionYAltura',
      argumentos: '{alturaIr: -180 ,rotacionIr: 90, nombreAnimacion:"acostado", valorEstar: "acostado", descripcionEstar: "posicionCuerpo", idTransicion: "acostarse"}',
    });

    this.crearBloqueAccion('Pararse', {
      descripcion: 'Pararse',
      icono: 'icono.pararse.png',
      comportamiento: 'ModificarRotacionYAltura',
      argumentos: '{alturaIr: -150 ,rotacionIr: 0, nombreAnimacion:"acostado", valorEstar: "parado", descripcionEstar: "posicionCuerpo", arrancoAsi:true, idTransicion: "levantarse"}',
    });

    this.crearBloqueAccion('Volver', {
      descripcion: 'Volver',
      icono: 'icono.izquierda.png',
      comportamiento: 'MovimientoAnimado',
      argumentos: '{direccion: [-1,0], distancia: 50, idTransicion: "volver"}',
    });

    this.crearBloqueAccion('Avanzar', {
      descripcion: 'Avanzar',
      icono: 'icono.derecha.png',
      comportamiento: 'MovimientoAnimado',
      argumentos: '{direccion: [1,0], distancia: 50, idTransicion: "avanzar"}',
    });

    this.crearBloqueAccion('Soniar', {
      descripcion: 'Soñar',
      icono: 'icono.soniar.png',
      comportamiento: 'Pensar',
      argumentos: '{mensaje: "ZZzzZzZ...", hayQueAnimar: false, idTransicion: "soniar"}',
    });

    this.crearBloqueAccion('SaltarHablando', {
      descripcion: 'Saltar',
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
      descripcion: 'Ir al borde izquierdo',
      icono: 'icono.izquierdaTope.png',
      comportamiento: 'MoverTodoAIzquierda',
      argumentos: '{}',
    });

    this.crearBloqueAccion('TomarEstrella', {
      descripcion: 'Tomar estrella',
      icono: 'icono.estrella.png',
      comportamiento: 'Recolectar',
      argumentos: '{etiqueta: "EstrellaAnimada", "mensajeError": "Acá no hay una estrella"}',
    });

    this.crearBloqueAccion('MorderSandia', {
      descripcion: 'Comer sandía',
      icono: 'icono.sandia.png',
      comportamiento: 'Recolectar',
      argumentos: '{\'etiqueta\':\'SandiaAnimada\', \'mensajeError\': \'Acá no hay una sandia\'}',
    });

    this.crearBloqueAccion('AlimentarPez', {
      descripcion: 'Alimentar pez',
      icono: 'icono.pez.png',
      comportamiento: 'Recolectar',
      argumentos: '{etiqueta: "PezAnimado", idTransicion: "alimentarPez"}',
    });

    this.crearBloqueAccion('AgarrarComida', {
      descripcion: 'Agarrar comida',
      icono: 'icono.alimento_pez.png',
      comportamiento: 'Recolectar',
      argumentos: '{etiqueta: "AlimentoAnimado", idTransicion: "recogerComida"}',
    });

    this.crearBloqueAccion('PasarASiguienteComputadora', {
      descripcion: 'Pasar a la siguiente computadora',
      icono: 'icono.derecha.png',
      comportamiento: 'MoverACasillaDerecha',
      argumentos: '{}',
    });

    this.crearBloqueAccion('PrenderComputadora', {
      descripcion: 'Prender computadora',
      icono: 'icono.turn_on.svg',
      comportamiento: 'PrenderComputadora',
      argumentos: '{}',
    });

    this.crearBloqueAccion('ApagarComputadora', {
      descripcion: 'Apagar computadora',
      icono: 'icono.turn_off.svg',
      comportamiento: 'ApagarComputadora',
      argumentos: '{}'
    });

    this.crearBloqueAccion('InstalarJuego', {
      descripcion: 'Instalar juego',
      icono: 'icono.installation.svg',
      comportamiento: 'InstalarJuegoEnComputadora',
      argumentos: '{}'
    });

    this.crearBloqueAccion('EscribirA', {
      descripcion: 'Escribir "A"',
      icono: 'icono.letter-a.svg',
      comportamiento: 'EscribirEnComputadora',
      argumentos: '{idTransicion: "escribirA"}',
    });

    this.crearBloqueAccion('EscribirB', {
      descripcion: 'Escribir "B"',
      icono: 'icono.letter-b.svg',
      comportamiento: 'EscribirEnComputadora',
      argumentos: '{idTransicion: "escribirB"}',
    });

    this.crearBloqueAccion('EscribirC', {
      descripcion: 'Escribir "C"',
      icono: 'icono.letter-c.svg',
      comportamiento: 'EscribirEnComputadora',
      argumentos: '{idTransicion : "escribirC"}',
    });

    this.crearBloqueAccion('AgarrarLlave', {
      descripcion: 'Tomar la llave',
      icono: 'icono.llave.png',
      comportamiento: 'Sostener',
      argumentos: `{
        etiqueta: "LlaveAnimado",
        idTransicion: "agarrarLlave"
      }`,
    });

    this.crearBloqueAccion('AbrirCofre', {
      descripcion: 'Abrir el cofre',
      icono: 'icono.cofre.png',
      comportamiento: 'Soltar',
      argumentos: `{
        etiqueta: "CofreAnimado",
        queSoltar: "LlaveAnimado",
        animacionInteractuadoAlFinal: "abrir",
        idTransicion: "abrirCofre"
      }`,
    });

    this.crearBloqueAccion('DarSombrero', {
      descripcion: 'Dar el sombrero',
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
      descripcion: 'Atacar con la espada',
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
      descripcion: 'Escapar en unicornio',
      icono: 'icono.unicornio.png',
      comportamiento: 'Escapar',
      argumentos: `{
        escaparCon: "unicornio"
      }`,
    });

    this.crearBloqueAccion('Escapar', {
      descripcion: 'Escapar',
      comportamiento: 'Escapar',
      argumentos: `{
        receptor: "nave",
        escaparCon: "automata"
      }`,
    });

    this.crearBloqueAccion('TomarHierro', {
      descripcion: 'Agarrar hierro',
      icono: 'icono.hierro.png',
      comportamiento: 'Sostener',
      argumentos: `{
        etiqueta: "HierroAnimado",
        nombreAnimacion: "recogerHierro"
      }`,
    });

    this.crearBloqueAccion('TomarCarbon', {
      descripcion: 'Agarrar carbón',
      id: 'TomarCarbon',
      icono: 'icono.carbon.png',
      comportamiento: 'Sostener',
      argumentos: `{
        etiqueta: "CarbonAnimado",
        nombreAnimacion: "recogerCarbon"
      }`,
    });

    this.crearBloqueAccion('PrenderFogata', {
      descripcion: 'Prender fogata',
      icono: 'icono.FogataPrendida.png',
      comportamiento: 'Interactuar',
      argumentos: `{
        etiqueta: "FogataAnimada",
        nombreAnimacion: "prender",
        animacionInteractuadoAlFinal: "prendida"
      }`,
    });

    this.crearBloqueAccion('Depositar', {
      descripcion: 'Poner en la nave',
      comportamiento: 'Soltar',
      argumentos: `{
        idTransicion: "depositar",
        etiqueta: "NaveAnimada"
      }`,
    });

    this.crearBloqueAccion('AvanzarMono', {
      descripcion: 'Mover a la derecha',
      icono: 'icono.derecha.png',
      comportamiento: 'MoverACasillaDerecha',
      argumentos: '{velocidad: 25}',
    });

    this.crearBloqueAccion('DejarRegalo', {
      descripcion: 'Dejar un regalo',
      icono: 'icono.regalo.png',
      comportamiento: 'Depositar',
      argumentos: '{claseADepositar: "RegaloAnimado"}',
    });

    this.crearBloqueAccion('SiguienteFila', {
      descripcion: 'Pasar a la siguiente fila',
      icono: 'icono.abajo.png',
      comportamiento: 'SiguienteFila',
      argumentos: '{}'
    });

    this.crearBloqueAccion('SiguienteFilaTotal', {
      descripcion: 'Pasar a la siguiente fila',
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
      descripcion: 'Pasar a la siguiente columna',
      icono: 'icono.derecha.png',
      comportamiento: 'SiguienteColumna',
      argumentos: '{}',
    });

    this.crearBloqueAccion('ContarBanana', {
      descripcion: 'Contar una banana',
      icono: 'icono.banana.png',
      comportamiento: 'Contar',
      argumentos: '{etiqueta: "BananaAnimada", nombreAnimacion: "comerBanana"}',
    });

    this.crearBloqueAccion('ContarManzana', {
      descripcion: 'Contar una manzana',
      icono: 'icono.manzana.png',
      comportamiento: 'Contar',
      argumentos: '{etiqueta: "ManzanaAnimada", nombreAnimacion: "comerManzana"}',
    });

    this.crearBloqueAccion('ExplotarGlobo', {
      descripcion: 'Explotar globo',
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

    let blockBuilder = this.blockBuilder;

    let bloque = blockBuilder.createCustomBlock('MoverA', {
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
    }, 
      function() { requiredAllInputs(this) }
    );

    bloque.categoria = "Primitivas";


    this.crearBloqueAccion('PatearPelota', {
      descripcion: 'Patear pelota',
      icono: 'icono.pelota.png',
      comportamiento: 'Interactuar',
      argumentos: `{
        etiqueta: "PelotaAnimada",
        idTransicion: "patear",
        comportamientoAdicional: 'SerPateado',
        argumentosComportamiento: {
          tiempoEnElAire:25,
          aceleracion:0.0025,
          elevacionMaxima:25,
          gradosDeAumentoStep:-2
        }
      }`,
    });

    this.crearBloqueAccion('Avanzar1km', {
      descripcion: 'Avanzar 1 Km',
      icono: 'icono.derecha.png',
      comportamiento: 'VolarHeroicamente',
      argumentos: '{}',
    });

    this.crearBloqueAccion('CambiarColor', {
      descripcion: 'Cambiar color del foco',
      icono: 'icono.cambiar.color.png',
      comportamiento: 'CambiarColor',
      argumentos: '{}',
    });

    this.crearBloqueAccion('SiguienteFoco', {
      descripcion: 'Pasar al siguiente foco',
      icono: 'icono.derecha.png',
      comportamiento: 'MoverACasillaDerecha',
      argumentos: '{}',
    });

    this.crearBloqueAccion('EmpezarFiesta', {
      descripcion: 'Empezar fiesta',
      icono: 'icono.empezar.fiesta.png',
      comportamiento: 'EmpezarFiesta',
      argumentos: '{idTransicion: "empezarFiesta"}',
    });

    this.crearBloqueAccion('VolverAlBordeIzquierdo', {
      descripcion: 'Volver al borde izquierdo',
      icono: 'icono.izquierdaTope.png',
      comportamiento: 'MoverTodoAIzquierda',
      argumentos: '{}',
    });

    this.crearBloqueAccion('IrAlPrimerSospechoso', {
      descripcion: 'Ir al primer sospechoso',
      icono: 'icono.izquierda.png',
      comportamiento: 'MoverTodoAIzquierda',
      argumentos: '{}',
    });

    this.crearBloqueAccion('IrAlSiguienteSospechoso', {
      descripcion: 'Pasar al siguiente sospechoso',
      icono: 'icono.derecha.png',
      comportamiento: 'MoverACasillaDerecha',
      argumentos: '{}',
    });

    this.crearBloqueAccion('InterrogarSospechoso', {
      descripcion: 'Interrogar sospechoso',
      icono: 'icono.sacar.disfraz.png',
      comportamiento: 'SacarDisfraz',
      argumentos: '{}',
    });

    blockBuilder.createCustomBlock('SaltarHaciaAdelante', {
      message0: "%1 Saltar hacia adelante %2",
      colour: Blockly.Blocks.primitivas.COLOUR,
      inputsInline: true,
      previousStatement: true,
      nextStatement: true,
      args0: [
        {
          "type": "field_image",
          "src": `${this.iconsPath}/icono.arriba.png`,
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
    }, 
      function() { requiredAllInputs(this) }
    );

    Blockly.Blocks.SaltarHaciaAdelante.toolbox = `
    <block type="SaltarHaciaAdelante">
      <value name="longitud">
        <block type="math_number"><field name="NUM">100</field></block></value>
    </block>
  `;

    Blockly.Blocks.SaltarHaciaAdelante.categoria = 'Primitivas';



    blockBuilder.createCustomBlock('DibujarLado', {
      message0: "%1 Dibujar lado de %2",
      colour: Blockly.Blocks.primitivas.COLOUR,
      inputsInline: true,
      previousStatement: true,
      nextStatement: true,
      args0: [
        {
          "type": "field_image",
          "src": `${this.iconsPath}/icono.DibujarLinea.png`,
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
    }, 
      function() { requiredAllInputs(this) }
    );

    Blockly.Blocks.DibujarLado.toolbox = `
      <block type="DibujarLado">
        <value name="longitud">
          <block type="math_number"><field name="NUM">100</field></block></value>
      </block>
    `;

    Blockly.Blocks.DibujarLado.categoria = 'Primitivas';

    this.crearBloqueAccion('ComerChurrasco', {
      descripcion: 'Comer churrasco',
      icono: 'icono.churrasco.png',
      comportamiento: 'Recolectar',
      argumentos: '{etiqueta:"Churrasco", nombreAnimacion: "comerChurrasco", animacionInteractuadoMientras: "desaparecer"}',
    });

    this.crearBloqueAccion('AgarrarTomate', {
      descripcion: 'Agarrar tomate',
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
      descripcion: 'Agarrar lechuga',
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
      descripcion: 'Preparar ensalada',
      icono: 'icono.ensaladera.png',
      comportamiento: 'PrepararEnsalada',
      argumentos: `{}`,
    });

    // Para los desafíos de escribir y leer letras

    this.crearBloqueAccion('EscribirLetraActualEnOtraCuadricula', {
      descripcion: 'Escribir letra que estoy tocando',
      icono: 'icono.DibujarLinea.png',
      comportamiento: 'EscribirLetraActualEnOtraCuadricula',
      argumentos: '{}',
    });

    blockBuilder.createCustomBlock('EscribirTextoDadoEnOtraCuadricula', {
      message0: "%1 Escribir: %2",
      colour: Blockly.Blocks.primitivas.COLOUR,
      inputsInline: true,
      previousStatement: true,
      nextStatement: true,
      args0: [
        {
          "type": "field_image",
          "src": `${this.iconsPath}/icono.DibujarLinea.png`,
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

    blockBuilder.createCustomBlock('GirarGrados', {
      message0: "%1 Girar %2 grados",
      colour: Blockly.Blocks.primitivas.COLOUR,
      inputsInline: true,
      previousStatement: true,
      nextStatement: true,
      args0: [
        {
          "type": "field_image",
          "src": `${this.iconsPath}/icono.Girar.png`,
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
    }, 
      function() { requiredAllInputs(this) }
    );
    

    Blockly.Blocks.GirarGrados.toolbox = `
      <block type="GirarGrados">
        <value name="grados">
          <block type="math_number"><field name="NUM">90</field></block></value>
      </block>
    `;

    Blockly.Blocks.GirarGrados.categoria = 'Primitivas';

    this.crearBloqueAccion('MoverArribaDibujando', {
      descripcion: 'Mover arriba dibujando',
      icono: 'icono.arribaDibujando.png',
      comportamiento: 'DibujarLinea',
      argumentos: '{direccion: [0,1], nombreAnimacion: "correrDibujando", dibujarPuntos: true}',
    });

    this.crearBloqueAccion('MoverAbajoDibujando', {
      descripcion: 'Mover abajo dibujando',
      icono: 'icono.abajoDibujando.png',
      comportamiento: 'DibujarLinea',
      argumentos: '{direccion: [0,-1], nombreAnimacion: "correrDibujando", dibujarPuntos: true}',
    });

    this.crearBloqueAccion('MoverDerechaDibujando', {
      descripcion: 'Mover derecha dibujando',
      icono: 'icono.derechaDibujando.png',
      comportamiento: 'DibujarLinea',
      argumentos: '{direccion: [1,0], nombreAnimacion: "correrDibujando", dibujarPuntos: true}',
    });

    this.crearBloqueAccion('MoverIzquierdaDibujando', {
      descripcion: 'Mover izquierda dibujando',
      icono: 'icono.izquierdaDibujando.png',
      comportamiento: 'DibujarLinea',
      argumentos: '{direccion: [-1,0], nombreAnimacion: "correrDibujando", dibujarPuntos: true}',
    });

    this.crearBloqueAccion('SaltarArriba', {
      descripcion: 'Saltar arriba',
      icono: 'icono.arriba.png',
      comportamiento: 'SaltarAnimado',
      argumentos: '{direccion: [0,1], distancia: 50, alturaDeseada: 50, velocidad_inicial: 20, nombreAnimacion: "saltar"}',
    });

    this.crearBloqueAccion('SaltarAbajo', {
      descripcion: 'Saltar abajo',
      icono: 'icono.abajo.png',
      comportamiento: 'SaltarAnimado',
      argumentos: '{direccion: [0,-1], distancia: 50, alturaDeseada: 50, velocidad_inicial: 20, nombreAnimacion: "saltar"}',
    });

    this.crearBloqueAccion('SaltarDerecha', {
      descripcion: 'Saltar derecha',
      icono: 'icono.derecha.png',
      comportamiento: 'SaltarAnimado',
      argumentos: '{direccion: [1,0], distancia: 50, alturaDeseada: 50, velocidad_inicial: 20, nombreAnimacion: "saltar"}',
    });

    this.crearBloqueAccion('SaltarIzquierda', {
      descripcion: 'Saltar izquierda',
      icono: 'icono.izquierda.png',
      comportamiento: 'SaltarAnimado',
      argumentos: '{direccion: [-1,0], distancia: 50, alturaDeseada: 50, velocidad_inicial: 20, nombreAnimacion: "saltar"}',
    });

    this.crearBloqueAccion('MoverLeyendoDerecha', {
      descripcion: 'Mover a la derecha',
      icono: 'icono.derecha.png',
      comportamiento: 'MoverLeyendoDerecha',
      argumentos: '{}',
    });

    this.crearBloqueAccion('MoverLeyendoIzquierda', {
      descripcion: 'Mover a la izquierda',
      icono: 'icono.izquierda.png',
      comportamiento: 'MoverLeyendoIzquierda',
      argumentos: '{}',
    });

    this.crearBloqueAccion('MoverLeyendoArriba', {
      descripcion: 'Mover arriba',
      icono: 'icono.arriba.png',
      comportamiento: 'MoverLeyendoArriba',
      argumentos: '{}',
    });

    this.crearBloqueAccion('MoverLeyendoAbajo', {
      descripcion: 'Mover abajo',
      icono: 'icono.abajo.png',
      comportamiento: 'MoverLeyendoAbajo',
      argumentos: '{}',
    });

  },

  _definirBloquesSensores() {

    this.crearBloqueSensor('TocandoBanana', {
      descripcion: 'Hay banana acá',
      icono: 'icono.banana.png',
      funcionSensor: 'tocando("BananaAnimada")',
      esBool: true
    });

    this.crearBloqueSensor('TocandoManzana', {
      descripcion: 'Hay manzana acá',
      icono: 'icono.manzana.png',
      funcionSensor: 'tocando("ManzanaAnimada")',
      esBool: true
    });

    this.crearBloqueSensor('TocandoNaranja', {
      descripcion: 'Hay una naranja acá',
      icono: 'icono.naranja.png',
      funcionSensor: 'tocando("NaranjaAnimada")',
      esBool: true
    });

    this.crearBloqueSensor('TocandoFogata', {
      descripcion: 'Hay fogata acá',
      icono: 'icono.FogataApagada.png',
      funcionSensor: 'tocando("FogataAnimada")',
      esBool: true
    });

    this.crearBloqueSensor('TocandoInicio', {
      descripcion: 'Estoy al inicio',
      icono: 'icono.futbolInicio.png',
      funcionSensor: 'tocandoInicio()',
      esBool: true
    });

    this.crearBloqueSensor('TocandoPelota', {
      descripcion: 'Llegué a la pelota',
      icono: 'icono.pelota.png',
      funcionSensor: 'tocando("PelotaAnimada")',
      esBool: true
    });

    this.crearBloqueSensor('TocandoFinal', {
      descripcion: 'Llegué al final',
      icono: 'icono.titoFinalizacion.png',
      funcionSensor: 'estoyUltimaFila()',
      esBool: true
    });

    this.crearBloqueSensor('KmsTotales', {
      descripcion: 'Kilómetros a recorrer',
      icono: 'icono.kms.png',
      funcionSensor: 'kmsTotales()',
    });

    this.crearBloqueSensor('EstoyEnEsquina', {
      descripcion: 'Estoy en una esquina',
      icono: 'icono.prendiendoLasCompus2.png',
      funcionSensor: 'casillaActual().esEsquina()',
      esBool: true
    });

    this.crearBloqueSensor('EstoySobreElInicio', {
      descripcion: 'Estoy al inicio de la columna',
      icono: 'icono.casillainiciomono.png',
      funcionSensor: 'casillaActual().esInicio()',
      esBool: true
    });

    this.crearBloqueSensor('EstoySobreElFinal', {
      descripcion: 'Estoy al final de la columna',
      icono: 'icono.casillafinalmono.png',
      funcionSensor: 'casillaActual().esFin()',
      esBool: true
    });

    this.crearBloqueSensor('LargoColumnaActual', {
      descripcion: 'Largo de la columna actual',
      icono: 'icono.largoCol.png',
      funcionSensor: 'largoColumnaActual()-1',
    });

    this.crearBloqueSensor('TocandoAbajo', {
      descripcion: 'Puedo mover abajo',
      icono: 'icono.abajo.png',
      funcionSensor: 'tocandoFlechaAbajo()',
      esBool: true
    });

    this.crearBloqueSensor('TocandoDerecha', {
      descripcion: 'Puedo mover a la derecha',
      icono: 'icono.derecha.png',
      funcionSensor: 'tocandoFlechaDerecha()',
      esBool: true
    });

    this.crearBloqueSensor('TocandoFinCamino', {
      descripcion: 'Llegó a la meta',
      icono: 'icono.finCamino.png',
      funcionSensor: 'alFinalDelCamino()',
      esBool: true
    });

    this.crearBloqueSensor('TocandoQueso', {
      descripcion: 'Hay queso acá',
      icono: 'queso.png',
      funcionSensor: 'tocando("QuesoAnimado")',
      esBool: true
    });

    this.crearBloqueSensor('TocandoLuz', {
      descripcion: 'Hay lamparita acá',
      icono: 'icono.LamparitaApagada.png',
      funcionSensor: 'tocando("Lamparin")',
      esBool: true
    });

    this.crearBloqueSensor('EsCulpable', {
      id: 'Descubralculpable',
      descripcion: 'Estoy frente al culpable',
      icono: 'icono.culpable.png',
      funcionSensor: 'colisionaConElCulpable() && pilas.escena_actual().culpable.teEncontraron()',
      esBool: true
    });

    this.crearBloqueSensor('HayChurrasco', {
      descripcion: 'Hay un churrasco acá',
      icono: 'icono.churrasco.png',
      funcionSensor: 'tocando("Churrasco")',
      esBool: true
    });

    this.crearBloqueSensor('HayObstaculoArriba', {
      descripcion: 'Hay un obstáculo arriba',
      icono: 'icono.arriba.png',
      funcionSensor: 'tieneEnLaCasillaDeArriba("Obstaculo")',
      esBool: true
    });

    this.crearBloqueSensor('HayObstaculoAbajo', {
      descripcion: 'Hay un obstáculo abajo',
      icono: 'icono.abajo.png',
      funcionSensor: 'tieneEnLaCasillaDeAbajo("Obstaculo")',
      esBool: true
    });

    this.crearBloqueSensor('HayObstaculoIzquierda', {
      descripcion: 'Hay un obstáculo a la izquierda',
      icono: 'icono.izquierda.png',
      funcionSensor: 'tieneEnLaCasillaASuIzquierda("Obstaculo")',
      esBool: true
    });

    this.crearBloqueSensor('HayObstaculoDerecha', {
      descripcion: 'Hay un obstáculo a la derecha',
      icono: 'icono.derecha.png',
      funcionSensor: 'tieneEnLaCasillaASuDerecha("Obstaculo")',
      esBool: true
    });

    this.crearBloqueSensor('HayCharco', {
      descripcion: 'Hay un charco',
      icono: 'icono.charco.png',
      funcionSensor: 'hayEnEscena("Charco")',
      esBool: true
    });

    let sensorHayVocal = this.blockBuilder.createCustomBlock('hayVocalRMT', {
      "type": "block_type",
      "message0": "%1 ¿La letra actual es una %2 ?",
      "args0": [
        {
          type: "field_image",
          src: `${this.iconsPath}/icono.DibujarLinea.png`,
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
      descripcion: 'Hay lechuga acá',
      icono: 'icono.lechuga.png',
      funcionSensor: 'tocando("Lechuga")',
      esBool: true
    });

    this.crearBloqueSensor('HayTomate', {
      descripcion: 'Hay tomate acá',
      icono: 'icono.tomate.png',
      funcionSensor: 'tocando("Tomate")',
      esBool: true
    });

  },

  _definirBloquesQueRepresentanValores() {

    this.crearBloqueValor("ParaLaDerecha", {
      descripcion: 'la derecha',
      icono: 'icono.derecha.png',
      valor: 'derecha',
      colour: Blockly.Blocks.direcciones.COLOUR,
    });

    this.crearBloqueValor('ParaLaIzquierda', {
      descripcion: 'la izquierda',
      icono: 'icono.izquierda.png',
      valor: 'izquierda',
      colour: Blockly.Blocks.direcciones.COLOUR,
    });

    this.crearBloqueValor('ParaArriba', {
      descripcion: 'arriba',
      icono: 'icono.arriba.png',
      valor: 'arriba',
      colour: Blockly.Blocks.direcciones.COLOUR,
    });

    this.crearBloqueValor('ParaAbajo', {
      descripcion: 'abajo',
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
      onchange: function(event) {
        if (event && event.runCode) {
          this.setWarningText("¡Acá falta un bloque expresión!")
          opaque(this)
        }
      }
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
      onchange: function(event) {
        if (event && event.runCode) {
          this.setWarningText("¡Acá faltan bloques comandos!")
          opaque(this)
        }
      }
    };

    Blockly.Blocks.al_empezar_a_ejecutar = {
      init: function () {
        this.setColour(Blockly.Blocks.eventos.COLOUR);
        this.appendDummyInput().appendField('Al empezar a ejecutar');
        this.appendStatementInput('program');
        this.setDeletable(false);
        this.setEditable(false);
        this.setMovable(false);
        requiredAllInputs(this)
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
        
        requiredAllInputs(this);
        requiredAllInputs(this);
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

        requiredAllInputs(this);
        requiredAllInputs(this);
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

        requiredAllInputs(this);
        requiredAllInputs(this);
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
          .appendField('si no');
        this.appendStatementInput('block2');
        this.setPreviousStatement(true);
        this.setNextStatement(true);

        requiredAllInputs(this);
        requiredAllInputs(this);
        requiredAllInputs(this);
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

    function isInsideProcedureDef(paramBlock) {
      return paramBlock.getRootBlock().id === paramBlock.$parent;
    }

    function hasParam(procedureBlock, paramBlock) {
      return getParams(procedureBlock).includes(paramBlock.getFieldValue('VAR'))
    }

    function isFlying(block) {
      return block.getRootBlock() === block;
    }

    function getName(procedureBlock) {
      return procedureBlock.getProcedureDef()[0];
    }

    function getParams(procedureBlock) {
      return procedureBlock.getProcedureDef()[1]
    }

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
      requiredAllInputs(this)
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
    this.blockBuilder.createCustomBlock('OpAritmetica', {
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
    },
      function() { 
        requiredAllInputs(this)
        requiredAllInputs(this)
      } 
    );

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

    this.blockBuilder.createCustomBlock('OpComparacion', {
      "type": "logic_compare",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "input_value",
          "name": "A"
        },
        {
          "type": "field_dropdown",
          "name": "OP",
          "options": [
            ["=", "EQ"],
            ["\u2260", "NEQ"],
            ["\u200F<", "LT"],
            ["\u200F\u2264", "LTE"],
            ["\u200F>", "GT"],
            ["\u200F\u2265", "GTE"]
          ]
        },
        {
          "type": "input_value",
          "name": "B"
        }
      ],
      "inputsInline": true,
      "output": "Boolean",
      "helpUrl": "%{BKY_LOGIC_COMPARE_HELPURL}",
      "extensions": ["logic_compare", "logic_op_tooltip"]
    },
      function() { 
        requiredAllInputs(this)
        requiredAllInputs(this)
      } 
    );
    
    Blockly.MyLanguage.OpComparacion = function(block) {
      // Comparison operator.
      var OPERATORS = {
        'EQ': '==',
        'NEQ': '!=',
        'LT': '<',
        'LTE': '<=',
        'GT': '>',
        'GTE': '>='
      };
      var operator = OPERATORS[block.getFieldValue('OP')];
      var order = (operator === '==' || operator === '!=') ?
          Blockly.JavaScript.ORDER_EQUALITY : Blockly.JavaScript.ORDER_RELATIONAL;
      var argument0 = Blockly.JavaScript.valueToCode(block, 'A', order) || '0';
      var argument1 = Blockly.JavaScript.valueToCode(block, 'B', order) || '0';
      var code = argument0 + ' ' + operator + ' ' + argument1;
      return [code, order];
    };    

    Blockly.Blocks.OpComparacion.categoria = 'Operadores';
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

};

export const Categories = [
{
    name: 'Primitivas'
  },
{
  name: 'Sensores'
},
{name: 'Valores'},
{name: 'Repeticiones'},
{name: 'Alternativas'},
{name: 'Operadores'},
{name: 'Mis procedimientos'},
];

export default pbBlocks;
