// Copyright Alfredo Héctor Sanzo - asanzo@github

// Takes a function, evaluates it "this" times.
Number.prototype.timesRepeat = function(f){
	for(var i=0; i<this; i++){
		f();
	}
}

// Takes an object, gives back a list with the object repeated "this" times.
Number.prototype.times = function(object){
	var l = [];
	this.timesRepeat(function(){l.push(object)});
	return l;
};/// <reference path = "../../dependencias/pilasweb.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/* @class HabilidadAnimada
 * Es la clase de la que heredan todas en ejerciciosPilas, donde
 * va el comportamiento en común que no quiero poner en pilasweb
 *
*/
var HabilidadAnimada = (function (_super) {
    __extends(HabilidadAnimada, _super);
    function HabilidadAnimada() {
        _super.apply(this, arguments);
    }
    HabilidadAnimada.prototype.implicaMovimiento = function () {
        return false;
    };
    return HabilidadAnimada;
})(Habilidad);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "HabilidadAnimada.ts"/>
var Animar = (function (_super) {
    __extends(Animar, _super);
    function Animar(receptor, argumentos) {
        _super.call(this, receptor, argumentos);
        this.setearNombreAnimacion();
        this.nombreAnimacion = this.nombreAnimacion || this.argumentos.nombreAnimacion;
        if (this.nombreAnimacion)
            this.receptor.cargarAnimacion(this.nombreAnimacion());
    }
    /* Redefinir si corresponde animar la habilidad. Debe setear this.nombreAnimacion.
     También se puede pasar por uno de los argumentos el nombre de la animación.*/
    Animar.prototype.setearNombreAnimacion = function () {
    };
    // No redefinir
    Animar.prototype.actualizar = function () {
        this.receptor.avanzarAnimacion();
        this.doActualizar();
    };
    Animar.prototype.doActualizar = function () {
        // Redefinir para agregar comportamiento además de la animación
    };
    return Animar;
})(HabilidadAnimada);
/// <reference path = "../../dependencias/pilasweb.d.ts" />
/// <reference path = "../habilidades/Animar.ts" />
/**
 * @class ActorAnimado
 *
 * Representa un actor que tiene una animación cuando se mueve.
 * Las opciones deben incluir la grilla (imagen) y la cantidad de cuadros que tiene,
 * ó bien la grilla y la lista de cuadros que representan la animación. También puede
 * incluir el cuadroEstatico, que es el cuadro que se muestra al estar parado.
 *
 * Por ejemplo:
 *      @example
 *      miActor = new ActorAnimado(0,0,...documentación en ptrogreso...);
 *      miActor.hacer_luego(CaminaDerecha,{pasos: 2});
 */
var ActorAnimado = (function (_super) {
    __extends(ActorAnimado, _super);
    function ActorAnimado(x, y, opciones) {
        this.desPausar();
        this.sanitizarOpciones(opciones);
        _super.call(this, this.animacionPara(this.opciones.grilla), x, y);
        this.z = pilas.escena_actual().minZ() - 1;
        this.setupAnimacion();
        this.objetosRecogidos = [];
        this.habilidadesSuspendidas = [];
    }
    ActorAnimado.prototype.pre_actualizar = function () {
        if (!this.pausado)
            _super.prototype.pre_actualizar.call(this);
    };
    ActorAnimado.prototype.pausar = function () {
        this.pausado = true;
    };
    ActorAnimado.prototype.desPausar = function () {
        this.pausado = false;
    };
    ActorAnimado.prototype.sanitizarOpciones = function (ops) {
        this.opciones = ops;
        this.opciones.cuadrosCorrer = ops.cuadrosCorrer || this.seguidillaHasta(ops.cantColumnas) || [0];
        this.opciones.cuadrosParado = ops.cuadrosParado || [0];
        this.opciones.cantColumnas = ops.cantColumnas || this.opciones.cuadrosCorrer.length;
        this.opciones.cantFilas = ops.cantFilas || 1;
    };
    ActorAnimado.prototype.mover = function (x, y) {
        this.x += x;
        this.y += y;
        this.pasito_correr();
    };
    ActorAnimado.prototype.definirAnimacion = function (nombre, cuadros, velocidad, cargarla) {
        if (cargarla === void 0) { cargarla = false; }
        this._imagen.definir_animacion(nombre, cuadros, velocidad);
        if (cargarla)
            this.cargarAnimacion(nombre);
    };
    ActorAnimado.prototype.pasito_correr = function () {
        this.cargarAnimacion("correr");
        this._imagen.avanzar();
    };
    ActorAnimado.prototype.tocando = function (etiqueta) {
        var _this = this;
        return pilas.obtener_actores_con_etiqueta(etiqueta).some(function (objeto) { return objeto.colisiona_con(_this); });
        //var actores = pilas.obtener_actores_en(this.x, this.y + 20, etiqueta);
        //return actores.length > 0;
    };
    ;
    ActorAnimado.prototype.estoyUltimaFila = function () {
        return this.cuadricula.cantFilas - 1 == this.casillaActual().nroFila;
    };
    ActorAnimado.prototype.cambiarImagen = function (nombre) {
        this.imagen = this.animacionPara(nombre);
    };
    ActorAnimado.prototype.animacionPara = function (nombre) {
        return pilas.imagenes.cargar_animacion(nombre, this.opciones.cantColumnas, this.opciones.cantFilas);
    };
    ActorAnimado.prototype.tocandoFin = function () {
        return this.casillaActual().casillaASuDerecha() == undefined;
        // return  pilas.escena_actual().cuadricula.tocandoFin(this)
        // cada cuadricula (multiple,esparsa,etc) implementa su tocandoFin de manera diferente
    };
    ActorAnimado.prototype.tocandoInicio = function () {
        return this.casillaActual().nroColumna == 0;
    };
    ActorAnimado.prototype.setupAnimacion = function () {
        this.definirAnimacion("correr", this.opciones.cuadrosCorrer, 5);
        this.definirAnimacion("parado", this.opciones.cuadrosParado, 5);
        this.animar();
        this.cargarAnimacion("parado");
    };
    ActorAnimado.prototype.detenerAnimacion = function () {
        this.olvidar(Animar);
    };
    ActorAnimado.prototype.animar = function () {
        this.aprender(Animar, {}); //Hace la magia de animar constantemente.
    };
    ActorAnimado.prototype.cargarAnimacion = function (nombre) {
        this._imagen.cargar_animacion(nombre);
    };
    ActorAnimado.prototype.avanzarAnimacion = function () {
        return !this._imagen.avanzar();
    };
    ActorAnimado.prototype.cantidadDeSprites = function () {
        return this._imagen.animacion_en_curso.cuadros.length;
    };
    ActorAnimado.prototype.nombreAnimacionActual = function () {
        return this._imagen.animacion_en_curso.nombre;
    };
    ActorAnimado.prototype.seguidillaHasta = function (nro) {
        var seguidilla = [];
        if (nro !== undefined) {
            for (var i = 0; i < nro; i++) {
                seguidilla.push(i);
            }
        }
        else {
            seguidilla.push(0);
        }
        return seguidilla;
    };
    ActorAnimado.prototype.clonar = function () {
        /*var clon =*/ return new this.constructor(this.x, this.y, this.opciones);
        /*for (var attr in this){
            if(typeof this[attr] != "function"){
                clon[attr] = this[attr];
            }
        }
        return clon;*/
    };
    //TODO poner en otra clase lo q tenga q ver con casillas
    ActorAnimado.prototype.casillaActual = function () {
        return this._casillaActual;
    };
    ActorAnimado.prototype.setCasillaActual = function (c, moverseAhi) {
        if (moverseAhi === void 0) { moverseAhi = false; }
        this._casillaActual = c;
        if (moverseAhi) {
            this.x = c.x;
            this.y = c.y;
        }
    };
    ActorAnimado.prototype.cuando_busca_recoger = function () {
        pilas.escena_actual().intentaronRecoger();
    };
    ActorAnimado.prototype.recoger = function (a) {
        pilas.escena_actual().intentaronRecoger(a);
    };
    ActorAnimado.prototype.colisiona_con = function (objeto) {
        if (this.cuadricula) {
            return this.cuadricula.colisionan(this, objeto);
        }
        else {
            return _super.prototype.colisiona_con.call(this, objeto);
        }
    };
    ActorAnimado.prototype.suspenderHabilidadesConMovimiento = function () {
        var _this = this;
        this.habilidadesSuspendidas = this.habilidadesSuspendidas.concat(this.habilidades.filter(function (hab) { return hab.implicaMovimiento(); }));
        this.habilidadesSuspendidas.forEach(function (hab) { return _this.olvidar(hab); });
    };
    ActorAnimado.prototype.activarHabilidadesConMovimiento = function () {
        this.habilidadesSuspendidas.forEach(function (hab) {
            hab.actualizarPosicion();
            this.aprender(hab);
        }.bind(this));
        this.habilidadesSuspendidas = [];
    };
    return ActorAnimado;
})(Actor);
// Helper para construir las animaciones:
var Cuadros = (function () {
    function Cuadros(nroOLista) {
        this._lista = (typeof (nroOLista) === "number") ? [nroOLista] : nroOLista;
    }
    Cuadros.prototype.repetirVeces = function (veces) {
        var lOrig = this._lista;
        for (var i = 0; i < veces - 1; i++) {
            this._lista = this._lista.concat(lOrig);
        }
        return this._lista;
    };
    Cuadros.prototype.repetirRandom = function (veces) {
        return this.repetirVeces(Math.round(Math.random() * veces));
    };
    Cuadros.prototype.lista = function () {
        return this._lista;
    };
    return Cuadros;
})();
/// <reference path = "../../dependencias/pilasweb.d.ts" />
/// <reference path = "ActorAnimado.ts" />
var ActorCompuesto = (function (_super) {
    __extends(ActorCompuesto, _super);
    function ActorCompuesto(x, y, opciones) {
        opciones.grilla = 'invisible.png';
        _super.call(this, x, y, opciones);
        this.inicializarSubactores();
    }
    ActorCompuesto.prototype.sanitizarOpciones = function (opciones) {
        _super.prototype.sanitizarOpciones.call(this, opciones);
        if (!opciones.subactores)
            throw "Se debe especificar una lista de subactores";
        this.subactores = opciones.subactores;
    };
    ActorCompuesto.prototype.inicializarSubactores = function () {
        var _this = this;
        this.subactores.forEach(function (actor) { return _this.apegarActor(actor); });
    };
    ActorCompuesto.prototype.agregarSubactor = function (actor) {
        this.subactores.push(actor);
        this.apegarActor(actor);
    };
    ActorCompuesto.prototype.apegarActor = function (actor) {
        actor.agregar_habilidad(ImitarAtributosNumericos, {
            objeto_a_imitar: this,
            atributos: ['x', 'y', 'escala_x', 'escala_y'],
            setters: { 'x': 'setX', 'y': 'setY' },
        });
    };
    ActorCompuesto.prototype.eliminarUltimoSubactor = function () {
        this.subactores.pop().eliminar();
    };
    ///////////////////////////////////////////////////////
    // A partir de acá son los métodos del composite polimórfico
    //////////////////////////////////////////////////////
    ActorCompuesto.prototype.eliminar = function () {
        _super.prototype.eliminar.call(this);
        this.subactores.forEach(function (actor) { return actor.eliminar(); });
    };
    ActorCompuesto.prototype.cargarAnimacion = function (nombre) {
        this.subactores.forEach(function (actor) { return actor.cargarAnimacion(nombre); });
    };
    ActorCompuesto.prototype.avanzarAnimacion = function () {
        var parar = false;
        this.subactores.forEach(function (actor) { return parar = parar || actor.avanzarAnimacion(); });
        return parar;
    };
    ActorCompuesto.prototype.nombreAnimacionActual = function () {
        return this.subactores[0].nombreAnimacionActual();
    };
    ActorCompuesto.prototype.detenerAnimacion = function () {
        this.subactores.forEach(function (actor) { return actor.detenerAnimacion(); });
    };
    ActorCompuesto.prototype.animar = function () {
        this.subactores.forEach(function (actor) { return actor.animar(); });
    };
    return ActorCompuesto;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var AlienAnimado = (function (_super) {
    __extends(AlienAnimado, _super);
    function AlienAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'alienAnimado.png', cantColumnas: 14 });
        this.definirAnimacion("parado", new Cuadros(13).repetirVeces(50).concat([12, 13, 11, 12, 11, 13]).concat(new Cuadros(13).repetirVeces(30)).concat([9, 9, 9, 9, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8]), 4, true);
        this.definirAnimacion("hablar", [12, 13, 11, 12, 11, 13], 15);
        this.definirAnimacion("recoger", [12, 10, 10, 12], 6);
        this.definirAnimacion("correr", [0, 1, 2, 3, 4, 3, 2, 1], 20);
        this.definirAnimacion("apretar", [12, 6, 5, 5, 5, 5, 5, 6, 12, 13], 6);
        this.definirAnimacion("SerAnimado", [0, 1, 2, 3, 4, 3, 2, 1], 20);
    }
    return AlienAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var AlimentoAnimado = (function (_super) {
    __extends(AlimentoAnimado, _super);
    function AlimentoAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'alimento_pez.png', cantColumnas: 1, cantFilas: 1 });
    }
    return AlimentoAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var BananaAnimada = (function (_super) {
    __extends(BananaAnimada, _super);
    function BananaAnimada(x, y) {
        _super.call(this, x, y, { grilla: 'banana-1.png', cantColumnas: 1, cantFilas: 1 });
    }
    return BananaAnimada;
})(ActorAnimado);
var BotonAnimado = (function (_super) {
    __extends(BotonAnimado, _super);
    function BotonAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'botonAnimado.png', cantColumnas: 2 });
        this.definirAnimacion("apagada", [0], 1);
        this.definirAnimacion("prendida", [1], 1);
    }
    return BotonAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var BuzoAnimado = (function (_super) {
    __extends(BuzoAnimado, _super);
    function BuzoAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'buzo.png', cantColumnas: 8, cantFilas: 1 });
        this.definirAnimacion("parado", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 1], 4, true);
        this.definirAnimacion("recoger", [3, 4, 5, 6, 7], 6);
        this.definirAnimacion("correr", [1, 0, 2, 1], 10);
    }
    return BuzoAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var CaballeroAnimado = (function (_super) {
    __extends(CaballeroAnimado, _super);
    function CaballeroAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'caballero_oscuro.png', cantColumnas: 3 });
        this.definirAnimacion("parado", new Cuadros(0).repetirVeces(95).concat([1, 2, 1]), 6, true);
        this.definirAnimacion("defender", [1, 2, 2, 2, 2, 2, 2, 1], 6);
    }
    return CaballeroAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var CangrejoAnimado = (function (_super) {
    __extends(CangrejoAnimado, _super);
    function CangrejoAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'cangrejo.png', cantColumnas: 8, cantFilas: 3 });
        this.definirAnimacion("parado", [0, 1, 2, 3, 4, 5, 6, 7], 6, true);
        this.definirAnimacion("correr", [9, 10, 11, 12, 13], 12);
        this.definirAnimacion("recoger", [17, 18, 19, 20, 21, 21, 21, 19, 19], 6);
    }
    return CangrejoAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var CarbonAnimado = (function (_super) {
    __extends(CarbonAnimado, _super);
    function CarbonAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'carbon_animado.png', cantColumnas: 3, cantFilas: 1 });
        this.definirAnimacion("quedan3", [0], 1);
        this.definirAnimacion("quedan2", [1], 1);
        this.definirAnimacion("quedan1", [2], 1);
        this.definirAnimacion("correr", [2], 1);
    }
    return CarbonAnimado;
})(ActorAnimado);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/ActorAnimado.ts"/>
/**
 * @class Casilla
 * Este actor no puede funcionar sólo. Siempre funciona y es creado desde
 * el actor Cuadricula. Todo su comportamiento depende de ella.
 */
var Casilla = (function (_super) {
    __extends(Casilla, _super);
    function Casilla(nroF, nroC, cuadricula) {
        this.cuadricula = cuadricula;
        this.nroFila = nroF;
        this.nroColumna = nroC;
        _super.call(this, 0, 0, cuadricula.getOpcionesCasilla());
        this.reubicate();
    }
    Casilla.prototype.reubicate = function () {
        this.actualizarAncho();
        this.actualizarAlto();
        this.reubicarEnX();
        this.reubicarEnY();
    };
    Casilla.prototype.reubicarEnX = function () {
        this.x =
            this.cuadricula.izquierda +
                (this.ancho / 2) +
                (this.nroColumna * (this.ancho + this.cuadricula.separacion()));
    };
    Casilla.prototype.reubicarEnY = function () {
        this.y =
            this.cuadricula.arriba -
                (this.alto / 2) -
                (this.nroFila * (this.alto + this.cuadricula.separacion()));
    };
    Casilla.prototype.actualizarAncho = function () {
        this.ancho = this.cuadricula.anchoCasilla();
    };
    Casilla.prototype.actualizarAlto = function () {
        this.alto = this.cuadricula.altoCasilla();
    };
    Casilla.prototype.casillaASuDerecha = function () {
        return this.cuadricula.casilla(this.nroFila, this.nroColumna + 1);
    };
    Casilla.prototype.casillaASuIzquierda = function () {
        return this.cuadricula.casilla(this.nroFila, this.nroColumna - 1);
    };
    Casilla.prototype.casillaDeArriba = function () {
        return this.cuadricula.casilla(this.nroFila - 1, this.nroColumna);
    };
    Casilla.prototype.casillaDeAbajo = function () {
        return this.cuadricula.casilla(this.nroFila + 1, this.nroColumna);
    };
    Casilla.prototype.sos = function (nroF, nroC) {
        return nroF == this.nroFila && nroC == this.nroColumna;
    };
    Casilla.prototype.cambiarImagen = function (nombre) {
        // PARCHEEEEE
        this.renacer(nombre);
    };
    Casilla.prototype.renacer = function (nombreImagen) {
        // POR FAVOR YO FUTURO PERDONAME
        var pos = this.cuadricula.casillas.indexOf(this);
        this.cuadricula.casillas.slice(pos, pos + 1);
        this.eliminar();
        var grillaCasilla = this.cuadricula.opcionesCasilla.grilla;
        this.cuadricula.opcionesCasilla.grilla = nombreImagen;
        var nuevoYo = new Casilla(this.nroFila, this.nroColumna, this.cuadricula);
        this.cuadricula.opcionesCasilla.grilla = grillaCasilla;
        this.cuadricula.casillas.push(nuevoYo);
    };
    return Casilla;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var CofreAnimado = (function (_super) {
    __extends(CofreAnimado, _super);
    function CofreAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'cofreAnimado.png', cantColumnas: 4 });
        this.definirAnimacion("abrir", [0, 1, 2, 3], 3);
        this.definirAnimacion("parado", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2], 1, true);
        this.definirAnimacion("abierto", [3], 4);
    }
    return CofreAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var CompuAnimada = (function (_super) {
    __extends(CompuAnimada, _super);
    function CompuAnimada(x, y) {
        _super.call(this, x, y, { grilla: 'compu_animada.png', cantColumnas: 8, cantFilas: 1 });
        this.definirAnimacion("parado", [0], 5);
        this.definirAnimacion("prendida", [1], 5);
        this.definirAnimacion("claveok", [2], 5);
        this.definirAnimacion("instalado", [3, 4, 5, 6, 7], 1);
    }
    return CompuAnimada;
})(ActorAnimado);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Casilla.ts"/>
/**
 * class @Cuadricula
 *
 * Este actor sirve para dibujar una cuadrícula en pantalla, que
 * tenga casillas.
 *
 * Cada casilla tiene la misma grilla (y el cuadro que se muestre puede variar en cada una)
 * Las opciones del Actor cuadrícula son el 5to parámetro.
 * Las opciones del CADA CASILLA son el 6to parámetro. Estas opciones son exactamente
 * las mismas que para cualquier ActorAnimado.
 *
 * Hay varias maneras de crear la cuadrícula.
 *
 * Por ejemplo, si quiero crear una cuadrícula así:
 *     una banana (sprite de 2 cuadros), ubicada en 0,0, con 3 filas y 4 columnas,
 *     que ocupe toda la pantalla.
 * lo hago así:
 *     new Cuadricula(0,0,3,4,{}
 *           {grilla: 'banana.png',
 *           cantColumnas: 2})
 *
 * Si no se especifica ningún tipo de medida, se toma la de toda la pantalla.

 * Ahora, si quiero lo mismo pero con casillas de 50 x 100,
 * lo hago así:
 *     new Cuadricula(0,0,3,4,{}
 *           {grilla: 'banana.png',
 *           cantColumnas: 2,
 *           ancho: 50,
 *           alto: 100})
 *
 * Otro ejemplo, si quiero crear una cuadrícula igual que las anteriores,
 * pero definiendo el ancho y alto totales de la cuadrícula
 *     (y no de cada casilla) como de 300 x 300
 * lo hago así:
 *     new Cuadricula(0,0,3,4,
 *           {ancho: 300,
 *           alto: 300},
 *           {grilla: 'banana.png',
 *           cantColumnas: 2})
 *
 * Nótese que esta vez las opciones que se eligieron son las de la cuadrícula, y
 * no las de la casilla.
 *
 * IMPORTANTE:
 *   No usar cuadricula.ancho = 300 para cambiar el ancho de la cuadrícula.
 *   Usar en vez de ello cuadricula.setAncho(300);
 *   Idem con el alto.
 *   Aunque claro que lo mejor es crearla directamente con las opciones.
 */
var Cuadricula = (function (_super) {
    __extends(Cuadricula, _super);
    function Cuadricula(x, y, cantFilas, cantColumnas, opcionesCuadricula, opcionesCasilla) {
        this.cantFilas = cantFilas;
        this.cantColumnas = cantColumnas;
        this.sanitizarOpciones(opcionesCuadricula, opcionesCasilla);
        _super.call(this, this.opcionesCuadricula.imagen, x, y, opcionesCuadricula);
        this.ancho = this.cantColumnas * opcionesCasilla.ancho + (this.separacion() * (this.cantColumnas - 1));
        this.alto = this.cantFilas * opcionesCasilla.alto + (this.separacion() * (this.cantFilas - 1));
        this.crearCasillas();
    }
    //TODO: Podría agregar que tome las dimensiones de la
    //imagen como último valor de ancho y alto por defecto
    Cuadricula.prototype.sanitizarOpciones = function (opcionesCuadricula, opcionesCasilla) {
        this.opcionesCasilla = opcionesCasilla;
        this.opcionesCuadricula = opcionesCuadricula;
        this.opcionesCuadricula.imagen = this.opcionesCuadricula.imagen || 'invisible.png';
        this.opcionesCuadricula.ancho = this.opcionesCuadricula.ancho || pilas.opciones.ancho;
        this.opcionesCuadricula.alto = this.opcionesCuadricula.alto || pilas.opciones.alto;
        this.opcionesCuadricula.separacionEntreCasillas = this.opcionesCuadricula.separacionEntreCasillas || 0;
        this.opcionesCasilla.ancho = this.opcionesCasilla.ancho || this.calcularAnchoCasilla(this.opcionesCuadricula.ancho);
        this.opcionesCasilla.alto = this.opcionesCasilla.alto || this.calcularAltoCasilla(this.opcionesCuadricula.alto);
    };
    Cuadricula.prototype.separacion = function () {
        return this.opcionesCuadricula.separacionEntreCasillas;
    };
    Cuadricula.prototype.setAncho = function (nuevo) {
        this.ancho = nuevo;
        this.opcionesCasilla.ancho = this.calcularAnchoCasilla(nuevo);
        this.casillas.forEach(function (casilla) { casilla.reubicate(); });
    };
    Cuadricula.prototype.calcularAnchoCasilla = function (anchoCuad) {
        // anchoCuad = cols * anchoCas + ((cols-1) * separacion)
        // anchoCuad - ((cols-1) * separacion) = cols * anchoCas
        // anchoCas = (anchoCuad - ((cols-1) * separacion)) / cols
        // anchoCas = anchoCuad / cols - ((cols-1) * separacion) / cols
        return anchoCuad / this.cantColumnas -
            (((this.cantColumnas - 1) * this.separacion()) / this.cantColumnas);
    };
    Cuadricula.prototype.setAlto = function (nuevo) {
        this.alto = nuevo;
        this.opcionesCasilla.alto = this.calcularAltoCasilla(nuevo);
        this.casillas.forEach(function (casilla) { casilla.reubicate(); });
    };
    Cuadricula.prototype.calcularAltoCasilla = function (altoCuad) {
        var separacion = this.opcionesCuadricula.separacionEntreCasillas;
        return altoCuad / this.cantFilas -
            (((this.cantFilas - 1) * this.separacion()) / this.cantFilas);
    };
    Cuadricula.prototype.crearCasillas = function () {
        this.casillas = new Array();
        for (var nroFila = 0; nroFila < this.cantFilas; nroFila++) {
            for (var nroColumna = 0; nroColumna < this.cantColumnas; nroColumna++) {
                this.casillas.push(new Casilla(nroFila, nroColumna, this));
            }
        }
    };
    Cuadricula.prototype.agregarActor = function (actor, nroF, nroC, escalarACasilla) {
        if (escalarACasilla === void 0) { escalarACasilla = true; }
        actor.cuadricula = this;
        if (escalarACasilla) {
            actor.escalarProporcionalALimites(this.anchoCasilla() - 5, this.altoCasilla() - 5);
        }
        actor.setCasillaActual(this.casilla(nroF, nroC), true);
    };
    Cuadricula.prototype.agregarActorEnPerspectiva = function (actor, nroF, nroC, escalarACasilla) {
        if (escalarACasilla === void 0) { escalarACasilla = true; }
        this.agregarActor(actor, nroF, nroC, false);
        if (escalarACasilla) {
            actor.escalarAAncho(actor.casillaActual().ancho * 0.95);
        }
        actor.abajo = actor.casillaActual().abajo + (0.4 * this.altoCasilla());
    };
    Cuadricula.prototype.altoCasilla = function () {
        return this.opcionesCasilla.alto;
    };
    Cuadricula.prototype.anchoCasilla = function () {
        return this.opcionesCasilla.ancho;
    };
    Cuadricula.prototype.getOpcionesCasilla = function () {
        return this.opcionesCasilla;
    };
    Cuadricula.prototype.casilla = function (nroF, nroC) {
        return this.casillas.filter(function (casilla) { return casilla.sos(nroF, nroC); })[0];
    };
    Cuadricula.prototype.colisionan = function (objeto1, objeto2) {
        return objeto1.casillaActual() == objeto2.casillaActual();
    };
    return Cuadricula;
})(Actor);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/**
 * @class ComportamientoAnimado
 * Esta clase está pensada para ser usada de superclase,
 * si es que se desea construir un comportamiento que se anime.
 *
 * @example
 * Puede usarse directamente de esta manera:
 *      actor.hacer_luego(ComportamientoAnimado,{nombreAnimacion: 'correr'});
 * De esta manera el actor se animará sin hacer nada.
 *
 * @example
 * Otra manera de usarlo es así:
 *      actor.hacer_luego(Explotar);
 *
 * Donde Explotar es una subclase y tiene definidos los siguientes métodos:
 *      nombreAnimacion(){
 *			return 'explosion'
 *		};
 *      alTerminarAnimacion(){
 *			this.receptor.eliminar();
 *		}
 *
 * @example
 * Otra manera de usarlo es independientemente de la animación
 * (Para decidir uno cuándo termina el comportamiento)
 *      actor.hacer_luego(MoverEnX,{destino: 50});
 *
 * Donde MoverEnX es subclase de ComportamientoAnimado y define:
 * 		nombreAnimacion(){
 *			return 'correr';
 *		};
 *		doActualizar(){
 *			super.doActualizar();
 *			this.receptor.x = this.receptor.x + 1;
 *			if (this.receptor.x = this.argumentos.destino){
 *				return true;
 *			}
 *		}
 * Mientras, la animación se ejecuta en un loop hasta que doActualizar devuelve true.
 */
var ComportamientoAnimado = (function (_super) {
    __extends(ComportamientoAnimado, _super);
    function ComportamientoAnimado() {
        _super.apply(this, arguments);
    }
    ComportamientoAnimado.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.secuenciaActualizar = new Array();
        this.secuenciaActualizar.push(function () {
            this.configuracionInicial();
            this.alIniciar();
            return true;
        }.bind(this));
        this.secuenciaActualizar.push(function () {
            return this.doActualizar();
        }.bind(this));
        this.secuenciaActualizar.push(function () {
            this.configuracionFinal();
            this.alTerminarAnimacion();
            return true;
        }.bind(this));
    };
    /** No se recomienda redefinir. Redefinir en su lugar el doActualizar */
    ComportamientoAnimado.prototype.actualizar = function () {
        if (this.secuenciaActualizar.length > 0) {
            if (this.secuenciaActualizar[0]()) {
                this.secuenciaActualizar.shift();
            }
        }
        else {
            return true;
        }
    };
    ComportamientoAnimado.prototype.configuracionInicial = function () {
        this.receptor.detenerAnimacion(); // Porque hace quilombo
        this.animacionAnterior = this.receptor.nombreAnimacionActual();
        this.receptor.cargarAnimacion(this.nombreAnimacion());
    };
    ComportamientoAnimado.prototype.configuracionFinal = function () {
        this.receptor.animar();
        this.receptor.cargarAnimacion(this.nombreAnimacionSiguiente());
    };
    /* Redefinir si corresponde animar el comportamiento. */
    ComportamientoAnimado.prototype.nombreAnimacion = function () {
        return this.argumentos.nombreAnimacion || this.nombreAnimacionParado();
    };
    /* Redefinir si corresponde */
    ComportamientoAnimado.prototype.nombreAnimacionParado = function () {
        return this.argumentos.nombreAnimacionParado || 'parado';
    };
    /* Redefinir si corresponde */
    ComportamientoAnimado.prototype.nombreAnimacionSiguiente = function () {
        if (this.argumentos.mantenerAnimacion)
            return this.nombreAnimacion();
        return this.argumentos.nombreAnimacionSiguiente || this.animacionAnterior;
    };
    /* Redefinir si corresponde */
    ComportamientoAnimado.prototype.alIniciar = function () {
    };
    /* Redefinir si corresponde */
    ComportamientoAnimado.prototype.alTerminarAnimacion = function () {
    };
    /** Redefinir si es necesario.
     *  Redefinir sólo este, no el actualizar original.
     *  Es lo que hace efectivamente el comportamiento, además de animar.
     *  Debe retornar true cuando corresponda terminar el comportamiento.
     *  Por defecto termina cuando termina la animación.
     *  Al redefinir siempre debe llamarse a super */
    ComportamientoAnimado.prototype.doActualizar = function () {
        return this.receptor.avanzarAnimacion();
    };
    return ComportamientoAnimado;
})(Comportamiento);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "ComportamientoAnimado.ts"/>
/**
 * @class MovimientoAnimado
 *
 * Argumentos:
 *    distancia: la distancia deseada de recorrer
 *    destino: alternativamente se puede proveer un objeto con x e y, que es el destino.
 *       NOTA: Si se proveen ambos distancia y destino, deben concordar, sino no se
 *              garantiza el comportamiento correcto del Movimiento.
 *    direccion: Sino, se puede proveer una direccion de movimiento. (instancia de Direc)
 *    velocidad: Es un porcentaje. 100 significa lo más rápido. Debe ser 1 ó más.
 *               Representa la cantidad de ciclos que efectivamente se ejecutan.
 *    cantPasos: Mayor cantidad de pasos implica mayor "definicion" del movimiento.
 *               Tambien tarda mas en completarse. Jugar tambien con la velocidad.
 *               Como esto juega con la animacion, es preferible no tocarlo.
 */
var MovimientoAnimado = (function (_super) {
    __extends(MovimientoAnimado, _super);
    function MovimientoAnimado() {
        _super.apply(this, arguments);
        this.valoresFinales = {};
    }
    MovimientoAnimado.prototype.nombreAnimacion = function () {
        return 'correr';
    };
    MovimientoAnimado.prototype.alIniciar = function () {
        _super.prototype.alIniciar.call(this);
        this.sanitizarArgumentos();
        this.vueltasSinEjecutar = 0;
        this.enQueVueltaEjecuto = Math.round(100 / this.valoresFinales.velocidad);
        this.pasosRestantes = this.valoresFinales.cantPasos;
        this.vectorDeAvance = this.valoresFinales.direccion.destinyFrom({ x: 0, y: 0 }, this.valoresFinales.distancia / this.valoresFinales.cantPasos);
        this.receptor.suspenderHabilidadesConMovimiento();
        this.voltearSiCorresponde();
    };
    MovimientoAnimado.prototype.alTerminarAnimacion = function () {
        this.receptor.activarHabilidadesConMovimiento();
    };
    MovimientoAnimado.prototype.doActualizar = function () {
        var terminoAnimacion = _super.prototype.doActualizar.call(this);
        if (this.pasosRestantes <= 0) {
            this.receptor.x = this.valoresFinales.destino.x;
            this.receptor.y = this.valoresFinales.destino.y;
            return terminoAnimacion;
        }
        else if (this.deboEjecutar()) {
            this.darUnPaso();
        }
    };
    MovimientoAnimado.prototype.deboEjecutar = function () {
        if (this.vueltasSinEjecutar + 1 == this.enQueVueltaEjecuto) {
            this.vueltasSinEjecutar = 0;
            return true;
        }
        else {
            this.vueltasSinEjecutar += 1;
            return false;
        }
    };
    MovimientoAnimado.prototype.darUnPaso = function () {
        this.pasosRestantes -= 1;
        this.receptor.x += this.vectorDeAvance.x;
        this.receptor.y += this.vectorDeAvance.y;
    };
    MovimientoAnimado.prototype.sanitizarArgumentos = function () {
        this.valoresFinales.distancia = this.argumentos.distancia || this.calcularDistancia();
        if (this.argumentos.direccion !== undefined && !(this.argumentos.direccion instanceof Direct))
            throw new ArgumentError("Direction should come as an instance of Direct");
        this.valoresFinales.direccion = this.argumentos.direccion || this.calcularDireccion();
        this.valoresFinales.destino = this.argumentos.destino || this.calcularDestino();
        this.valoresFinales.cantPasos = this.argumentos.cantPasos || 10;
        this.valoresFinales.velocidad = this.argumentos.velocidad || 20;
        this.valoresFinales.voltearAlIrAIzquierda = this.argumentos.voltearAlIrAIzquierda || true;
    };
    MovimientoAnimado.prototype.calcularDistancia = function () {
        if (!this.argumentos.destino)
            throw new ArgumentError("Distance or destiny missing");
        return pilas.utils.distancia_entre_dos_actores(this.receptor, this.argumentos.destino);
    };
    MovimientoAnimado.prototype.calcularDireccion = function () {
        if (!this.argumentos.destino)
            throw new ArgumentError("Direction or destiny missing");
        return new Direct(this.receptor, this.argumentos.destino);
    };
    MovimientoAnimado.prototype.calcularDestino = function () {
        return this.argumentos.direccion.destinyFrom(this.receptor, this.argumentos.distancia);
    };
    MovimientoAnimado.prototype.voltearSiCorresponde = function () {
        this.receptor.espejado = this.valoresFinales.voltearAlIrAIzquierda && this.vectorDeAvance.x < 0;
    };
    return MovimientoAnimado;
})(ComportamientoAnimado);
var Direct = (function () {
    function Direct(origin, destiny) {
        if (!origin.x) {
            this.versor = Direct.versorFor({ x: origin, y: destiny });
        }
        else {
            this.versor = Direct.versorFor({ x: destiny.x - origin.x, y: destiny.y - origin.y });
        }
    }
    Direct.versorFor = function (vector) {
        var norm = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
        return { x: vector.x / norm, y: vector.y / norm };
    };
    Direct.prototype.destinyFrom = function (point, distance) {
        return { x: point.x + (this.versor.x * distance),
            y: point.y + (this.versor.y * distance) };
    };
    return Direct;
})();
var ArgumentError = (function () {
    function ArgumentError(description) {
        this.name = "ArgumentError";
        this.message = description;
    }
    return ArgumentError;
})();
// Esto es una clara chanchada. No sé cómo usar el Error original desde Typescript
var ActividadError = (function () {
    function ActividadError(message) {
        this.message = message || "";
    }
    ;
    ActividadError.prototype.description = function () {
        return this.message;
    };
    return ActividadError;
})();
var ProductionErrorHandler = (function () {
    function ProductionErrorHandler(escena) {
        this.escena = escena;
    }
    ProductionErrorHandler.prototype.handle = function (e) {
        this.escena.automata.decir(e.description());
        this.escena.pausar();
    };
    return ProductionErrorHandler;
})();
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "MovimientoAnimado.ts"/>
/// <reference path = "../escenas/Errores.ts" />
var MovimientoEnCuadricula = (function (_super) {
    __extends(MovimientoEnCuadricula, _super);
    function MovimientoEnCuadricula() {
        _super.apply(this, arguments);
    }
    MovimientoEnCuadricula.prototype.alIniciar = function () {
        this.cuadricula = this.receptor.cuadricula;
        this.argumentos.direccion = new Direct(this.vectorDireccion.x, this.vectorDireccion.y);
        this.argumentos.distancia = this.distancia();
        _super.prototype.alIniciar.call(this);
        this.estoyEmpezandoAMoverme = true;
    };
    MovimientoEnCuadricula.prototype.doActualizar = function () {
        if (!this.puedoMovermeEnEsaDireccion() || _super.prototype.doActualizar.call(this)) {
            return true;
        }
    };
    MovimientoEnCuadricula.prototype.puedoMovermeEnEsaDireccion = function () {
        if (this.estoyEmpezandoAMoverme) {
            this.estoyEmpezandoAMoverme = false;
            return this.verificarDireccion(this.receptor.casillaActual());
        }
        return true;
    };
    MovimientoEnCuadricula.prototype.distancia = function () {
        // Template Method. Devuelve la distancia vertical ú horizontal según corresponda
    };
    MovimientoEnCuadricula.prototype.distanciaHorizontal = function () {
        return this.cuadricula.anchoCasilla() + this.cuadricula.separacion();
    };
    MovimientoEnCuadricula.prototype.distanciaVertical = function () {
        return this.cuadricula.altoCasilla() + this.cuadricula.separacion();
    };
    MovimientoEnCuadricula.prototype.verificarDireccion = function (casilla) {
        var proximaCasilla = this.proximaCasilla(casilla);
        if (!proximaCasilla) {
            throw new ActividadError("No puedo ir para " + this.textoAMostrar());
            return false;
        }
        ;
        this.receptor.setCasillaActual(proximaCasilla);
        return true;
    };
    MovimientoEnCuadricula.prototype.proximaCasilla = function (casilla) {
        // Template Method. Devolver la casilla a la que se va a avanzar
    };
    MovimientoEnCuadricula.prototype.textoAMostrar = function () {
        // Template Method. Para mostrar mensaje descriptivo al no poder avanzar
    };
    return MovimientoEnCuadricula;
})(MovimientoAnimado);
var MoverACasillaDerecha = (function (_super) {
    __extends(MoverACasillaDerecha, _super);
    function MoverACasillaDerecha() {
        _super.apply(this, arguments);
        this.vectorDireccion = { x: 1, y: 0 };
    }
    MoverACasillaDerecha.prototype.proximaCasilla = function (casilla) {
        return casilla.casillaASuDerecha();
    };
    MoverACasillaDerecha.prototype.textoAMostrar = function () {
        return "la derecha";
    };
    MoverACasillaDerecha.prototype.distancia = function () {
        return this.distanciaHorizontal();
    };
    return MoverACasillaDerecha;
})(MovimientoEnCuadricula);
var MoverACasillaArriba = (function (_super) {
    __extends(MoverACasillaArriba, _super);
    function MoverACasillaArriba() {
        _super.apply(this, arguments);
        this.vectorDireccion = { x: 0, y: 1 };
    }
    MoverACasillaArriba.prototype.proximaCasilla = function (casilla) {
        return casilla.casillaDeArriba();
    };
    MoverACasillaArriba.prototype.textoAMostrar = function () {
        return "arriba";
    };
    MoverACasillaArriba.prototype.distancia = function () {
        return this.distanciaVertical();
    };
    return MoverACasillaArriba;
})(MovimientoEnCuadricula);
var MoverACasillaAbajo = (function (_super) {
    __extends(MoverACasillaAbajo, _super);
    function MoverACasillaAbajo() {
        _super.apply(this, arguments);
        this.vectorDireccion = { x: 0, y: -1 };
    }
    MoverACasillaAbajo.prototype.proximaCasilla = function (casilla) {
        return casilla.casillaDeAbajo();
    };
    MoverACasillaAbajo.prototype.textoAMostrar = function () {
        return "abajo";
    };
    MoverACasillaAbajo.prototype.distancia = function () {
        return this.distanciaVertical();
    };
    return MoverACasillaAbajo;
})(MovimientoEnCuadricula);
var MoverACasillaIzquierda = (function (_super) {
    __extends(MoverACasillaIzquierda, _super);
    function MoverACasillaIzquierda() {
        _super.apply(this, arguments);
        this.vectorDireccion = { x: -1, y: 0 };
    }
    MoverACasillaIzquierda.prototype.proximaCasilla = function (casilla) {
        return casilla.casillaASuIzquierda();
    };
    MoverACasillaIzquierda.prototype.textoAMostrar = function () {
        return "la izquierda";
    };
    MoverACasillaIzquierda.prototype.distancia = function () {
        return this.distanciaHorizontal();
    };
    return MoverACasillaIzquierda;
})(MovimientoEnCuadricula);
var MoverTodoAIzquierda = (function (_super) {
    __extends(MoverTodoAIzquierda, _super);
    function MoverTodoAIzquierda() {
        _super.apply(this, arguments);
    }
    MoverTodoAIzquierda.prototype.proximaCasilla = function (casilla) {
        return this.cuadricula.casilla(this.receptor.casillaActual().nroFila, 0);
    };
    MoverTodoAIzquierda.prototype.distancia = function () {
        return this.distanciaHorizontal()
            * this.receptor.casillaActual().nroColumna;
    };
    return MoverTodoAIzquierda;
})(MoverACasillaIzquierda);
var MoverTodoADerecha = (function (_super) {
    __extends(MoverTodoADerecha, _super);
    function MoverTodoADerecha() {
        _super.apply(this, arguments);
    }
    MoverTodoADerecha.prototype.proximaCasilla = function (casilla) {
        return this.cuadricula.casilla(this.receptor.casillaActual().nroFila, this.cuadricula.cantColumnas - 1);
    };
    MoverTodoADerecha.prototype.distancia = function () {
        return this.distanciaHorizontal()
            * (this.cuadricula.cantColumnas - 1 - this.receptor.casillaActual().nroColumna);
    };
    return MoverTodoADerecha;
})(MoverACasillaDerecha);
var MoverTodoArriba = (function (_super) {
    __extends(MoverTodoArriba, _super);
    function MoverTodoArriba() {
        _super.apply(this, arguments);
    }
    MoverTodoArriba.prototype.proximaCasilla = function (casilla) {
        return this.cuadricula.casilla(this.receptor.casillaActual().nroColumna, 0);
    };
    MoverTodoArriba.prototype.distancia = function () {
        return this.distanciaVertical()
            * this.receptor.casillaActual().nroFila;
    };
    return MoverTodoArriba;
})(MoverACasillaArriba);
var MoverTodoAbajo = (function (_super) {
    __extends(MoverTodoAbajo, _super);
    function MoverTodoAbajo() {
        _super.apply(this, arguments);
    }
    MoverTodoAbajo.prototype.proximaCasilla = function (casilla) {
        return this.cuadricula.casilla(this.receptor.casillaActual().nroColumna, this.cuadricula.cantFilas - 1);
    };
    MoverTodoAbajo.prototype.distancia = function () {
        return this.distanciaVertical()
            * (this.cuadricula.cantFilas - 1 - this.receptor.casillaActual().nroColumna);
    };
    return MoverTodoAbajo;
})(MoverACasillaAbajo);
/// <reference path="../comportamientos/MovimientosEnCuadricula.ts"/>
/// <reference path="Cuadricula.ts"/>
/*

Implementa una cuadrícula donde no están todas las casillas, permitiendo generar
diseños más complejos que un cuadrado, pero reutilizando el comportamiento de la
cuadrícula y sus movimientos.

*/
var CuadriculaEsparsa = (function (_super) {
    __extends(CuadriculaEsparsa, _super);
    function CuadriculaEsparsa(x, y, opcionesCuadricula, opcionesCasilla, matriz) {
        this.matriz = matriz;
        _super.call(this, x, y, matriz.length, matriz[0].length, opcionesCuadricula, opcionesCasilla);
    }
    CuadriculaEsparsa.prototype.crearCasillas = function () {
        /*Crea las casillas definidas por la matriz booleana
        definida ene l constructor*/
        this.casillas = new Array();
        for (var nroFila = 0; nroFila < this.cantFilas; nroFila++) {
            for (var nroColumna = 0; nroColumna < this.cantColumnas; nroColumna++) {
                if (this.matriz[nroFila][nroColumna] == 'T') {
                    this.casillas.push(new Casilla(nroFila, nroColumna, this));
                }
            }
        }
    };
    CuadriculaEsparsa.prototype.completarConObjetosRandom = function (conjuntoDeClases, argumentos) {
        /*Completa la cuadricula esparsa con objetos random
        Opcionalmente se le puede pasar a argumentos.condiciones
        una lista de funciones que seran evaluadas de manera de evitar
        que en determinadas posiciones de la cuadricula se agreguen objetos.*/
        for (var index = 0; index < this.casillas.length; ++index) {
            if (Math.random() < 0.6 && this.sonTodosTrue(argumentos.condiciones, this.casillas[index].nroFila, this.casillas[index].nroColumna, this.matriz)) {
                this.agregarActor(conjuntoDeClases.dameUno(), this.casillas[index].nroFila, this.casillas[index].nroColumna);
            }
        }
    };
    CuadriculaEsparsa.prototype.sonTodosTrue = function (condiciones, fila, col, pmatrix) {
        /*Toma una lista de funciones y les aplica
        fila, col. */
        if (condiciones != undefined) {
            for (var i = 0; i < condiciones.length; ++i) {
                if (!condiciones[i](fila, col, pmatrix)) {
                    return false;
                }
            }
        }
        return true;
    };
    CuadriculaEsparsa.prototype.hayDerecha = function (casilla) {
        /*Devuelve true sii existe una casilla
        a la inmediata derecha de la casilla */
        return this.casilla(casilla.nroFila, casilla.nroColumna + 1) != undefined;
    };
    CuadriculaEsparsa.prototype.hayIzquierda = function (casilla) {
        return this.casilla(casilla.nroFila, casilla.nroColumna - 1) != undefined;
    };
    CuadriculaEsparsa.prototype.hayAbajo = function (casilla) {
        return this.casilla(casilla.nroFila + 1, casilla.nroColumna) != undefined;
    };
    CuadriculaEsparsa.prototype.hayArriba = function (casilla) {
        return this.casilla(casilla.nroFila - 1, casilla.nroColumna) != undefined;
    };
    return CuadriculaEsparsa;
})(Cuadricula);
/*

1. La clase implementa una matriz donde cada fila tiene una cantidad distinta de columnas.

2. Cada fila es una cuadricula

3. Se permite inicializar con tamaños random o con tamaños fijos.

4. También, dado un definidor de Columnas (ver clase de este archivo), permite inicializar
esta matriz con objetos de esos tipos de manera aleatoria.

5. Se provee el método posicionar objeto que reemplaza al agregarActor tradicional

6. Para un ejemplo de utilizacion ver ElMonoQueSabeContar.ts

*/
/// <reference path = "../actores/cuadriculaEsparsa.ts"/>
// TODO: DEBERIAMOS HACER REFACTOR de manera de mergear constructores/clases.
var CuadriculaMultipleColumnas = (function (_super) {
    __extends(CuadriculaMultipleColumnas, _super);
    function CuadriculaMultipleColumnas(definidor, x, y, opcionesCuadricula, opcionesCasilla) {
        this.cantFilas = definidor.dameMaximo();
        this.cantColumnas = definidor.size();
        this.pmatrix = new Array(this.cantFilas, Array(this.cantColumnas));
        //this.pmatrix =  String[cantidadFilas][cantidadColumnas];
        for (var fila = 0; fila < this.cantFilas; fila++) {
            this.pmatrix[fila] = [];
            for (var col = 0; col < this.cantColumnas; col++) {
                if (definidor.at(col) > fila) {
                    this.pmatrix[fila][col] = 'T';
                }
                else {
                    this.pmatrix[fila][col] = 'F';
                }
            }
        }
        _super.call(this, x, y, opcionesCuadricula, opcionesCasilla, this.pmatrix);
    }
    CuadriculaMultipleColumnas.prototype.cambiarImagenInicio = function (nuevaImagen) {
        for (var nroColumna = 0; nroColumna < this.pmatrix[0].length; nroColumna++) {
            this.casilla(0, nroColumna).cambiarImagen(nuevaImagen);
        }
    };
    CuadriculaMultipleColumnas.prototype.cambiarImagenFin = function (nuevaImagen) {
        for (var fila = 0; fila < this.pmatrix.length; fila++) {
            for (var col = 0; col < this.pmatrix[0].length; col++) {
                if (this.esLaUltima(fila, col)) {
                    this.casilla(fila, col).cambiarImagen(nuevaImagen);
                }
            }
        }
    };
    CuadriculaMultipleColumnas.prototype.esLaUltima = function (fila, col) {
        return this.pmatrix[fila][col] == 'T' && (this.pmatrix[fila + 1] == undefined || this.pmatrix[fila + 1][col] == 'F');
    };
    return CuadriculaMultipleColumnas;
})(CuadriculaEsparsa);
var CuadriculaMultiple = (function (_super) {
    __extends(CuadriculaMultiple, _super);
    function CuadriculaMultiple(definidor, x, y, opcionesCuadricula, opcionesCasilla) {
        var max = definidor.dameMaximo();
        this.pmatrix = [];
        while (definidor.hayProxFila()) {
            var fila = [];
            var cantColumnas = definidor.dameProxFila();
            var cant = 0;
            while (cant < cantColumnas) {
                fila.push('T');
                cant++;
            }
            while (cant < max) {
                fila.push('F');
                cant++;
            }
            this.pmatrix.push(fila);
        }
        _super.call(this, x, y, opcionesCuadricula, opcionesCasilla, this.pmatrix);
    }
    CuadriculaMultiple.prototype.cambiarImagenCasillas = function (imagenNueva) {
        for (var nroFila = 0; nroFila < this.pmatrix.length; ++nroFila) {
            for (var nroColumna = 0; nroColumna < this.pmatrix[0].length; ++nroColumna) {
                if (this.casilla(nroFila, nroColumna)) {
                    this.casilla(nroFila, nroColumna).cambiarImagen(imagenNueva);
                }
            }
        }
    };
    CuadriculaMultiple.prototype.cambiarImagenInicio = function (nuevaImagen) {
        for (var nroFila = 0; nroFila < this.pmatrix.length; ++nroFila) {
            this.casilla(nroFila, 0).cambiarImagen(nuevaImagen);
        }
    };
    CuadriculaMultiple.prototype.cambiarImagenFin = function (nuevaImagen) {
        for (var nroFila = 0; nroFila < this.pmatrix.length; ++nroFila) {
            this.casilla(nroFila, this.dameIndexUltimaPosicion(nroFila)).cambiarImagen(nuevaImagen);
        }
    };
    CuadriculaMultiple.prototype.dameIndexUltimaPosicion = function (nroFila) {
        var index = 0;
        while (this.pmatrix[nroFila][index + 1] == 'T') {
            index += 1;
        }
        return index;
    };
    CuadriculaMultiple.prototype.cantidadColumnas = function (nroFila) {
        return this.dameIndexUltimaPosicion(nroFila) + 1;
    };
    return CuadriculaMultiple;
})(CuadriculaEsparsa);
var ConjuntoClases = (function () {
    function ConjuntoClases(clases) {
        this.clases = clases;
    }
    ConjuntoClases.prototype.dameUno = function () {
        return new this.clases[Math.floor(Math.random() * this.clases.length)](0, 0);
    };
    return ConjuntoClases;
})();
var DefinidorColumnasDeUnaFila = (function () {
    function DefinidorColumnasDeUnaFila() {
        this.index = 0;
        this.tamanos = [];
    }
    DefinidorColumnasDeUnaFila.prototype.size = function () {
        return this.tamanos.length;
    };
    DefinidorColumnasDeUnaFila.prototype.at = function (index) {
        return this.tamanos[index];
    };
    DefinidorColumnasDeUnaFila.prototype.dameProxFila = function () {
        var a = this.tamanos[this.index];
        this.index += 1;
        return a;
    };
    DefinidorColumnasDeUnaFila.prototype.hayProxFila = function () {
        return this.index < this.tamanos.length;
    };
    DefinidorColumnasDeUnaFila.prototype.nroFila = function () {
        //comienza a numerar desde cero
        return this.index;
    };
    DefinidorColumnasDeUnaFila.prototype.dameMaximo = function () {
        var max = this.tamanos[0];
        for (var index = 1; index < this.tamanos.length; index++) {
            if (this.tamanos[index] > max) {
                max = this.tamanos[index];
            }
        }
        return max;
    };
    return DefinidorColumnasDeUnaFila;
})();
var DefinidorColumnasRandom = (function (_super) {
    __extends(DefinidorColumnasRandom, _super);
    function DefinidorColumnasRandom(filas, cantidadMaxColumnas) {
        _super.call(this);
        this.tamanos = Array.apply(null, Array(filas)).map(function (_, i) { return Math.floor((Math.random() * cantidadMaxColumnas) + 3); });
    }
    return DefinidorColumnasRandom;
})(DefinidorColumnasDeUnaFila);
var DefinidorColumnasFijo = (function (_super) {
    __extends(DefinidorColumnasFijo, _super);
    function DefinidorColumnasFijo(filas, tamanos) {
        _super.call(this);
        this.tamanos = tamanos;
    }
    return DefinidorColumnasFijo;
})(DefinidorColumnasDeUnaFila);
/// <reference path="ActorAnimado.ts"/>
var EstrellaAnimada = (function (_super) {
    __extends(EstrellaAnimada, _super);
    function EstrellaAnimada(x, y) {
        _super.call(this, x, y, { grilla: 'estrellaAnimada.png', cantColumnas: 3, cantFilas: 1 });
        this.definirAnimacion("parado", new Cuadros(0).repetirRandom(200).concat([0, 1, 2, 2, 2, 1]), 6, true);
        this.definirAnimacion("recoger", [0, 1, 2], 4);
    }
    return EstrellaAnimada;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var GatoAnimado = (function (_super) {
    __extends(GatoAnimado, _super);
    function GatoAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'gatoAnimado.png', cantColumnas: 7, cantFilas: 7 });
        this.definirAnimacion('parado', new Cuadros([0, 1, 2, 3, 2, 1]).repetirVeces(9).concat([8, 9, 10, 11, 12, 12, 12, 12, 12, 12, 11, 10, 9, 8]), 4, true);
        this.definirAnimacion('saltar', [43, 44, 45, 46, 46, 45, 44, 43], 5);
        this.definirAnimacion('saludando', [15, 16, 16, 17, 18, 19, 19, 18, 17, 16, 16, 16, 16, 17, 18, 19, 19], 5);
        this.definirAnimacion('acostado', [4, 6, 4], 5);
        this.definirAnimacion('abrirOjos', [43, 44, 45, 46], 5);
        this.definirAnimacion('cerrarOjos', [38, 38, 38, 39, 39, 39], 5);
        this.definirAnimacion('correr', [22, 23, 24, 25, 26], 6);
        this.definirAnimacion('volver', [28, 29, 30, 31, 32, 33, 34, 35], 6);
    }
    return GatoAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var GloboAnimado = (function (_super) {
    __extends(GloboAnimado, _super);
    function GloboAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'globoAnimado.png', cantColumnas: 3, cantFilas: 1 });
        this.definirAnimacion("explotar", [0, 0, 0, 1, 2, 2], 6);
    }
    return GloboAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var HeroeAnimado = (function (_super) {
    __extends(HeroeAnimado, _super);
    function HeroeAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'heroe.png', cantColumnas: 6, cantFilas: 5 });
        this.definirAnimacion("correr", [0, 1, 2, 3, 4, 5], 6);
        this.definirAnimacion("parado", [0], 6, true);
        this.definirAnimacion("correrConEspada", [6, 7, 8, 9, 10, 11], 12);
        this.definirAnimacion("correrConSombrero", [12, 13, 14, 15, 16, 17], 12);
        this.definirAnimacion("atacar", [24, 25, 26, 27, 28, 29], 12);
    }
    return HeroeAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var HierroAnimado = (function (_super) {
    __extends(HierroAnimado, _super);
    function HierroAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'hierro_animado.png', cantColumnas: 3, cantFilas: 1 });
        this.definirAnimacion("quedan3", [0], 1);
        this.definirAnimacion("quedan2", [1], 1);
        this.definirAnimacion("quedan1", [2], 1);
        this.definirAnimacion("correr", [2], 1);
    }
    return HierroAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var Hueso = (function (_super) {
    __extends(Hueso, _super);
    function Hueso(x, y) {
        _super.call(this, x, y, { grilla: 'hueso.png', cantColumnas: 1, cantFilas: 1 });
    }
    return Hueso;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var InstaladorAnimado = (function (_super) {
    __extends(InstaladorAnimado, _super);
    function InstaladorAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'instalador.png', cantColumnas: 6, cantFilas: 1 });
        this.definirAnimacion("parado", [0], 15, true);
        this.definirAnimacion("correr", [1, 2, 3], 5);
        this.definirAnimacion("escribir", [1, 5, 1, 5, 1, 5], 6);
    }
    return InstaladorAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var Lamparin = (function (_super) {
    __extends(Lamparin, _super);
    function Lamparin(x, y) {
        _super.call(this, x, y, { grilla: 'lamparin.png', cantColumnas: 2, cantFilas: 1 });
        this.definirAnimacion("apagada", [0], 1);
        this.definirAnimacion("prendida", [1], 1);
        this.etiquetas.push('Luz');
    }
    return Lamparin;
})(ActorAnimado);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "HabilidadAnimada.ts"/>
var Flotar = (function (_super) {
    __extends(Flotar, _super);
    function Flotar(receptor, argumentos) {
        _super.call(this, receptor);
        this.actualizarPosicion();
        this.contador = Math.random() * 3;
        this.desvio = argumentos["Desvio"] || 1;
    }
    Flotar.prototype.actualizar = function () {
        this.contador += 0.025;
        this.contador = this.contador % 256;
        //Esto es para evitar overflow.
        this.receptor.y = this.altura_original + Math.sin(this.contador) * this.desvio;
    };
    Flotar.prototype.implicaMovimiento = function () {
        return true;
    };
    Flotar.prototype.actualizarPosicion = function () {
        this.altura_original = this.receptor.y;
    };
    return Flotar;
})(HabilidadAnimada);
/// <reference path="ActorAnimado.ts"/>
/// <reference path="../habilidades/Flotar.ts"/>
var LlaveAnimado = (function (_super) {
    __extends(LlaveAnimado, _super);
    function LlaveAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'llaveAnimada.png', cantColumnas: 1 });
        this.definirAnimacion("recoger", [1], 12);
        this.definirAnimacion("correr", [1], 12);
    }
    return LlaveAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var MagoAnimado = (function (_super) {
    __extends(MagoAnimado, _super);
    function MagoAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'mago.png', cantColumnas: 4, cantFilas: 2 });
        this.definirAnimacion("parado", [1], 12, true);
        this.definirAnimacion("darEspada", [1, 2, 3, 5, 5, 6, 6, 7, 7], 6);
        this.definirAnimacion("paradoConSombrero", [0], 12);
    }
    return MagoAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var ManzanaAnimada = (function (_super) {
    __extends(ManzanaAnimada, _super);
    function ManzanaAnimada(x, y) {
        _super.call(this, x, y, { grilla: 'manzana-v2.png', cantColumnas: 1, cantFilas: 1 });
    }
    return ManzanaAnimada;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var MarcianoAnimado = (function (_super) {
    __extends(MarcianoAnimado, _super);
    function MarcianoAnimado(x, y) {
        _super.call(this, x, y, this.opcionesImagen());
        this.definirAnimacion("correr", [7, 8, 9, 10, 11], 15);
        this.definirAnimacion("parado", [0, 1, 2, 3, 4, 5], 5, true);
        this.definirAnimacion("recoger", [13, 14, 15], 5);
        this.animacionesAdicionales();
    }
    MarcianoAnimado.prototype.opcionesImagen = function () {
        return { grilla: 'marcianoAnimado.png', cantColumnas: 6, cantFilas: 3 };
    };
    MarcianoAnimado.prototype.animacionesAdicionales = function () {
        // Template method
    };
    return MarcianoAnimado;
})(ActorAnimado);
/// <reference path="MarcianoAnimado.ts"/>
var MarcianoVerdeAnimado = (function (_super) {
    __extends(MarcianoVerdeAnimado, _super);
    function MarcianoVerdeAnimado() {
        _super.apply(this, arguments);
    }
    MarcianoVerdeAnimado.prototype.opcionesImagen = function () {
        return { grilla: 'marcianoVerdeAnimado.png', cantColumnas: 6, cantFilas: 6 };
    };
    MarcianoVerdeAnimado.prototype.animacionesAdicionales = function () {
        this.definirAnimacion("recogerHierro", [13, 14, 15], 5);
        this.definirAnimacion("recogerCarbon", [24, 25, 26], 5);
    };
    return MarcianoVerdeAnimado;
})(MarcianoAnimado);
/// <reference path="ActorAnimado.ts"/>
var MariaAnimada = (function (_super) {
    __extends(MariaAnimada, _super);
    function MariaAnimada(x, y) {
        _super.call(this, x, y, { grilla: 'maria.png', cantColumnas: 10, cantFilas: 2 });
        this.definirAnimacion("parado", [0, 0, 0], 15, true);
        this.definirAnimacion("correr", [0, 1, 2, 3, 4, 5], 12);
        this.definirAnimacion("recoger", [11, 12, 13, 14, 15, 16, 17, 18, 19], 10);
    }
    return MariaAnimada;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var MonoAnimado = (function (_super) {
    __extends(MonoAnimado, _super);
    function MonoAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'monoAnimado.png', cantColumnas: 10, cantFilas: 1 });
        this.definirAnimacion("correr", [0, 1, 2, 3, 4, 5, 6, 7], 12);
        this.definirAnimacion("parado", new Cuadros(0).repetirVeces(50).concat([0, 1, 2, 3, 4]).concat(new Cuadros(4).repetirVeces(30)).concat([4, 3, 2, 1, 0]), 6, true);
        this.definirAnimacion("recoger", [9, 7, 8, 8, 9], 6);
        this.definirAnimacion("contar", [9, 7, 8, 8, 9], 6);
    }
    return MonoAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var NanoAnimado = (function (_super) {
    __extends(NanoAnimado, _super);
    function NanoAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'nano.png', cantColumnas: 1, cantFilas: 1 });
    }
    return NanoAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var NaveAnimada = (function (_super) {
    __extends(NaveAnimada, _super);
    function NaveAnimada(x, y) {
        _super.call(this, x, y, { grilla: 'naveAnimada.png', cantColumnas: 4, cantFilas: 1 });
        this.definirAnimacion("parado", new Cuadros(0).repetirVeces(30).concat([1]), 4, true);
        this.definirAnimacion("correr", [0, 1, 0, 1, 0, 1, 0, 1, 2, 3, 2, 3, 3, 3, 2], 6);
    }
    return NaveAnimada;
})(ActorAnimado);
/// <reference path = "../../dependencias/pilasweb.d.ts" />
/// <reference path="ActorAnimado.ts"/>
var Obrero = (function (_super) {
    __extends(Obrero, _super);
    function Obrero(x, y) {
        _super.call(this, x, y, { grilla: 'cooperativista.camina.png', cantColumnas: 4 });
        this.definirAnimacion("correr", [0, 1, 2, 3, 2, 1], 15);
        this.definirAnimacion("parado", [3], 5);
    }
    Obrero.prototype.restaurar = function () {
        var grilla = pilas.imagenes.cargar_grilla('cooperativista.camina.png', 4);
        this.imagen = grilla;
    };
    Obrero.prototype.argumentosMartillar = function () {
        return { grilla: 'cooperativista.trabajando.png', cantColumnas: 2 };
    };
    Obrero.prototype.fraseAlSaltar = function () {
        return pilas.escena_actual().fraseAlSaltar();
    };
    return Obrero;
})(ActorAnimado);
/*
Implementa un objeto que puede ser observado por otros, es decir,
implementa la interfaz registrarObservador y tuObservadorCambio,
que avisa a los observadores sobre el cambio
*/
// Pensado para ser Trait.
var Observado = (function () {
    function Observado() {
    }
    Observado.prototype.inicializarObservadores = function () {
        if (!this.observadores)
            this.observadores = [];
    };
    Observado.prototype.registrarObservador = function (observador) {
        this.inicializarObservadores();
        this.observadores.push(observador);
        this.changed();
    };
    Observado.prototype.changed = function () {
        var _this = this;
        this.inicializarObservadores(); // TODO: se puede sacar?
        this.observadores.forEach(function (o) { return o.tuObservadoCambio(_this); });
    };
    return Observado;
})();
var ObservadoConAumentar = (function (_super) {
    __extends(ObservadoConAumentar, _super);
    function ObservadoConAumentar() {
        _super.apply(this, arguments);
    }
    ObservadoConAumentar.prototype.aumentar = function (atributo, valorAumento) {
        this[atributo] = this[atributo] + valorAumento;
        this.changed();
    };
    return ObservadoConAumentar;
})(Observado);
var ObservadoConDisminuir = (function (_super) {
    __extends(ObservadoConDisminuir, _super);
    function ObservadoConDisminuir() {
        _super.apply(this, arguments);
    }
    ObservadoConDisminuir.prototype.disminuir = function (atributo, valorDisminucion) {
        this[atributo] = this[atributo] - valorDisminucion;
        this.changed();
    };
    return ObservadoConDisminuir;
})(Observado);
/// <reference path="ActorAnimado.ts"/>
var PapaNoelAnimado = (function (_super) {
    __extends(PapaNoelAnimado, _super);
    function PapaNoelAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'papaNoel.png', cantColumnas: 1, cantFilas: 1 });
    }
    return PapaNoelAnimado;
})(ActorAnimado);
var PelotaAnimada = (function (_super) {
    __extends(PelotaAnimada, _super);
    function PelotaAnimada(x, y) {
        _super.call(this, x, y, { grilla: 'pelotaAnimada.png', cantColumnas: 16 });
        this.definirAnimacion("patear", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 12);
    }
    return PelotaAnimada;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var PerroCohete = (function (_super) {
    __extends(PerroCohete, _super);
    function PerroCohete(x, y) {
        _super.call(this, x, y, { grilla: 'perro_cohete.png', cantColumnas: 1, cantFilas: 7 });
        this.definirAnimacion("correr", [4, 5, 6, 5], 15, true);
        this.definirAnimacion("parado", [4], 5);
        this.definirAnimacion("recoger", [4, 2, 0, 2, 4], 10);
    }
    return PerroCohete;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var PezAnimado = (function (_super) {
    __extends(PezAnimado, _super);
    function PezAnimado(x, y) {
        _super.call(this, x, y, { grilla: this.nombrePNG(), cantColumnas: 4, cantFilas: 1 });
        this.definirAnimacion("parado", new Cuadros(0).repetirRandom(100).concat([1, 2, 3, 3, 2, 1]), 6, true);
        this.definirAnimacion("recoger", [0, 1, 2, 3, 2, 1], 6);
    }
    PezAnimado.prototype.nombrePNG = function () {
        if (Math.random() < 1 / 3)
            return 'pez1.png';
        if (Math.random() < 0.5)
            return 'pez2.png';
        return 'pez3.png';
    };
    return PezAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var RatonAnimado = (function (_super) {
    __extends(RatonAnimado, _super);
    function RatonAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'ratonAnimado.png', cantColumnas: 1, cantFilas: 1 });
    }
    return RatonAnimado;
})(ActorAnimado);
var QuesoAnimado = (function (_super) {
    __extends(QuesoAnimado, _super);
    function QuesoAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'quesoAnimado.png', cantColumnas: 1, cantFilas: 1 });
    }
    return QuesoAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var RecolectorEstrellas = (function (_super) {
    __extends(RecolectorEstrellas, _super);
    function RecolectorEstrellas(x, y) {
        _super.call(this, x, y, { grilla: 'recolectorAnimado.png', cantColumnas: 14, cantFilas: 1 });
        this.definirAnimacion("parado", [0, 1, 2, 1], 2);
        this.definirAnimacion("correr", [3, 4, 5, 6, 7], 5);
        this.definirAnimacion("recoger", [7, 8, 9, 10, 11, 12, 13, 7], 30);
    }
    return RecolectorEstrellas;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var RegaloAnimado = (function (_super) {
    __extends(RegaloAnimado, _super);
    function RegaloAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'regaloAnimado.png', cantColumnas: 1, cantFilas: 1 });
    }
    return RegaloAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var RobotAnimado = (function (_super) {
    __extends(RobotAnimado, _super);
    function RobotAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'robotAnimado.png', cantColumnas: 13 });
        this.definirAnimacion("correr", [0, 1, 2, 3, 4, 5], 6);
        this.definirAnimacion("patear", [8, 9, 10, 11, 12, 11, 10, 9, 8], 6);
    }
    return RobotAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var SandiaAnimada = (function (_super) {
    __extends(SandiaAnimada, _super);
    function SandiaAnimada(x, y) {
        _super.call(this, x, y, { grilla: 'sandia.png', cantColumnas: 1, cantFilas: 1 });
        this.escala_x = 2;
        this.escala_y = 2;
        this.definirAnimacion("mordida", [1], 1);
    }
    return SandiaAnimada;
})(ActorAnimado);
/*Implementa un tablero, que tiene "nombre de equipo" y "puntaje"*/
/*Notar que aumentar puede tomar valores negativos o positivos*/
/* Para usarlo, hay que construirlo y setearle un observado
ver clase "observado" */
var Tablero = (function (_super) {
    __extends(Tablero, _super);
    function Tablero(x, y, argumentos) {
        _super.call(this, x, y, { grilla: argumentos.imagen || 'placacontar.png', cantColumnas: 1, cantFilas: 1 });
        this.atributoObservado = argumentos.atributoObservado || 'cantidad';
        this.nombre = new Texto(x, y, argumentos.texto, (argumentos.colorNombre || "black"));
        this.nombre.setZ(this.z - 1);
        this.puntaje = new Puntaje(this.nombre.derecha + (argumentos.separacionX || 10), this.nombre.y + (argumentos.separacionY || 0), argumentos.valorInicial || 0, argumentos.colorPuntaje || "black");
        this.puntaje.setZ(this.z - 2);
    }
    Tablero.prototype.dameValor = function () {
        this.puntaje.obtener();
    };
    Tablero.prototype.aumentar = function (aumento) {
        this.puntaje.aumentar(aumento);
    };
    Tablero.prototype.setearValor = function (nuevoValor) {
        if (nuevoValor <= this.puntaje.obtener()) {
            this.puntaje.aumentar(-(this.puntaje.obtener() - nuevoValor));
        }
        else {
            this.puntaje.aumentar(nuevoValor - this.puntaje.obtener());
        }
    };
    Tablero.prototype.tuObservadoCambio = function (observado) {
        this.setearValor(observado[this.atributoObservado]);
    };
    return Tablero;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var Tito = (function (_super) {
    __extends(Tito, _super);
    function Tito(x, y) {
        _super.call(this, x, y, { grilla: 'tito.png', cantColumnas: 1, cantFilas: 1 });
        this.definirAnimacion("correr", [0], 60);
        this.definirAnimacion("parado", [0], 60);
        this.definirAnimacion("recoger", [0], 60);
    }
    return Tito;
})(ActorAnimado);
var TuercaAnimada = (function (_super) {
    __extends(TuercaAnimada, _super);
    function TuercaAnimada(x, y) {
        _super.call(this, x, y, { grilla: 'tuerca.png', cantColumnas: 1 });
    }
    return TuercaAnimada;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var UnicornioAnimado = (function (_super) {
    __extends(UnicornioAnimado, _super);
    function UnicornioAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'unicornio.png', cantColumnas: 5, cantFilas: 2 });
        this.definirAnimacion("parado", [0, 0, 0, 0, 1, 2, 3, 4, 3], 12);
        this.definirAnimacion("correr", [5, 6, 7, 8, 9], 12);
    }
    return UnicornioAnimado;
})(ActorAnimado);
var avanzarFilaEnCuadriculaMultiple = (function (_super) {
    __extends(avanzarFilaEnCuadriculaMultiple, _super);
    function avanzarFilaEnCuadriculaMultiple() {
        _super.apply(this, arguments);
    }
    avanzarFilaEnCuadriculaMultiple.prototype.proximaCasilla = function (casillaActual) {
        var casAbajo = _super.prototype.proximaCasilla.call(this, casillaActual);
        if (casAbajo && casAbajo.nroColumna == 0) {
            return casAbajo;
        }
    };
    return avanzarFilaEnCuadriculaMultiple;
})(MoverACasillaAbajo);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "Errores.ts"/>
/// <reference path = "../actores/ActorAnimado.ts"/>
/// <reference path = "EstadosDeEscena.ts"/>
// Esta escena sirve para todas las escenas de Ejercicios Pilas.
// Toda escena que represente una actividad debe heredar de aquí.
var EscenaActividad = (function (_super) {
    __extends(EscenaActividad, _super);
    function EscenaActividad() {
        _super.apply(this, arguments);
        this.errorHandler = new ProductionErrorHandler(this);
    }
    EscenaActividad.prototype.actualizar = function () {
        try {
            _super.prototype.actualizar.call(this);
        }
        catch (e) {
            if (e instanceof ActividadError) {
                this.errorHandler.handle(e);
            }
            else {
                throw e;
            }
        }
    };
    EscenaActividad.prototype.estaResueltoElProblema = function () {
        return this.estado.soyAceptacion();
    };
    EscenaActividad.prototype.cantidadObjetosConEtiqueta = function (etiqueta) {
        return pilas.obtener_actores_con_etiqueta(etiqueta).length;
    };
    EscenaActividad.prototype.personajePrincipal = function () {
        return this.automata;
    };
    EscenaActividad.prototype.maxZ = function () {
        return this.stage.children[0].z;
    };
    EscenaActividad.prototype.minZ = function () {
        return this.stage.children[this.stage.children.length - 1].z;
    };
    return EscenaActividad;
})(Base);
/// <reference path = "EscenaActividad.ts" />
var ErrorEnEstados = (function () {
    function ErrorEnEstados(estado, mensaje) {
        this.estadoAlQueVuelve = estado;
        this.mensajeError = mensaje;
    }
    ErrorEnEstados.prototype.realizarAccion = function (comportamiento, estadoAnterior) {
        throw new ActividadError(this.mensajeError);
    };
    ErrorEnEstados.prototype.estadoSiguiente = function (comportamiento, estadoAnterior) {
        return estadoAnterior;
    };
    return ErrorEnEstados;
})();
var Estado = (function () {
    function Estado(idEstado) {
        this.identifier = idEstado;
        this.transiciones = {};
    }
    Estado.prototype.agregarTransicion = function (estadoEntrada, transicion) {
        this.transiciones[transicion] = estadoEntrada;
    };
    Estado.prototype.realizarTransicion = function (idComportamiento, comportamiento) {
        if (this.transiciones[idComportamiento]) {
            pilas.escena_actual().estado = this.transiciones[idComportamiento].estadoSiguiente(comportamiento, this);
            this.transiciones[idComportamiento].realizarAccion(comportamiento, this);
        }
        else {
            throw new ActividadError("¡Ups, esa no era la opción correcta!");
        }
    };
    Estado.prototype.estadoSiguiente = function (comportamiento, estadoAnterior) {
        if (comportamiento.debeEjecutarse()) {
            return this;
        }
        else {
            return estadoAnterior;
        }
    };
    Estado.prototype.realizarAccion = function (comportamiento, estadoAnterior) {
        comportamiento.ejecutarse();
    };
    Estado.prototype.soyAceptacion = function () {
        return false;
    };
    return Estado;
})();
var EstadoAceptacion = (function (_super) {
    __extends(EstadoAceptacion, _super);
    function EstadoAceptacion() {
        _super.apply(this, arguments);
    }
    EstadoAceptacion.prototype.soyAceptacion = function () {
        return true;
    };
    return EstadoAceptacion;
})(Estado);
var SinEstado = (function () {
    function SinEstado(funcionAceptacion) {
        if (funcionAceptacion === void 0) { funcionAceptacion = function (escena) { return false; }; }
        this.funcionAceptacion = funcionAceptacion;
    }
    SinEstado.prototype.realizarTransicion = function (idComport, comportamiento) {
        comportamiento.ejecutarse();
    };
    SinEstado.prototype.soyAceptacion = function () {
        return this.funcionAceptacion(pilas.escena_actual());
    };
    return SinEstado;
})();
var BuilderStatePattern = (function () {
    function BuilderStatePattern(idEstadoInicialp) {
        this.idEstadoInicial = idEstadoInicialp;
        this.estados = {};
        this.estados[idEstadoInicialp] = new Estado(idEstadoInicialp);
    }
    BuilderStatePattern.prototype.agregarEstado = function (idEstado) {
        this.estados[idEstado] = new Estado(idEstado);
    };
    BuilderStatePattern.prototype.agregarEstadoAceptacion = function (idEstado) {
        this.estados[idEstado] = new EstadoAceptacion(idEstado);
    };
    BuilderStatePattern.prototype.agregarTransicion = function (estadoSalida, estadoEntrada, transicion) {
        this.estados[estadoSalida].agregarTransicion(this.estados[estadoEntrada], transicion);
    };
    BuilderStatePattern.prototype.agregarError = function (estadoSalida, transicion, error) {
        this.estados[estadoSalida].agregarTransicion(new ErrorEnEstados(this.estados[estadoSalida], error), transicion);
    };
    BuilderStatePattern.prototype.agregarErrorAVariosEstadosDeSalida = function (estadoSalida, transicion, error, indexInicialSalida, indexFinalSalida) {
        //agrega un error para varios estados de salida con prefijos.
        //pre indefFinalSalida>indexInicialSalida
        var tamano = indexFinalSalida - indexInicialSalida;
        for (var index = 0; index <= tamano; ++index) {
            this.estados[estadoSalida + (indexInicialSalida + index)].agregarTransicion(new ErrorEnEstados(this.estados[estadoSalida + (indexInicialSalida + index)], error), transicion);
        }
    };
    BuilderStatePattern.prototype.agregarErroresIterados = function (estadoSalida, transicion, error, indexInicialSalida, indexFinalSalida, indexInicialTransi, indexFinalTransi) {
        //pre: indexFinalSalida-indexInicialSalida= indexFinalTransi-indexInicialTransi
        // NO TERMINADO
        var range = indexFinalSalida - indexInicialSalida;
        for (var index = 0; index < range; ++index) {
            this.estados[estadoSalida + (indexInicialSalida + index)].agregarTransicion(new ErrorEnEstados(this.estados[estadoSalida + (indexInicialSalida + index)], error), transicion);
        }
    };
    BuilderStatePattern.prototype.estadoInicial = function () {
        return this.estados[this.idEstadoInicial];
    };
    BuilderStatePattern.prototype.agregarEstadosPrefijados = function (prefix, indexInicial, indexFinal) {
        //prefix debe ser string e indexInicial y final ints
        for (var i = indexInicial; i <= indexFinal; ++i) {
            this.estados[prefix + i] = new Estado(prefix + i);
        }
    };
    BuilderStatePattern.prototype.agregarTransicionesIteradas = function (estadoSalidaPrefix, estadoEntradaPrefix, transicion, inicialSalida, finSalida, inicialEntrada, finEntrada) {
        //pre: |estadosSalida|=|estadosEntrada|
        //implica finSalida-inicialSalida=finEntrada-InicialEntrada
        var tamano = finSalida - inicialSalida;
        for (var index = 0; index <= tamano; ++index) {
            this.estados[estadoSalidaPrefix + (inicialSalida + index)].agregarTransicion(this.estados[estadoEntradaPrefix + (inicialEntrada + index)], transicion);
        }
    };
    return BuilderStatePattern;
})();
/// <reference path = "../escenas/Errores.ts" />
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "ComportamientoAnimado.ts" />
/// <reference path = "../escenas/EstadosDeEscena.ts" />
/*
Es un comportamiento genérico con la idea de ser extendido
Sus características son

Si se está colisionando con un objeto de etiqueta A:
    Realizar acciones dependientes de ese objeto
Caso Contrario:
    El personaje principal ejecuta un mensaje de error.

La escena que lo utiliza debe tener definido
automata

*/
var ComportamientoColision = (function (_super) {
    __extends(ComportamientoColision, _super);
    function ComportamientoColision() {
        _super.apply(this, arguments);
    }
    /*nombreAnimacion(){
        // redefinir por subclase
        return "parado";
    }*/
    ComportamientoColision.prototype.alIniciar = function () {
        if (pilas.escena_actual().estado == undefined) {
            pilas.escena_actual().estado = new SinEstado();
        }
    };
    ComportamientoColision.prototype.alTerminarAnimacion = function () {
        pilas.escena_actual().estado.realizarTransicion(this.argumentos['idComportamiento'], this);
    };
    ComportamientoColision.prototype.ejecutarse = function () {
        this.verificarCondicionesDeEjecucion();
        this.metodo(this.objetoTocado());
    };
    // Si se redefine, debe redefinirse también el método debeEjecutarse. 
    // Esto es para que pueda ofrecerse mayor granularidad al mostrar errores.
    ComportamientoColision.prototype.verificarCondicionesDeEjecucion = function () {
        if (!this.colisiona())
            throw new NoColisionaError(this.argumentos['mensajeError'], this.argumentos['etiqueta']);
    };
    // Si se redefine, debe redefinirse también el método verificarCondicionesDeEjecucion. 
    // Esto es para que pueda ofrecerse mayor granularidad al mostrar errores.
    ComportamientoColision.prototype.debeEjecutarse = function () {
        return this.colisiona();
    };
    ComportamientoColision.prototype.colisiona = function () {
        var _this = this;
        return pilas.obtener_actores_con_etiqueta(this.argumentos['etiqueta'])
            .some(function (objeto) { return objeto.colisiona_con(_this.receptor); });
    };
    ComportamientoColision.prototype.objetoTocado = function () {
        var _this = this;
        return pilas.obtener_actores_con_etiqueta(this.argumentos['etiqueta']).filter(function (objeto) { return objeto.colisiona_con(_this.receptor); })[0];
    };
    ComportamientoColision.prototype.metodo = function (objetoColision) {
        //redefinir por subclase
    };
    return ComportamientoColision;
})(ComportamientoAnimado);
var NoColisionaError = (function (_super) {
    __extends(NoColisionaError, _super);
    function NoColisionaError(mensajeError, etiqueta) {
        var descripcion = etiqueta.toLowerCase().split("animada")[0].split("animado")[0];
        _super.call(this, mensajeError || "¡Acá no hay " + descripcion + "!");
    }
    return NoColisionaError;
})(ActividadError);
var DesencadenarAnimacionSiColisiona = (function (_super) {
    __extends(DesencadenarAnimacionSiColisiona, _super);
    function DesencadenarAnimacionSiColisiona() {
        _super.apply(this, arguments);
    }
    DesencadenarAnimacionSiColisiona.prototype.metodo = function (objetoColision) {
        objetoColision.cargarAnimacion(this.argumentos['animacionColisionado']);
    };
    return DesencadenarAnimacionSiColisiona;
})(ComportamientoColision);
var DesencadenarHabilidadSiColiciona = (function (_super) {
    __extends(DesencadenarHabilidadSiColiciona, _super);
    function DesencadenarHabilidadSiColiciona() {
        _super.apply(this, arguments);
    }
    DesencadenarHabilidadSiColiciona.prototype.metodo = function (objetoColision) {
        objetoColision.aprender(this.argumentos['Habilidad'], this.argumentos['argumentosHabilidad']);
    };
    return DesencadenarHabilidadSiColiciona;
})(ComportamientoColision);
var EncenderPorEtiqueta = (function (_super) {
    __extends(EncenderPorEtiqueta, _super);
    function EncenderPorEtiqueta() {
        _super.apply(this, arguments);
    }
    EncenderPorEtiqueta.prototype.nombreAnimacion = function () {
        return "recoger";
    };
    EncenderPorEtiqueta.prototype.metodo = function (objetoColision) {
        objetoColision.cargarAnimacion(this.nombreProximaAnimacion());
    };
    EncenderPorEtiqueta.prototype.nombreProximaAnimacion = function () {
        return "prendida";
    };
    EncenderPorEtiqueta.prototype.verificarCondicionesDeEjecucion = function () {
        _super.prototype.verificarCondicionesDeEjecucion.call(this);
        if (this.yaEstaPrendida())
            throw new ActividadError("¡Ya está " + this.nombreProximaAnimacion() + "!");
    };
    EncenderPorEtiqueta.prototype.debeEjecutarse = function () {
        return _super.prototype.debeEjecutarse.call(this) && !this.yaEstaPrendida();
    };
    EncenderPorEtiqueta.prototype.yaEstaPrendida = function () {
        return this.objetoTocado().nombreAnimacionActual() == this.nombreProximaAnimacion();
    };
    return EncenderPorEtiqueta;
})(ComportamientoColision);
var MorderPorEtiqueta = (function (_super) {
    __extends(MorderPorEtiqueta, _super);
    function MorderPorEtiqueta() {
        _super.apply(this, arguments);
    }
    MorderPorEtiqueta.prototype.nombreProximaAnimacion = function () {
        return "mordida";
    };
    return MorderPorEtiqueta;
})(EncenderPorEtiqueta);
/// <reference path="ComportamientoAnimado.ts"/>
var ComportamientoDeAltoOrden = (function (_super) {
    __extends(ComportamientoDeAltoOrden, _super);
    function ComportamientoDeAltoOrden() {
        _super.apply(this, arguments);
    }
    ComportamientoDeAltoOrden.prototype.nombreAnimacion = function () {
        return this.argumentos['nombreAnimacion'];
    };
    ComportamientoDeAltoOrden.prototype.alTerminarAnimacion = function () {
        this.argumentos.metodo.apply(this.argumentos['receptor']);
    };
    return ComportamientoDeAltoOrden;
})(ComportamientoAnimado);
/// <reference path="ComportamientoAnimado.ts"/>
/*
Requiere que la escena tenga como atributo una instancia de la
clase contadorDeEtiquetas bajo el nombre contadorDeEtiquetas y una
funcion llamada personajePrincipal que devuelve precisamente dicho
personaje


Ejemplo de uso: ElMonoQueSabeContar.ts
*/
var ContarPorEtiqueta = (function (_super) {
    __extends(ContarPorEtiqueta, _super);
    function ContarPorEtiqueta() {
        _super.apply(this, arguments);
    }
    ContarPorEtiqueta.prototype.nombreAnimacion = function () {
        // redefinir por subclase
        return "contar";
    };
    ContarPorEtiqueta.prototype.metodo = function (objetoColision) {
        this.argumentos['dondeReflejarValor'].aumentar(1);
    };
    return ContarPorEtiqueta;
})(ComportamientoColision);
/// <reference path = "../../dependencias/pilasweb.d.ts" />
/// <reference path = "ComportamientoAnimado.ts" />
var Decir = (function (_super) {
    __extends(Decir, _super);
    function Decir() {
        _super.apply(this, arguments);
    }
    /* Redefinir si corresponde */
    Decir.prototype.alIniciar = function () {
        this.globo = this.crearGlobo();
    };
    Decir.prototype.doActualizar = function () {
        return !this.globo.vivo;
    };
    Decir.prototype.crearGlobo = function () {
        return new Globo(this.receptor, this.argumentos.mensaje);
    };
    return Decir;
})(ComportamientoAnimado);
var Pensar = (function (_super) {
    __extends(Pensar, _super);
    function Pensar() {
        _super.apply(this, arguments);
    }
    Pensar.prototype.crearGlobo = function () {
        return new GloboPensar(this.receptor, this.argumentos.mensaje);
    };
    return Pensar;
})(Decir);
var IrASiguienteFila = (function (_super) {
    __extends(IrASiguienteFila, _super);
    function IrASiguienteFila() {
        _super.apply(this, arguments);
    }
    IrASiguienteFila.prototype.nombreAnimacion = function () {
        // redefinir por subclase
        return "parado";
    };
    IrASiguienteFila.prototype.alTerminarAnimacion = function () {
        var nroF = this.argumentos['personaje'].casilla.nroFila + 1;
        this.argumentos['personaje'].casilla = this.argumentos['cuadricula'].casilla(nroF, 0);
    };
    return IrASiguienteFila;
})(ComportamientoAnimado);
var Martillar = (function (_super) {
    __extends(Martillar, _super);
    function Martillar() {
        _super.apply(this, arguments);
    }
    Martillar.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.vecesRestantes = this.argumentos['veces'];
        var imagen = pilas.imagenes.cargar_grilla("cooperativista.trabajando.png", 3);
        this.receptor.imagen = imagen;
        this.contador = 0;
    };
    Martillar.prototype.actualizar = function () {
        this.contador += 1;
        if (this.contador > 10) {
            this.contador = 0;
            var finaliza = this.receptor._imagen.avanzar();
            if (finaliza) {
                this.vecesRestantes -= 1;
                if (this.vecesRestantes === 0) {
                    this.receptor.restaurar();
                    return true;
                }
            }
        }
    };
    return Martillar;
})(Comportamiento);
/// <reference path = "../../dependencias/pilasweb.d.ts" />
var ModificarRotacionYAltura = (function (_super) {
    __extends(ModificarRotacionYAltura, _super);
    function ModificarRotacionYAltura() {
        _super.apply(this, arguments);
    }
    ModificarRotacionYAltura.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
    };
    ModificarRotacionYAltura.prototype.actualizar = function () {
        if (_super.prototype.actualizar.call(this)) {
            this.receptor.y = this.argumentos['alturaIr'];
            this.receptor.rotacion = this.argumentos['rotacionIr'];
            return true;
        }
        return false;
    };
    return ModificarRotacionYAltura;
})(ComportamientoAnimado);
/// <reference path="ComportamientoColision.ts"/>
var RecogerPorEtiqueta = (function (_super) {
    __extends(RecogerPorEtiqueta, _super);
    function RecogerPorEtiqueta() {
        _super.apply(this, arguments);
    }
    RecogerPorEtiqueta.prototype.metodo = function (objetoColision) {
        objetoColision.eliminar();
        if (this.argumentos['dondeReflejarValor']) {
            this.argumentos['dondeReflejarValor'].aumentar(1);
        }
    };
    RecogerPorEtiqueta.prototype.nombreAnimacion = function () {
        // redefinir por subclase
        return "recoger";
    };
    return RecogerPorEtiqueta;
})(ComportamientoColision);
/// <reference path = "ComportamientoAnimado.ts"/>
var SaltarAnimado = (function (_super) {
    __extends(SaltarAnimado, _super);
    function SaltarAnimado() {
        _super.apply(this, arguments);
    }
    SaltarAnimado.prototype.alIniciar = function () {
        this.velocidad_inicial = this.argumentos.velocidad_inicial || 10;
        this.alTerminar = this.argumentos.alTerminar || function (r) { };
        this.gravedad = this.argumentos.gravedad || 0.3;
        this.suelo = this.receptor.y;
        this.velocidad = this.velocidad_inicial;
        pilas.sonidos.cargar('saltar.wav').reproducir();
    };
    SaltarAnimado.prototype.doActualizar = function () {
        _super.prototype.doActualizar.call(this);
        this.receptor.y += this.velocidad;
        this.velocidad -= this.gravedad;
        if (this.receptor.y <= this.suelo) {
            this.receptor.y = this.suelo;
            this.alTerminar.call(this.receptor);
            return true;
        }
    };
    SaltarAnimado.prototype.nombreAnimacion = function () {
        return "saltar";
    };
    return SaltarAnimado;
})(ComportamientoAnimado);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "SaltarAnimado.ts"/>
/*
Comportamiento que hace saltar al personaje y luego decir una
frase definida por la escena
*/
var SaltarHablando = (function (_super) {
    __extends(SaltarHablando, _super);
    function SaltarHablando() {
        _super.apply(this, arguments);
    }
    SaltarHablando.prototype.alTerminarAnimacion = function () {
        this.receptor.decir(pilas.escena_actual().fraseAlSaltar());
    };
    return SaltarHablando;
})(SaltarAnimado);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/BananaAnimada.ts" />
/// <reference path = "../actores/ManzanaAnimada.ts" />
/// <reference path = "../actores/MonoAnimado.ts" />}
/// <reference path = "../comportamientos/RecogerPorEtiqueta.ts" />}
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts" />}
var AlienInicial = (function (_super) {
    __extends(AlienInicial, _super);
    function AlienInicial() {
        _super.apply(this, arguments);
    }
    AlienInicial.prototype.iniciar = function () {
        this.estado = this.armarEstado();
        this.fondo = new Fondo('fondos.alien-inicial.png', 0, 0);
        this.cuadricula = new Cuadricula(-25, -200, 1, 4, { alto: 25, ancho: (pilas.opciones.ancho * 0.8) }, { grilla: 'invisible.png', cantColumnas: 1 });
        this.fondoCuadricula = new Actor("camino-alien-boton.png", this.cuadricula.x, this.cuadricula.y);
        this.fondoCuadricula.ancho = this.cuadricula.ancho;
        this.automata = new AlienAnimado(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata, 0, 0, false);
        this.boton = new BotonAnimado(0, 0);
        this.boton.derecha = this.cuadricula.derecha + 25;
        this.boton.abajo = this.cuadricula.arriba;
    };
    AlienInicial.prototype.armarEstado = function () {
        var a = new BuilderStatePattern('inicial');
        a.agregarEstadoAceptacion('final');
        a.agregarTransicion('inicial', 'final', 'apretarBoton');
        return a.estadoInicial();
    };
    AlienInicial.prototype.personajePrincipal = function () {
        return this.automata;
    };
    AlienInicial.prototype.avanzar = function () {
        this.automata.hacer_luego(MoverACasillaDerecha);
    };
    AlienInicial.prototype.apretar = function () {
    };
    return AlienInicial;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
var AlienLevantaTuercas = (function (_super) {
    __extends(AlienLevantaTuercas, _super);
    function AlienLevantaTuercas() {
        _super.apply(this, arguments);
    }
    AlienLevantaTuercas.prototype.iniciar = function () {
        this.estado = new SinEstado(function (escena) { return escena.cantidadObjetosConEtiqueta('TuercaAnimada') == 0; });
        this.fondo = new pilas.fondos.Laberinto1();
        this.cuadricula = new Cuadricula(0, -25, 5, 6, { alto: 400 }, { grilla: 'invisible.png',
            cantColumnas: 1 });
        this.automata = new AlienAnimado(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata, 4, 0, false);
        for (var i = 0; i < 5; i++) {
            var tuerca = new TuercaAnimada(0, 0);
            this.cuadricula.agregarActorEnPerspectiva(tuerca, i, i);
            //tuerca.aprender(Flotar,{'Desvio':10})
            //tuerca.aprender(Rotar,{'gradosDeAumentoStep':1})
            tuerca.aprender(Vibrar, { 'gradosDeAumentoStep': 2, 'tiempoVibracion': 40 });
            tuerca.escala = 1.0;
        }
    };
    AlienLevantaTuercas.prototype.moverIzquierda = function () {
        this.automata.hacer_luego(MoverACasillaIzquierda);
    };
    AlienLevantaTuercas.prototype.moverDerecha = function () {
        this.automata.hacer_luego(MoverACasillaDerecha);
    };
    AlienLevantaTuercas.prototype.moverAbajo = function () {
        this.automata.hacer_luego(MoverACasillaAbajo);
    };
    AlienLevantaTuercas.prototype.moverArriba = function () {
        this.automata.hacer_luego(MoverACasillaArriba);
    };
    AlienLevantaTuercas.prototype.levantaTuerca = function () {
        this.automata.hacer_luego(RecogerPorEtiqueta, { 'etiqueta': 'TuercaAnimada', 'mensajeError': 'No hay una tuerca aquí' });
    };
    return AlienLevantaTuercas;
})(EscenaActividad);
/*



function convertir_posicion_a_coordenada(fila, columna) {



    var columnas = [-175, -105, -35, 35, 105, 175];
    var filas = [140, 60, -20, -100, -180];

    return {x: columnas[columna-1], y: filas[fila-1]};
}

class AlienLevantaTuercas extends EscenaActividad {

    iniciar(){
        var fondo = new pilas.fondos.Laberinto1();
        var alien = new pilas.actores.Alien(-175, -180);

        alien.cuando_busca_recoger = function() {
          var actores = pilas.obtener_actores_en(alien.x, alien.y + 20, 'Tuerca')

          if (actores.length > 0) {
            var mensaje = "";
            actores[0].eliminar();
            var restantes = pilas.obtener_actores_con_etiqueta("Tuerca").length;

            if (restantes > 0)
              mensaje = "genial, aún quedan: " + restantes;
            else
              mensaje = "¡Nivel completado!"

            alien.decir(mensaje);
            console.log(mensaje);
          }
        }


        var posicion = convertir_posicion_a_coordenada(1, 1);
        var tuerca = new pilas.actores.Tuerca(posicion.x, posicion.y);

        var posicion = convertir_posicion_a_coordenada(3, 2);
        var tuerca = new pilas.actores.Tuerca(posicion.x, posicion.y);

        var posicion = convertir_posicion_a_coordenada(5, 3);
        var tuerca = new pilas.actores.Tuerca(posicion.x, posicion.y);

        var posicion = convertir_posicion_a_coordenada(3, 6);
        var tuerca = new pilas.actores.Tuerca(posicion.x, posicion.y);

        //window.tuerca = tuerca;
    }

}
*/
/// <reference path = "EscenaActividad.ts" />
var AlimentandoALosPeces = (function (_super) {
    __extends(AlimentandoALosPeces, _super);
    function AlimentandoALosPeces() {
        _super.apply(this, arguments);
    }
    AlimentandoALosPeces.prototype.iniciar = function () {
        this.cantidadFilas = 4;
        this.cantidadColumnas = 5;
        this.fondo = new Fondo('fondo.alimentando_peces.png.png', 0, 0);
        this.cuadricula = new Cuadricula(0, 0, this.cantidadFilas, this.cantidadColumnas, { ancho: 328, alto: 262 }, { grilla: 'invisible.png',
            cantColumnas: 1 });
        this.automata = new BuzoAnimado(0, 0);
        this.cuadricula.agregarActor(this.automata, this.cantidadFilas - 1, 0);
        this.automata.aprender(Flotar, { Desvio: 2 });
        this.alimento = new AlimentoAnimado(0, 0);
        this.cuadricula.agregarActor(this.alimento, 1, this.cantidadColumnas - 1);
        this.colocarPeces();
        this.estado = this.generarEstadoInicial();
    };
    AlimentandoALosPeces.prototype.generarEstadoInicial = function () {
        var builder = new BuilderStatePattern('inicial');
        builder.agregarEstado('tengoLaComida');
        builder.agregarEstadosPrefijados('alimentado', 1, 6);
        builder.agregarEstadoAceptacion('alimentado7');
        builder.agregarTransicion('inicial', 'tengoLaComida', 'recogerComida');
        builder.agregarTransicion('tengoLaComida', 'alimentado1', 'alimentarPez');
        builder.agregarTransicionesIteradas('alimentado', 'alimentado', 'alimentarPez', 1, 6, 2, 7);
        builder.agregarError('inicial', 'alimentarPez', 'Debés recolectar primero el alimento');
        return builder.estadoInicial();
    };
    AlimentandoALosPeces.prototype.colocarPeces = function () {
        this.cuadricula.agregarActor(new PezAnimado(0, 0), this.cantidadFilas - 1, 1);
        this.cuadricula.agregarActor(new PezAnimado(0, 0), this.cantidadFilas - 1, 2);
        this.cuadricula.agregarActor(new PezAnimado(0, 0), this.cantidadFilas - 1, 3);
        this.cuadricula.agregarActor(new PezAnimado(0, 0), 0, 0);
        this.cuadricula.agregarActor(new PezAnimado(0, 0), 0, 1);
        this.cuadricula.agregarActor(new PezAnimado(0, 0), 0, 2);
        this.cuadricula.agregarActor(new PezAnimado(0, 0), 0, 3);
    };
    AlimentandoALosPeces.prototype.alimentarPez = function () {
        this.automata.hacer_luego(RecogerPorEtiqueta, { 'etiqueta': 'PezAnimado', 'mensajeError': 'No hay un pez aqui', 'idComportamiento': 'alimentarPez' });
    };
    AlimentandoALosPeces.prototype.agarrarComida = function () {
        this.automata.hacer_luego(RecogerPorEtiqueta, { 'etiqueta': 'AlimentoAnimado', 'mensajeError': 'No hay una alimento aqui', 'idComportamiento': 'recogerComida' });
    };
    return AlimentandoALosPeces;
})(EscenaActividad);
var Camino = (function () {
    function Camino(x, y, direcciones, cantidadFilas, cantidadColumnas, opcionesCuadricula, opcionesCasilla) {
        this.x = x;
        this.y = y;
        this.cantidadFilas = cantidadFilas;
        this.cantidadColumnas = cantidadColumnas;
        this.opcionesCuadricula = opcionesCuadricula;
        this.opcionesCasilla = opcionesCasilla;
        this.direcciones = direcciones;
        this.matriz = this.dameMatriz();
    }
    Camino.prototype.escalarCasillasCuadradas = function () {
        this.opcionesCasilla['ancho'] = this.opcionesCuadricula['ancho'] / this.cantidadColumnas;
        this.opcionesCasilla['alto'] = this.opcionesCuadricula['alto'] / this.cantidadFilas;
        if (this.opcionesCasilla['ancho'] > this.opcionesCasilla['alto']) {
            this.opcionesCasilla['ancho'] = this.opcionesCasilla['alto'];
        }
        else {
            this.opcionesCasilla['alto'] = this.opcionesCasilla['ancho'];
        }
        this.opcionesCasilla['grilla'] = 'finCamino.png';
        this.opcionesCasilla['cantColumnas'] = 1;
        this.opcionesCuadricula['ancho'] = this.opcionesCasilla['ancho'] * (this.cantidadColumnas);
        this.opcionesCuadricula['alto'] = this.opcionesCasilla['alto'] * (this.cantidadFilas);
    };
    Camino.prototype.dameCamino = function () {
        this.escalarCasillasCuadradas();
        var a = new CuadriculaEsparsa(this.x, this.y, this.opcionesCuadricula, this.opcionesCasilla, this.matriz);
        this.cambiarImagenesCasillasCamino(this.direcciones, a, this.opcionesCasilla, this.opcionesCuadricula, this.cantidadFilas, this.cantidadColumnas);
        return a;
    };
    Camino.prototype.cambiarImagenesCasillasCamino = function (direcciones, cuadricula, opcionesCasilla, opcionesCuadricula, cantFilas, cantColumnas) {
        for (var index = 0; index < cuadricula.casillas.length - 1; index++) {
            cuadricula.casillas[index].imagen = opcionesCasilla[this.direcciones[index]];
        }
        cuadricula.casillas[cuadricula.casillas.length - 1].imagen = 'finCamino.png';
        //solo por reescalado
    };
    Camino.prototype.dameMatriz = function () {
        var aDevolver = [];
        var puntoActual = new Punto(0, 0);
        for (var filas = 0; filas < this.cantidadFilas; ++filas) {
            var aux = [];
            for (var cols = 0; cols < this.cantidadColumnas; ++cols) {
                aux.push('F');
            }
            aDevolver.push(aux);
        }
        aDevolver[puntoActual.y][puntoActual.x] = 'T';
        for (var index = 0; index < this.direcciones.length; index++) {
            puntoActual = puntoActual.siguienteEn(this.direcciones[index]);
            aDevolver[puntoActual.y][puntoActual.x] = 'T';
        }
        return aDevolver;
    };
    return Camino;
})();
var Punto = (function () {
    function Punto(x, y) {
        this.x = x;
        this.y = y;
    }
    Punto.prototype.siguienteEn = function (dir) {
        return new Punto(this.x + this.avanceX(dir), this.y + this.avanceY(dir));
    };
    Punto.prototype.avanceX = function (dir) {
        return Punto.mapa[dir].x;
    };
    Punto.prototype.avanceY = function (dir) {
        return Punto.mapa[dir].y;
    };
    Punto.prototype.cambiarOrigenDeCoordenadas = function (nuevoX, nuevoY) {
        this.x = this.x - nuevoX;
        this.y = this.y - nuevoY;
    };
    Punto.prototype.invertirY = function () {
        this.y = 0 - this.y;
    };
    Punto.mapa = {
        '->': { x: 1, y: 0 },
        '<-': { x: -1, y: 0 },
        '^': { x: 0, y: -1 },
        'v': { x: 0, y: 1 }
    };
    return Punto;
})();
var CuadriculaParaRaton = (function (_super) {
    __extends(CuadriculaParaRaton, _super);
    function CuadriculaParaRaton(x, y, cantMaxX, cantMaxY, opcionesCuadricula, opcionesCasilla) {
        var hastaX = this.dameCant(0, cantMaxX) + 2;
        var hastaY = this.dameCant(0, cantMaxY) + 2;
        //el +2 es para asegurar cuadricula minima
        _super.call(this, x, y, this.dameDirecciones(0, 0, hastaX, hastaY), hastaY, hastaX, opcionesCuadricula, opcionesCasilla);
    }
    CuadriculaParaRaton.prototype.dameCant = function (desde, cantMax) {
        return Math.floor(Math.random() * cantMax + desde);
    };
    CuadriculaParaRaton.prototype.dameDirecciones = function (posInicialX, posInicialY, posFinalX, posFinalY) {
        //pre: solo me voy a moder para abajo y derecha. Con lo cual la
        //pos posInicialX<posFinalX posInicialY<posFinalY
        var cantMovDer = posFinalX - posInicialX - 1;
        var cantMovAbj = posFinalY - posInicialY - 1;
        var a = Array.apply(null, new Array(cantMovDer)).map(function () { return '->'; });
        var b = Array.apply(null, new Array(cantMovAbj)).map(function () { return 'v'; });
        var aDevolver = a.concat(b);
        return this.shuffleArray(aDevolver);
    };
    CuadriculaParaRaton.prototype.shuffleArray = function (array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    };
    return CuadriculaParaRaton;
})(Camino);
/// <reference path = "EscenaActividad.ts" />
/// <reference path="../comportamientos/RecogerPorEtiqueta.ts"/>
/// <reference path="../actores/cuadriculaEsparsa.ts"/>
/// <reference path="../actores/GloboAnimado.ts"/>
/// <reference path = "../comportamientos/RecogerPorEtiqueta.ts" />}
var ElCangrejoAguafiestas = (function (_super) {
    __extends(ElCangrejoAguafiestas, _super);
    function ElCangrejoAguafiestas() {
        _super.apply(this, arguments);
    }
    ElCangrejoAguafiestas.prototype.iniciar = function () {
        this.estado = undefined;
        this.fondo = new Fondo('fondos.nubes.png', 0, 0);
        this.globos = [];
        this.cantidadFilas = 5;
        this.cantidadColumnas = 6;
        var matriz = [
            ['T', 'T', 'T', 'T', 'T', 'T'],
            ['T', 'F', 'F', 'F', 'F', 'T'],
            ['T', 'T', 'T', 'T', 'T', 'T'],
            ['T', 'F', 'F', 'F', 'F', 'T'],
            ['T', 'T', 'T', 'T', 'T', 'T']];
        this.cuadricula = new CuadriculaEsparsa(0, 0, { alto: 100 }, { grilla: 'casillas.violeta.png' }, matriz);
        this.completarConGlobos();
        this.automata = new CangrejoAnimado(0, 0);
        this.cuadricula.agregarActor(this.automata, 0, 0);
    };
    ElCangrejoAguafiestas.prototype.completarConGlobos = function () {
        for (var i = 1; i < this.cantidadColumnas; ++i) {
            var nuevo = new GloboAnimado(0, 0);
            this.globos.push(nuevo);
            this.cuadricula.agregarActor(nuevo, 0, i);
        }
        for (var i = 0; i < this.cantidadColumnas; ++i) {
            var nuevo = new GloboAnimado(0, 0);
            this.globos.push(nuevo);
            this.cuadricula.agregarActor(nuevo, 2, i);
            nuevo = new GloboAnimado(0, 0);
            this.globos.push(nuevo);
            this.cuadricula.agregarActor(nuevo, 4, i);
        }
        nuevo = new GloboAnimado(0, 0);
        this.globos.push(nuevo);
        this.cuadricula.agregarActor(nuevo, 1, 0);
        nuevo = new GloboAnimado(0, 0);
        this.globos.push(nuevo);
        this.cuadricula.agregarActor(nuevo, 3, 0);
        nuevo = new GloboAnimado(0, 0);
        this.globos.push(nuevo);
        this.cuadricula.agregarActor(nuevo, 1, this.cantidadColumnas - 1);
        nuevo = new GloboAnimado(0, 0);
        this.globos.push(nuevo);
        this.cuadricula.agregarActor(nuevo, 3, this.cantidadColumnas - 1);
    };
    ElCangrejoAguafiestas.prototype.moverDerecha = function () {
        this.automata.hacer_luego(MoverACasillaDerecha);
    };
    ElCangrejoAguafiestas.prototype.moverIzquierda = function () {
        this.automata.hacer_luego(MoverACasillaIzquierda);
    };
    ElCangrejoAguafiestas.prototype.moverArriba = function () {
        this.automata.hacer_luego(MoverACasillaArriba);
    };
    ElCangrejoAguafiestas.prototype.moverAbajo = function () {
        this.automata.hacer_luego(MoverACasillaAbajo);
    };
    ElCangrejoAguafiestas.prototype.explotarGlobo = function () {
        this.automata.hacer_luego(RecogerPorEtiqueta, { 'etiqueta': 'GloboAnimado', 'mensajeError': 'No hay un globo aqui' });
    };
    return ElCangrejoAguafiestas;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/BananaAnimada.ts" />
/// <reference path = "../actores/ManzanaAnimada.ts" />
/// <reference path = "../actores/MonoAnimado.ts" />}
/// <reference path = "../comportamientos/RecogerPorEtiqueta.ts" />}
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts" />}
var ElGatoEnLaCalle = (function (_super) {
    __extends(ElGatoEnLaCalle, _super);
    function ElGatoEnLaCalle() {
        _super.apply(this, arguments);
    }
    ElGatoEnLaCalle.prototype.iniciar = function () {
        this.fondo = new Fondo('fondo.gatoEnLaCalle.png', 0, 0);
        this.automata = new GatoAnimado(0, -150);
    };
    ElGatoEnLaCalle.prototype.personajePrincipal = function () {
        return this.automata;
    };
    ElGatoEnLaCalle.prototype.saludar = function () {
        this.automata.hacer_luego(ComportamientoAnimado, { nombreAnimacion: 'saludando' });
    };
    ElGatoEnLaCalle.prototype.ao = function () {
        this.automata.hacer_luego(ComportamientoAnimado, { nombreAnimacion: 'abrirOjos' });
    };
    ElGatoEnLaCalle.prototype.co = function () {
        this.automata.hacer_luego(ComportamientoAnimado, { nombreAnimacion: 'cerrarOjos' });
    };
    ElGatoEnLaCalle.prototype.avanzar = function () {
        this.automata.hacer_luego(ComportamientoAnimado, { nombreAnimacion: 'correr' });
    };
    ElGatoEnLaCalle.prototype.volver = function () {
        this.automata.hacer_luego(ComportamientoAnimado, { nombreAnimacion: 'volver' });
    };
    return ElGatoEnLaCalle;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/**
 * @class ElMarcianoEnElDesierto
 *
 * Objetivos: Ejercitarse en el uso de programas para la resolución de problemas.
 * Enunciado: Comer todas las manzanas del tablero.
 */
var ElMarcianoEnElDesierto = (function (_super) {
    __extends(ElMarcianoEnElDesierto, _super);
    function ElMarcianoEnElDesierto() {
        _super.apply(this, arguments);
    }
    ElMarcianoEnElDesierto.prototype.iniciar = function () {
        this.estado = new SinEstado(function (escena) { return escena.cantidadObjetosConEtiqueta('ManzanaAnimada') == 0; });
        this.fondo = new Fondo('fondo.elMarcianoEnElDesierto.png', 0, 0);
        var cantidadFilas = 4;
        var cantidadColumnas = 5;
        this.cuadricula = new Cuadricula(0, -9, cantidadFilas, cantidadColumnas, { alto: 262, ancho: 330 }, { grilla: 'invisible.png' });
        this.manzanas = [];
        var posiciones = [[0, 0], [0, 2], [0, 4], [1, 4], [2, 4], [3, 2], [3, 1]];
        for (var i = 0; i < posiciones.length; i++) {
            var objeto = new ManzanaAnimada(0, 0);
            posiciones[i];
            this.cuadricula.agregarActor(objeto, posiciones[i][0], posiciones[i][1]);
            objeto.escala *= 0.8;
            this.manzanas.push(objeto);
        }
        this.automata = new MarcianoAnimado(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata, cantidadFilas - 1, 0);
        this.automata.escala = 0.8;
    };
    return ElMarcianoEnElDesierto;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
/// <reference path="../actores/CuadriculaMultiple.ts"/>
var ElMonoQueSabeContar = (function (_super) {
    __extends(ElMonoQueSabeContar, _super);
    function ElMonoQueSabeContar() {
        _super.apply(this, arguments);
        this.etiquetasDeObjetosAColocar = new ConjuntoClases([ManzanaAnimada, BananaAnimada]);
    }
    ElMonoQueSabeContar.prototype.iniciar = function () {
        this.estado = undefined;
        this.fondo = new Fondo('fondos.selva.png', 0, 0);
        this.definidor = new DefinidorColumnasRandom(5, 7);
        this.cuadricula = new CuadriculaMultipleColumnas(this.definidor, 0, 0, { separacionEntreCasillas: 5 }, { alto: 40, ancho: 40, grilla: 'casillamediomono.png', cantColumnas: 1 });
        this.cuadricula.completarConObjetosRandom(this.etiquetasDeObjetosAColocar, { condiciones: [
                function (fila, col, pmatrix) { return fila != 0; },
                //no incluye en primera fila
                function (fila, col, pmatrix) { return pmatrix[fila + 1] != undefined && pmatrix[fila + 1][col] == 'T'; }
            ] });
        this.cuadricula.cambiarImagenInicio('casillainiciomono.png');
        this.cuadricula.cambiarImagenFin('casillafinalmono.png');
        this.automata = new MonoAnimado(0, 0);
        this.automata.escala = 0.5;
        this.cuadricula.agregarActorEnPerspectiva(this.automata, 0, 0, false);
        this.tableroManzanas = new Tablero(120, 210, { texto: "Manzanas" });
        this.tableroBananas = new Tablero(-120, 230, { texto: "Bananas" });
        this.contadorManzanas = new ObservadoConAumentar();
        this.contadorManzanas.cantidad = 0;
        this.contadorBananas = new ObservadoConAumentar();
        this.contadorBananas.cantidad = 0;
        this.contadorManzanas.registrarObservador(this.tableroManzanas);
        this.contadorBananas.registrarObservador(this.tableroBananas);
        this.cuadricula.arriba = 200;
        //this.cuadricula.y=pilas.arriba()-this.cuadricula.alto-40;
    };
    ElMonoQueSabeContar.prototype.personajePrincipal = function () {
        return this.automata;
    };
    ElMonoQueSabeContar.prototype.contar = function () {
        this.automata.hacer_luego(ContarPorEtiqueta, { etiqueta: BananaAnimada, dondeReflejarValor: this.contadorManzanas, mensajeError: 'a' });
    };
    return ElMonoQueSabeContar;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/BananaAnimada.ts" />
/// <reference path = "../actores/ManzanaAnimada.ts" />
/// <reference path = "../actores/MonoAnimado.ts" />}
/// <reference path = "../comportamientos/RecogerPorEtiqueta.ts" />}
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts" />}
var LaEleccionDelMono = (function (_super) {
    __extends(LaEleccionDelMono, _super);
    function LaEleccionDelMono() {
        _super.apply(this, arguments);
    }
    LaEleccionDelMono.prototype.iniciar = function () {
        this.estado = new SinEstado(function (escena) { return escena.cantidadObjetosConEtiqueta('BananaAnimada') == 0 && escena.cantidadObjetosConEtiqueta('BananaAnimada') == 0; });
        this.fondo = new Fondo('fondos.selva.png', 0, 0);
        this.cuadricula = new Cuadricula(0, 0, 1, 2, { alto: 200 }, { grilla: 'casillas.violeta.png',
            cantColumnas: 1 });
        this.automata = new MonoAnimado(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata, 0, 0, false);
        this.agregarFruta();
    };
    LaEleccionDelMono.prototype.agregarFruta = function () {
        if (Math.random() < .5) {
            this.agregar(ManzanaAnimada);
        }
        else {
            this.agregar(BananaAnimada);
        }
    };
    LaEleccionDelMono.prototype.agregar = function (objeto) {
        this.cuadricula.agregarActorEnPerspectiva(new objeto(0, 0), 0, 1, false);
    };
    return LaEleccionDelMono;
})(EscenaActividad);
/// <reference path = "LaEleccionDelMono.ts" />
/// <reference path = "../actores/BananaAnimada.ts" />
var ElMonoYLasBananas = (function (_super) {
    __extends(ElMonoYLasBananas, _super);
    function ElMonoYLasBananas() {
        _super.apply(this, arguments);
    }
    ElMonoYLasBananas.prototype.agregarFruta = function () {
        if (Math.random() < .5) {
            this.agregar(BananaAnimada);
        }
    };
    return ElMonoYLasBananas;
})(LaEleccionDelMono);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "HabilidadAnimada.ts"/>
//No sólo avisa al salir de la pantalla, sino que no lo deja irse.
//Usar en reemplazo de la habilidad SeMantieneEnPantalla
// TODO: Repite código con SeMantieneEnPantalla, modificar pilas para que deje de hacerlo.
var AvisaAlSalirDePantalla = (function (_super) {
    __extends(AvisaAlSalirDePantalla, _super);
    function AvisaAlSalirDePantalla(receptor) {
        _super.call(this, receptor);
        this.receptor.evto_se_movio.conectar(this);
    }
    AvisaAlSalirDePantalla.prototype.recibir = function (evento, tipo) {
        if (tipo == this.receptor.evto_se_movio &&
            this.seSalioDeLaPantalla()) {
            this.meterActorEnPantalla();
            this.accionLuegoDeMeterEnPantalla();
        }
    };
    AvisaAlSalirDePantalla.prototype.accionLuegoDeMeterEnPantalla = function () {
        this.receptor.decir("¡Me salgo de la pantalla!");
    };
    AvisaAlSalirDePantalla.prototype.meterActorEnPantalla = function () {
        if (this.meFuiDerecha())
            this.receptor.derecha = pilas.derecha();
        if (this.meFuiIzquierda())
            this.receptor.izquierda = pilas.izquierda();
        if (this.meFuiArriba())
            this.receptor.arriba = pilas.arriba();
        if (this.meFuiAbajo())
            this.receptor.abajo = pilas.abajo();
    };
    AvisaAlSalirDePantalla.prototype.seSalioDeLaPantalla = function () {
        return this.meFuiDerecha() ||
            this.meFuiIzquierda() ||
            this.meFuiArriba() ||
            this.meFuiAbajo();
    };
    AvisaAlSalirDePantalla.prototype.meFuiIzquierda = function () {
        return this.receptor.izquierda < pilas.izquierda();
    };
    AvisaAlSalirDePantalla.prototype.meFuiDerecha = function () {
        return this.receptor.derecha > pilas.derecha();
    };
    AvisaAlSalirDePantalla.prototype.meFuiArriba = function () {
        return this.receptor.arriba > pilas.arriba();
    };
    AvisaAlSalirDePantalla.prototype.meFuiAbajo = function () {
        return this.receptor.abajo < pilas.abajo();
    };
    return AvisaAlSalirDePantalla;
})(HabilidadAnimada);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Obrero.ts"/>
/// <reference path = "../habilidades/AvisaAlSalirDePantalla.ts"/>
/// <reference path = "../comportamientos/Martillar.ts"/>
/**
 * @class ElObreroCopado
 *
 * Objetivos: Introducir Secuencia. Autómata, y procedimiento.
 */
var ElObreroCopado = (function (_super) {
    __extends(ElObreroCopado, _super);
    function ElObreroCopado() {
        _super.apply(this, arguments);
    }
    ElObreroCopado.prototype.iniciar = function () {
        this.fondo = new Fondo('fondos.obrero.png', 0, 0);
        this.obrero = new Obrero(160, -100);
        //this.obrero.aprender(AvisaAlSalirDePantalla,{});
        this.automata = this.obrero;
    };
    /*************** Métodos para que se cuelgue blockly ****************/
    /****** Deben tener sólo una línea, que sea un "hacer_luego" ********/
    /****** El nombre debe ser el que tendrá el bloque en blockly *******/
    ElObreroCopado.prototype.avanzar = function () {
        this.obrero.hacer_luego(CaminaIzquierda, { pasos: 2 });
    };
    ElObreroCopado.prototype.retroceder = function () {
        this.obrero.hacer_luego(CaminaDerecha, { pasos: 2 });
    };
    ElObreroCopado.prototype.martillar = function () {
        this.obrero.hacer_luego(Martillar, { veces: 20 });
    };
    ElObreroCopado.prototype.saltar = function () {
        this.obrero.hacer_luego(Saltar);
    };
    return ElObreroCopado;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
var ElPlanetaDeNano = (function (_super) {
    __extends(ElPlanetaDeNano, _super);
    function ElPlanetaDeNano() {
        _super.apply(this, arguments);
    }
    ElPlanetaDeNano.prototype.iniciar = function () {
        var _this = this;
        this.estado = undefined;
        //this.recolector.izquierda = pilas.izquierda();
        var cantidadFilas = 4;
        this.cantidadColumnas = 5;
        this.fondo = new Fondo('fondos.elPlanetaDeNano.png', 0, 0);
        this.cuadricula = new Cuadricula(0, 0, cantidadFilas, this.cantidadColumnas, { alto: 300, ancho: 300 }, { grilla: 'casillas.elPlanetaDeNano.png' });
        this.automata = new NanoAnimado(0, 0);
        this.cuadricula.agregarActor(this.automata, cantidadFilas - 1, 0);
        this.secuenciaCaminata = new Secuencia({ 'secuencia': [new MoverACasillaIzquierda({})] });
        this.secuenciaCaminata.iniciar(this.automata);
        this.condicion = function () { return _this.personajePrincipal().casillaActual().nroColumna == 0; };
        this.tableroBananas = new Tablero(150, 220, { texto: "Bananas" });
        this.cantidadBananas = new ObservadoConAumentar();
        this.cantidadBananas.cantidad = 0;
        this.cantidadBananas.registrarObservador(this.tableroBananas);
        this.completarConBananas();
    };
    ElPlanetaDeNano.prototype.personajePrincipal = function () {
        return this.automata;
    };
    ElPlanetaDeNano.prototype.completarConBananas = function () {
        this.cuadricula.agregarActor(new BananaAnimada(0, 0), 0, 1);
        this.cuadricula.agregarActor(new BananaAnimada(0, 0), 1, 1);
        this.cuadricula.agregarActor(new BananaAnimada(0, 0), 1, 2);
        this.cuadricula.agregarActor(new BananaAnimada(0, 0), 2, 1);
        this.cuadricula.agregarActor(new BananaAnimada(0, 0), 2, 2);
        this.cuadricula.agregarActor(new BananaAnimada(0, 0), 2, 3);
        this.cuadricula.agregarActor(new BananaAnimada(0, 0), 3, 1);
        this.cuadricula.agregarActor(new BananaAnimada(0, 0), 3, 2);
        this.cuadricula.agregarActor(new BananaAnimada(0, 0), 3, 3);
        this.cuadricula.agregarActor(new BananaAnimada(0, 0), 3, 4);
    };
    ElPlanetaDeNano.prototype.volverABordeIzquierdo = function () {
        this.automata.hacer_luego(RepetirHasta, { 'secuencia': this.secuenciaCaminata, 'condicion': this.condicion });
    };
    ElPlanetaDeNano.prototype.comerBanana = function () {
        this.automata.hacer_luego(RecogerPorEtiqueta, { 'etiqueta': 'BananaAnimada', 'mensajeError': 'No hay una banana aquí', 'dondeReflejarValor': this.cantidadBananas });
    };
    ElPlanetaDeNano.prototype.moverDerecha = function () {
        this.automata.hacer_luego(MoverACasillaDerecha);
    };
    ElPlanetaDeNano.prototype.moverArriba = function () {
        this.automata.hacer_luego(MoverACasillaArriba);
    };
    return ElPlanetaDeNano;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
var ElRecolectorDeEstrellas = (function (_super) {
    __extends(ElRecolectorDeEstrellas, _super);
    function ElRecolectorDeEstrellas() {
        _super.apply(this, arguments);
    }
    ElRecolectorDeEstrellas.prototype.iniciar = function () {
        this.estado = new SinEstado(function (escena) { return escena.cantidadObjetosConEtiqueta('EstrellaAnimada') == 0; });
        this.fondo = new Fondo('fondo.recolector.png', 0, 0);
        //this.recolector.izquierda = pilas.izquierda();
        var cantidadFilas = 4;
        var cantidadColumnas = 5;
        this.cuadricula = new Cuadricula(0, -20, cantidadFilas, cantidadColumnas, { alto: 400 }, { grilla: 'invisible.png',
            cantColumnas: 1 });
        this.automata = new RecolectorEstrellas(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata, cantidadFilas - 1, 0);
        // La posición inicial pretende respectar el ejemplo
        this.objetos = [];
        for (var fila = 0; fila < cantidadFilas; fila++) {
            for (var columna = 1; columna < cantidadColumnas; columna++) {
                var objeto = new EstrellaAnimada(0, 0);
                this.cuadricula.agregarActor(objeto, fila, columna);
                this.objetos.push(objeto);
            }
        }
    };
    ElRecolectorDeEstrellas.prototype.volverAlBordeIzquierdo = function () {
        this.automata.hacer_luego(MoverTodoAIzquierda);
    };
    ElRecolectorDeEstrellas.prototype.irArriba = function () {
        this.automata.hacer_luego(MoverACasillaArriba);
    };
    ElRecolectorDeEstrellas.prototype.irDerecha = function () {
        this.automata.hacer_luego(MoverACasillaDerecha);
    };
    ElRecolectorDeEstrellas.prototype.recogerEstrella = function () {
        this.automata.hacer_luego(Recoger);
    };
    return ElRecolectorDeEstrellas;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
/// <reference path="../actores/ActorAnimado.ts"/>
var FutbolRobots = (function (_super) {
    __extends(FutbolRobots, _super);
    function FutbolRobots() {
        _super.apply(this, arguments);
    }
    FutbolRobots.prototype.iniciar = function () {
        this.estado = undefined;
        this.fondo = new Fondo('fondos.futbolRobots.png', 0, 0);
        var cantidadFilas = 8;
        this.definidor = new DefinidorColumnasRandom(cantidadFilas, 6);
        this.cuadricula = new CuadriculaMultiple(this.definidor, 0, -50, { separacionEntreCasillas: 5 }, { grilla: 'casilla.futbolRobots2.png', alto: 40, ancho: 40 });
        this.cuadricula.cambiarImagenInicio('casilla.futbolRobots1.png');
        this.automata = new RobotAnimado(0, 0);
        this.cuadricula.agregarActor(this.automata, 0, 0);
        var casilla = this.cuadricula.casilla(0, 0);
        this.automata.escalarAAlto(3.5 * casilla.alto);
        this.automata.abajo = casilla.y - (0.25 * casilla.alto);
        this.automata.radio_de_colision = this.automata.alto / 2.5;
        for (var fila = 0; fila < cantidadFilas; ++fila) {
            this.cuadricula.agregarActor(new PelotaAnimada(0, 0), fila, this.cuadricula.dameIndexUltimaPosicion(fila));
        }
    };
    FutbolRobots.prototype.atras = function () {
        this.automata.hacer_luego(MoverACasillaIzquierda);
    };
    FutbolRobots.prototype.avanzar = function () {
        this.automata.hacer_luego(MoverACasillaDerecha);
    };
    FutbolRobots.prototype.siguienteFila = function () {
        this.automata.hacer_luego(avanzarFilaEnCuadriculaMultiple);
    };
    FutbolRobots.prototype.patearPelota = function () {
        this.automata.hacer_luego(DesencadenarHabilidadSiColiciona, { "Habilidad": SerPateado, 'etiqueta': 'PelotaAnimada', 'mensajeError': 'No hay una pelota aquí', 'argumentosHabilidad': { 'tiempoEnElAire': 25, 'aceleracion': 0.0025, 'elevacionMaxima': 25, 'gradosDeAumentoStep': -2 } });
    };
    return FutbolRobots;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/CompuAnimada.ts" />
/// <reference path = "../actores/InstaladorAnimado.ts" />
/// <reference path = "../comportamientos/ComportamientoAnimado.ts" />
/// <reference path = "../comportamientos/ComportamientoColision.ts" />
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts" />
var InstalandoJuegos = (function (_super) {
    __extends(InstalandoJuegos, _super);
    function InstalandoJuegos() {
        _super.apply(this, arguments);
    }
    InstalandoJuegos.prototype.iniciar = function () {
        this.fondo = new Fondo('fondos.biblioteca.png', 0, 0);
        this.cuadricula = new Cuadricula(20, -50, 1, 4, { alto: 100, ancho: 400 }, { grilla: 'invisible.png', cantColumnas: 1 });
        for (var i = 1; i <= 3; ++i) {
            this.cuadricula.agregarActor(new CompuAnimada(0, 0), 0, i);
        }
        this.colocarAutomata();
        this.construirFSM();
    };
    InstalandoJuegos.prototype.construirFSM = function () {
        var builder = new BuilderStatePattern('inicial');
        builder.agregarEstadosPrefijados('prendido', 1, 3);
        builder.agregarEstadosPrefijados('escritoA', 1, 3);
        builder.agregarEstadosPrefijados('escritoB', 1, 3);
        builder.agregarEstadosPrefijados('escritoC', 1, 3);
        builder.agregarEstadosPrefijados('juegoInstalado', 1, 3);
        builder.agregarEstadosPrefijados('maquinaApagada', 1, 3);
        builder.agregarTransicionesIteradas('prendido', 'escritoA', 'escribirA', 1, 3, 1, 3);
        builder.agregarTransicionesIteradas('escritoA', 'escritoB', 'escribirB', 1, 3, 1, 3);
        builder.agregarTransicionesIteradas('escritoB', 'escritoC', 'escribirC', 1, 3, 1, 3);
        builder.agregarTransicionesIteradas('escritoC', 'juegoInstalado', 'instalar', 1, 3, 1, 3);
        builder.agregarTransicionesIteradas('juegoInstalado', 'maquinaApagada', 'apagar', 1, 3, 1, 3);
        builder.agregarTransicion('inicial', 'prendido1', 'prender');
        builder.agregarTransicion('maquinaApagada1', 'prendido2', 'prender');
        builder.agregarTransicion('maquinaApagada2', 'prendido3', 'prender');
        builder.agregarError('inicial', 'instalar', 'Primero hay que prender la computadora');
        builder.agregarError('inicial', 'escribirA', 'Primero hay que prender la computadora');
        builder.agregarError('inicial', 'escribirB', 'Primero hay que prender la computadora');
        builder.agregarError('inicial', 'escribirC', 'Primero hay que prender la computadora');
        builder.agregarError('inicial', 'apagar', 'Primero hay que prender la computadora');
        builder.agregarErrorAVariosEstadosDeSalida('maquinaApagada', 'instalar', 'Primero hay que prender la computadora', 1, 3);
        builder.agregarErrorAVariosEstadosDeSalida('maquinaApagada', 'escribirC', 'Primero hay que prender la computadora', 1, 3);
        builder.agregarErrorAVariosEstadosDeSalida('maquinaApagada', 'escribirA', 'Primero hay que prender la computadora', 1, 3);
        builder.agregarErrorAVariosEstadosDeSalida('maquinaApagada', 'escribirB', 'Primero hay que prender la computadora', 1, 3);
        builder.agregarErrorAVariosEstadosDeSalida('maquinaApagada', 'apagar', 'Primero hay que prender la computadora', 1, 3);
        builder.agregarErrorAVariosEstadosDeSalida('prendido', 'escribirC', 'Esa no es la clave correcta', 1, 3);
        builder.agregarErrorAVariosEstadosDeSalida('prendido', 'escribirB', 'Esa no es la clave correcta', 1, 3);
        builder.agregarErrorAVariosEstadosDeSalida('escritoA', 'escribirC', 'Esa no es la clave correcta', 1, 3);
        builder.agregarErrorAVariosEstadosDeSalida('escritoA', 'escribirA', 'Esa no es la clave correcta', 1, 3);
        builder.agregarErrorAVariosEstadosDeSalida('escritoB', 'escribirB', 'Esa no es la clave correcta', 1, 3);
        builder.agregarErrorAVariosEstadosDeSalida('escritoB', 'escribirA', 'Esa no es la clave correcta', 1, 3);
        this.estado = builder.estadoInicial();
    };
    InstalandoJuegos.prototype.colocarAutomata = function () {
        this.automata = new InstaladorAnimado(0, 0);
        this.cuadricula.agregarActor(this.automata, 0, 0);
        this.automata.escala = 1;
        this.automata.y = -75;
        this.automata.x = -170;
    };
    InstalandoJuegos.prototype.siguienteCompu = function () {
        this.automata.hacer_luego(MoverACasillaDerecha);
    };
    InstalandoJuegos.prototype.prenderCompu = function () {
        this.automata.hacer_luego(PrenderPorEtiqueta, { 'etiqueta': 'CompuAnimada', 'mensajeError': 'No hay una compu aqui', 'idComportamiento': 'prender' });
    };
    InstalandoJuegos.prototype.apagarCompu = function () {
        this.automata.hacer_luego(ApagarPorEtiqueta, { 'etiqueta': 'CompuAnimada', 'mensajeError': 'No hay una compu aqui', 'idComportamiento': 'apagar' });
    };
    InstalandoJuegos.prototype.instalarJuego = function () {
        this.automata.hacer_luego(InstalarPorEtiqueta, { 'etiqueta': 'CompuAnimada', 'mensajeError': 'No hay una compu aqui', 'idComportamiento': 'instalar' });
    };
    InstalandoJuegos.prototype.escribirC = function () {
        this.automata.hacer_luego(EscribirEnCompuAnimada, { 'etiqueta': 'CompuAnimada', 'mensajeError': 'No hay una compu aqui', 'idComportamiento': 'escribirC' });
    };
    InstalandoJuegos.prototype.escribirB = function () {
        this.automata.hacer_luego(EscribirEnCompuAnimada, { 'etiqueta': 'CompuAnimada', 'mensajeError': 'No hay una compu aqui', 'idComportamiento': 'escribirB' });
    };
    InstalandoJuegos.prototype.escribirA = function () {
        this.automata.hacer_luego(EscribirEnCompuAnimada, { 'etiqueta': 'CompuAnimada', 'mensajeError': 'No hay una compu aqui', 'idComportamiento': 'escribirA' });
    };
    return InstalandoJuegos;
})(EscenaActividad);
var ApagarPorEtiqueta = (function (_super) {
    __extends(ApagarPorEtiqueta, _super);
    function ApagarPorEtiqueta() {
        _super.apply(this, arguments);
    }
    ApagarPorEtiqueta.prototype.metodo = function (objetoColision) {
        objetoColision.hacer_luego(ComportamientoAnimado, { nombreAnimacion: "apagada", mantenerAnimacion: true });
    };
    return ApagarPorEtiqueta;
})(ComportamientoColision);
var InstalarPorEtiqueta = (function (_super) {
    __extends(InstalarPorEtiqueta, _super);
    function InstalarPorEtiqueta() {
        _super.apply(this, arguments);
    }
    InstalarPorEtiqueta.prototype.metodo = function (objetoColision) {
        objetoColision.hacer_luego(ComportamientoAnimado, { nombreAnimacion: "instalado", mantenerAnimacion: true });
    };
    return InstalarPorEtiqueta;
})(ComportamientoColision);
var PrenderPorEtiqueta = (function (_super) {
    __extends(PrenderPorEtiqueta, _super);
    function PrenderPorEtiqueta() {
        _super.apply(this, arguments);
    }
    PrenderPorEtiqueta.prototype.metodo = function (objetoColision) {
        objetoColision.hacer_luego(ComportamientoAnimado, { nombreAnimacion: "prendida", mantenerAnimacion: true });
    };
    return PrenderPorEtiqueta;
})(ComportamientoColision);
var EscribirEnCompuAnimada = (function (_super) {
    __extends(EscribirEnCompuAnimada, _super);
    function EscribirEnCompuAnimada() {
        _super.apply(this, arguments);
    }
    EscribirEnCompuAnimada.prototype.metodo = function (objetoColision) {
        if (this.argumentos['idComportamiento'] == 'escribirC') {
            objetoColision.hacer_luego(ComportamientoAnimado, { nombreAnimacion: "claveok", mantenerAnimacion: true });
        }
    };
    return EscribirEnCompuAnimada;
})(ComportamientoColision);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Cuadricula.ts"/>
/// <reference path = "../actores/HeroeAnimado.ts"/>
/// <reference path = "../actores/CofreAnimado.ts"/>
/// <reference path = "../actores/LlaveAnimado.ts"/>
/// <reference path = "../actores/MagoAnimado.ts"/>
/// <reference path = "../actores/CaballeroAnimado.ts"/>
/// <reference path = "../actores/UnicornioAnimado.ts"/>
/// <reference path = "../habilidades/AvisaAlSalirDePantalla.ts"/>
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts"/>
/// <reference path = "../comportamientos/ComportamientoDeAltoOrden.ts"/>
/**
 * @class LaGranAventuraDelMarEncantado
 *
 */
var LaGranAventuraDelMarEncantado = (function (_super) {
    __extends(LaGranAventuraDelMarEncantado, _super);
    function LaGranAventuraDelMarEncantado() {
        _super.apply(this, arguments);
    }
    LaGranAventuraDelMarEncantado.prototype.iniciar = function () {
        this.fondo = new Fondo('fondos.nubes.png', 0, 0);
        this.cuadricula = new Cuadricula(0, 0, 4, 5, { alto: 400, ancho: 380 }, { grilla: 'casillas.violeta.png' });
        this.llave = new LlaveAnimado(0, 0);
        this.cuadricula.agregarActor(this.llave, 1, 4);
        this.llave.escala *= 0.7;
        this.llave.aprender(Flotar, { Desvio: 5 });
        this.cofre = new CofreAnimado(0, 0);
        this.cuadricula.agregarActor(this.cofre, 0, 0);
        this.cofre.escala * 2;
        this.cofre.x += 8;
        this.caballero = new CaballeroAnimado(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.caballero, 1, 2);
        this.caballero.escala *= 1.5;
        this.mago = new MagoAnimado(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.mago, 3, 1);
        this.mago.escala *= 1.5;
        this.unicornio = new UnicornioAnimado(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.unicornio, 3, 4);
        this.unicornio.escala *= 1.5;
        this.automata = new HeroeAnimado(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata, 3, 0);
        this.automata.escala *= 1.5;
        // se carga el estado inicial
        this.construirFSM();
    };
    LaGranAventuraDelMarEncantado.prototype.construirFSM = function () {
        var builder = new BuilderStatePattern('inicial');
        builder.agregarEstado('llaveEnMano');
        builder.agregarEstado('cofreAbierto');
        builder.agregarEstado('magoConSombrero');
        builder.agregarEstado('princesaRescatada');
        builder.agregarEstadoAceptacion('montandoUnicornio');
        builder.agregarTransicion('inicial', 'llaveEnMano', 'agarrarLlave');
        builder.agregarTransicion('llaveEnMano', 'cofreAbierto', 'abrirCofre');
        builder.agregarTransicion('cofreAbierto', 'magoConSombrero', 'darSombrero');
        builder.agregarTransicion('magoConSombrero', 'princesaRescatada', 'atacarConEspada');
        builder.agregarTransicion('princesaRescatada', 'montandoUnicornio', 'escaparEnUnicornio');
        var estados = ['inicial', 'llaveEnMano', 'cofreAbierto', 'magoConSombrero', 'princesaRescatada', 'montandoUnicornio'];
        for (var i = 0; i < estados.length; i++) {
            if (estados[i] != 'llaveEnMano') {
                builder.agregarError(estados[i], 'abrirCofre', 'Para abrir el cofre necesitás la llave.');
            }
            if (estados[i] != 'cofreAbierto') {
                builder.agregarError(estados[i], 'darSombrero', 'Para darle el sombrero al mago necesitás sacarlo del cofre.');
            }
            if (estados[i] != 'magoConSombrero') {
                builder.agregarError(estados[i], 'atacarConEspada', 'Para atacar al caballero, el mago debe darte la espada.');
            }
            if (estados[i] != 'princesaRescatada') {
                builder.agregarError(estados[i], 'escaparEnUnicornio', 'Para escapar en unicornio, debés rescatar a la princesa.');
            }
        }
        this.estado = builder.estadoInicial();
    };
    return LaGranAventuraDelMarEncantado;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
/// <reference path="../comportamientos/RecogerPorEtiqueta.ts"/>
/// <reference path="../actores/cuadriculaEsparsa.ts"/>
/// <reference path="../actores/RatonAnimado.ts"/>
/// <reference path = "../comportamientos/RecogerPorEtiqueta.ts" />}
/// <reference path="Camino.ts"/>
var LaberintoConQueso = (function (_super) {
    __extends(LaberintoConQueso, _super);
    function LaberintoConQueso() {
        _super.apply(this, arguments);
    }
    LaberintoConQueso.prototype.iniciar = function () {
        this.estado = undefined;
        this.cuadricula = new CuadriculaParaRaton(0, 0, 10, 10, { 'alto': 400, 'ancho': 300 }, { '->': 'casillaDerecha.png', '<-': 'casillaIzquierda.png', 'v': 'casillaAbajo.png', '^': 'casillaArriba.png' }).dameCamino();
        this.cuadricula.completarConObjetosRandom([QuesoAnimado]);
        this.automata = new RatonAnimado(0, 0);
        this.cuadricula.agregarActor(this.automata, 0, 0);
    };
    LaberintoConQueso.prototype.valorCondicion = function (argumentos) {
        return argumentos.receptor.y > 250;
    };
    LaberintoConQueso.prototype.personajePrincipal = function () {
        return this.automata;
    };
    LaberintoConQueso.prototype.moverDerecha = function () {
        this.automata.hacer_luego(MoverACasillaDerecha);
    };
    LaberintoConQueso.prototype.moverAbajo = function () {
        this.automata.hacer_luego(MoverACasillaAbajo);
    };
    LaberintoConQueso.prototype.ComerQueso = function () {
        this.automata.hacer_luego(RecogerPorEtiqueta, { 'etiqueta': 'QuesoAnimado', 'mensajeError': 'No hay queso aqui' });
    };
    return LaberintoConQueso;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "Camino.ts"/>
/// <reference path = "../actores/PerroCohete.ts"/>
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts"/>
/**
 * @class LaberintoCorto
 *
 */
var LaberintoCorto = (function (_super) {
    __extends(LaberintoCorto, _super);
    function LaberintoCorto() {
        _super.apply(this, arguments);
    }
    LaberintoCorto.prototype.iniciar = function () {
        this.fondo = new Fondo('fondos.nubes.png', 0, 0);
        //this.robot.izquierda = pilas.izquierda();
        this.cuadricula2 = new Camino(0, 0, ['->', 'v', '->', '->'], 2, 4, { 'alto': 400, 'ancho': 300 }, { grilla: 'finCamino.png', cantColumnas: 1, '->': 'casillaDerecha.png', '<-': 'casillaIzquierda.png', 'v': 'casillaAbajo.png', '^': 'casillaArriba.png' });
        this.cuadricula = this.cuadricula2.dameCamino();
        this.automata = new PerroCohete(0, 0);
        this.cuadricula.agregarActor(this.automata, 0, 0);
    };
    LaberintoCorto.prototype.irArriba = function () {
        this.automata.hacer_luego(MoverACasillaArriba);
    };
    LaberintoCorto.prototype.irAbajo = function () {
        this.automata.hacer_luego(MoverACasillaAbajo);
    };
    LaberintoCorto.prototype.irDerecha = function () {
        this.automata.hacer_luego(MoverACasillaDerecha);
    };
    LaberintoCorto.prototype.irIzquierda = function () {
        this.automata.hacer_luego(MoverACasillaIzquierda);
    };
    return LaberintoCorto;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
var LaberintoLargo = (function (_super) {
    __extends(LaberintoLargo, _super);
    function LaberintoLargo() {
        _super.apply(this, arguments);
    }
    LaberintoLargo.prototype.iniciar = function () {
        this.estado = undefined;
        this.cuadricula = new CuadriculaParaRaton(0, 0, 10, 10, { 'alto': 400, 'ancho': 300 }, { '->': 'casillaDerecha.png', '<-': 'casillaIzquierda.png', 'v': 'casillaAbajo.png', '^': 'casillaArriba.png' }).dameCamino();
        this.automata = new RatonAnimado(0, 0);
        this.cuadricula.agregarActor(this.automata, 0, 0);
    };
    LaberintoLargo.prototype.valorCondicion = function (argumentos) {
        return argumentos.receptor.y > 250;
    };
    LaberintoLargo.prototype.personajePrincipal = function () {
        return this.automata;
    };
    LaberintoLargo.prototype.moverDerecha = function () {
        this.automata.hacer_luego(MoverACasillaDerecha);
    };
    LaberintoLargo.prototype.moverAbajo = function () {
        this.automata.hacer_luego(MoverACasillaAbajo);
    };
    return LaberintoLargo;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/MariaAnimada.ts" />
/// <reference path = "../actores/Cuadricula.ts" />
var MariaLaComeSandias = (function (_super) {
    __extends(MariaLaComeSandias, _super);
    function MariaLaComeSandias() {
        _super.apply(this, arguments);
    }
    MariaLaComeSandias.prototype.iniciar = function () {
        this.estado = undefined;
        this.fondo = new Fondo('fondo.mariaSandia.png', 0, 0);
        var cantidadFilas = 5;
        this.cantidadColumnas = 6;
        this.cuadricula = new Cuadricula(0, 0, cantidadFilas, this.cantidadColumnas, { alto: 300, ancho: 300, separacionEntreCasillas: 5 }, { grilla: 'casilla.mariaSandia.png',
            cantColumnas: 5 });
        this.completarConSandias();
        this.automata = new MariaAnimada(0, 0);
        this.cuadricula.agregarActor(this.automata, cantidadFilas - 1, 0);
        this.automata.escala *= 2;
        this.automata.abajo = this.cuadricula.casilla(cantidadFilas - 1, 0).abajo;
    };
    MariaLaComeSandias.prototype.completarConSandias = function () {
        this.completarFila(0);
        this.completarFila(2);
        this.completarFila(4);
        this.cuadricula.agregarActor(new SandiaAnimada(0, 0), 1, 0);
        this.cuadricula.agregarActor(new SandiaAnimada(0, 0), 3, 0);
    };
    MariaLaComeSandias.prototype.completarFila = function (numeroFila) {
        for (var x = 0; x < this.cantidadColumnas; x++) {
            this.cuadricula.agregarActor(new SandiaAnimada(0, 0), numeroFila, x);
        }
    };
    return MariaLaComeSandias;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../comportamientos/SaltarHablando.ts" />
/**
 * @class NoMeCansoDeSaltar
 *
 * Objetivos: Introducir Repetición
 * Enunciado: Repetir salto.
 */
var NoMeCansoDeSaltar = (function (_super) {
    __extends(NoMeCansoDeSaltar, _super);
    function NoMeCansoDeSaltar() {
        _super.apply(this, arguments);
    }
    NoMeCansoDeSaltar.prototype.iniciar = function () {
        this.fondo = new Fondo('fondo.noMeCansoDeSaltar.png', 0, 0);
        this.automata = new GatoAnimado(0, -150);
        this.saltosFaltantes = 30;
    };
    NoMeCansoDeSaltar.prototype.s = function () {
        this.automata.hacer_luego(SaltarHablando, {});
    };
    NoMeCansoDeSaltar.prototype.fraseAlSaltar = function () {
        this.saltosFaltantes--;
        if (this.saltosFaltantes > 0)
            return "Faltan " + this.saltosFaltantes + " saltos";
        if (this.saltosFaltantes == 0)
            return "¡Ya salté todo lo necesario!";
        throw new ActividadError("¡Uy! Salté mucho... ¡Me pasé!");
    };
    return NoMeCansoDeSaltar;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
var PrendiendoLasCompus = (function (_super) {
    __extends(PrendiendoLasCompus, _super);
    function PrendiendoLasCompus() {
        _super.apply(this, arguments);
    }
    PrendiendoLasCompus.prototype.iniciar = function () {
        this.estado = undefined;
        this.cantidadMaxColumnas = 12;
        this.cantidadMinColumnas = 5;
        this.cantidadMaxFilas = 7;
        this.cantidadMinFilas = 4;
        this.cantidadFilas = Math.floor(Math.random() * this.cantidadMaxFilas + this.cantidadMinFilas);
        this.cantidadColumnas = Math.floor(Math.random() * this.cantidadMaxColumnas + this.cantidadMinColumnas);
        this.cuadricula = new Cuadricula(0, 0, this.cantidadFilas, this.cantidadColumnas, { alto: 300, ancho: 300 }, { grilla: 'casillas.violeta.png' });
        this.buzo = new Tito(0, 0);
        this.cuadricula.agregarActor(this.buzo, 0, 0);
        this.completarConCompusEnLaterales();
    };
    PrendiendoLasCompus.prototype.completarConCompusEnLaterales = function () {
        //Completo la primer y ultima fila
        for (var i = 1; i < this.cantidadColumnas - 1; ++i) {
            this.cuadricula.agregarActor(new CompuAnimada(0, 0), 0, i);
            this.cuadricula.agregarActor(new CompuAnimada(0, 0), this.cantidadFilas - 1, i);
        }
        //Completo la primer y ultima columna
        for (var i = 1; i < this.cantidadFilas - 1; ++i) {
            this.cuadricula.agregarActor(new CompuAnimada(0, 0), i, 0);
            this.cuadricula.agregarActor(new CompuAnimada(0, 0), i, this.cantidadColumnas - 1);
        }
    };
    PrendiendoLasCompus.prototype.personajePrincipal = function () {
        return this.buzo;
    };
    PrendiendoLasCompus.prototype.moverDerecha = function () {
        this.buzo.hacer_luego(MoverACasillaDerecha);
    };
    PrendiendoLasCompus.prototype.moverIzquierda = function () {
        this.buzo.hacer_luego(MoverACasillaIzquierda);
    };
    PrendiendoLasCompus.prototype.moverAbajo = function () {
        this.buzo.hacer_luego(MoverACasillaAbajo);
    };
    PrendiendoLasCompus.prototype.moverArriba = function () {
        this.buzo.hacer_luego(MoverACasillaArriba);
    };
    PrendiendoLasCompus.prototype.prenderCompu = function () {
        this.buzo.hacer_luego(EncenderPorEtiqueta, { 'etiqueta': 'CompuAnimada', 'mensajeError': 'Acá no hay una compu para prender' });
    };
    return PrendiendoLasCompus;
})(EscenaActividad);
/// <reference path = "../../dependencias/pilasweb.d.ts" />
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/MarcianoVerdeAnimado.ts" />
/// <reference path = "../actores/NaveAnimada.ts" />
/// <reference path = "../actores/CarbonAnimado.ts" />
/// <reference path = "../actores/HierroAnimado.ts" />
/// <reference path = "../actores/Tablero.ts" />
/// <reference path = "../actores/ObservadoAnimado.ts" />
/// <reference path = "../actores/ActorCompuesto.ts" />
/// <reference path = "EstadosDeEscena.ts" />
/// <reference path = "../comportamientos/ComportamientoColision.ts" />
/// <reference path = "../habilidades/Flotar.ts" />
var ReparandoLaNave = (function (_super) {
    __extends(ReparandoLaNave, _super);
    function ReparandoLaNave() {
        _super.apply(this, arguments);
    }
    ReparandoLaNave.prototype.iniciar = function () {
        this.fondo = new Fondo('fondos.reparandoLaNave.png', 0, 0);
        var cantidadFilas = 4;
        var cantidadColumnas = 5;
        this.cuadricula = new Cuadricula(0, 0, cantidadFilas, cantidadColumnas, { ancho: 323, alto: 261 }, { grilla: 'invisible.png',
            cantColumnas: 1 });
        this.crearActores(cantidadFilas, cantidadColumnas);
        this.crearTableros();
        this.crearEstado();
        this.crearEscape();
    };
    ReparandoLaNave.prototype.crearActores = function (cFilas, cColumnas) {
        this.crearAutomata(cFilas, cColumnas);
        this.nave = new NaveAnimada(0, 0);
        this.cuadricula.agregarActor(this.nave, cFilas - 1, 0);
        this.hierro = new HierroAnimado(0, 0);
        this.hierro.cantidad = 3;
        this.carbon = new CarbonAnimado(0, 0);
        this.carbon.cantidad = 3;
        this.cuadricula.agregarActor(this.hierro, 0, 0);
        this.hierro.aprender(Flotar, { Desvio: 2 });
        this.cuadricula.agregarActor(this.carbon, 0, cColumnas - 1);
        this.carbon.aprender(Flotar, { Desvio: 2 });
    };
    ReparandoLaNave.prototype.crearAutomata = function (cantidadFilas, cantidadColumnas) {
        this.automata = new ActorCompuesto(0, 0, { subactores: [new MarcianoVerdeAnimado(0, 0)] });
        this.cuadricula.agregarActorEnPerspectiva(this.automata, cantidadFilas - 1, 0, false);
        this.automata.escala = 0.75;
        this.automata.y += 50;
    };
    ReparandoLaNave.prototype.crearTableros = function () {
        Trait.toObject(ObservadoConDisminuir, this.carbon);
        Trait.toObject(ObservadoConDisminuir, this.hierro);
        this.hierro.registrarObservador(new Tablero(150, 220, { texto: "Hierro" }));
        this.carbon.registrarObservador(new Tablero(150, 190, { texto: "Carbon" }));
        this.carbon.changed();
        this.hierro.changed();
    };
    ReparandoLaNave.prototype.crearEstado = function () {
        var builder = new BuilderStatePattern('estoy00');
        this.definirTransiciones(builder);
        this.estado = builder.estadoInicial();
    };
    ReparandoLaNave.prototype.crearEscape = function () {
        var _this = this;
        this.secuenciaCaminata = new Secuencia({ 'secuencia': [new CaminaArriba({})] });
        this.secuenciaCaminata.iniciar(this.automata);
        this.condicion = function () { return _this.automata.y > pilas.arriba + 10; };
    };
    ReparandoLaNave.prototype.definirTransiciones = function (builder) {
        //modelo estoyCH como cantidad de carbon y de hierro ya depositados,
        //CestoyCH como tengo carbon en mano
        // y HestoyCH como tengo hierro en mano.
        //Estados donde no tengo nada en la mano.
        for (var hierro = 0; hierro <= 3; hierro++) {
            for (var carbon = 0; carbon <= 3; carbon++) {
                builder.agregarEstado(('estoy' + hierro) + carbon);
                builder.agregarEstado((('estoy' + hierro) + carbon) + 'carbon');
                builder.agregarEstado((('estoy' + hierro) + carbon) + 'hierro');
            }
        }
        //no unificar los fors, necesito tener creados los estados antes de las transi
        for (var hierro = 0; hierro <= 3; hierro++) {
            for (var carbon = 0; carbon <= 3; carbon++) {
                builder.agregarError('estoy' + hierro + carbon, 'depositar', 'No tengo nada en la mano');
                if (hierro != 3) {
                    builder.agregarTransicion((('estoy' + hierro) + carbon) + 'hierro', ('estoy' + (hierro + 1)) + carbon, 'depositar');
                    builder.agregarTransicion((('estoy' + hierro) + carbon), 'estoy' + (hierro) + carbon + 'hierro', 'tomarHierro');
                }
                if (carbon != 3) {
                    builder.agregarTransicion((('estoy' + hierro) + carbon) + 'carbon', ('estoy' + hierro) + (carbon + 1), 'depositar');
                    builder.agregarTransicion((('estoy' + hierro) + carbon), 'estoy' + (hierro) + carbon + 'carbon', 'tomarCarbon');
                }
            }
        }
    };
    ReparandoLaNave.prototype.tomarHierro = function () {
        this.automata.hacer_luego(TomarYContarPorEtiqueta, { 'etiqueta': 'HierroAnimado', 'mensajeError': 'No hay hierro aquí', 'dondeReflejarValor': this.hierro, 'idComportamiento': 'tomarHierro' });
    };
    ReparandoLaNave.prototype.tomarCarbon = function () {
        this.automata.hacer_luego(TomarYContarPorEtiqueta, { 'etiqueta': 'CarbonAnimado', 'mensajeError': 'No hay Carbon aquí', 'dondeReflejarValor': this.carbon, 'idComportamiento': 'tomarCarbon' });
    };
    ReparandoLaNave.prototype.depositar = function () {
        this.automata.hacer_luego(Depositar, { 'etiqueta': 'NaveAnimada', 'mensajeError': 'La nave no está aquí', 'idComportamiento': 'depositar' });
    };
    ReparandoLaNave.prototype.escapar = function () {
        this.automata.hacer_luego(RepetirHasta, { 'secuencia': this.secuenciaCaminata, 'condicion': this.condicion });
    };
    return ReparandoLaNave;
})(EscenaActividad);
var Depositar = (function (_super) {
    __extends(Depositar, _super);
    function Depositar() {
        _super.apply(this, arguments);
    }
    Depositar.prototype.metodo = function (objetoColision) {
        pilas.escena_actual().automata.eliminarUltimoSubactor();
    };
    return Depositar;
})(ComportamientoColision);
var TomarYContarPorEtiqueta = (function (_super) {
    __extends(TomarYContarPorEtiqueta, _super);
    function TomarYContarPorEtiqueta() {
        _super.apply(this, arguments);
    }
    //Si es el último del contador, elimina el objeto del cual recoge.
    TomarYContarPorEtiqueta.prototype.metodo = function (objetoColision) {
        var objetoAgarrado = objetoColision.clonar();
        objetoAgarrado.escala = objetoColision.escala;
        objetoAgarrado.y = this.receptor.y;
        objetoAgarrado.x = this.receptor.subactores[0].derecha - (this.receptor.subactores[0].ancho / 4);
        this.receptor.agregarSubactor(objetoAgarrado);
        objetoAgarrado.cargarAnimacion("correr"); // porque tiene que cargar la misma imagen que va a usar al moverse
        this.argumentos['dondeReflejarValor'].disminuir('cantidad', 1);
        if (this.argumentos['dondeReflejarValor']['cantidad'] == 0) {
            objetoColision.eliminar();
        }
    };
    return TomarYContarPorEtiqueta;
})(ComportamientoColision);
/*class SalvandoLaNavidad extends EscenaActividad {
  personaje;
  estado;
  cantidadColumnas;
  cuadricula;
  condicion;
  secuenciaCaminata;


  fondo;
  definidor;
  columnas;
iniciar() {
        this.estado=undefined;
        this.fondo = new Fondo('fondos.nubes.png',0,0);
        this.columnas=[5,6,8,4,7]
        this.definidor = new DefinidorColumnasFijo(5,this.columnas);
        this.cuadricula = new CuadriculaMultiple(this.definidor,{alto: 40, ancho:40*5})
        this.personaje = new PapaNoelAnimado(0,0);
        this.cuadricula.posicionarObjeto(this.personaje,0,0);
        this.completarConRegalos();



    }

  private completarConRegalos(){
    for(var i =0;i<5;i++){
    this.cuadricula.posicionarObjeto(new RegaloAnimado(0,0),i,this.columnas[i]-1);
    }

  }


  personajePrincipal(){
    return this.personaje;
  }


  avanzar(){
    this.personaje.hacer_luego(MoverACasillaDerecha);
  }
  siguienteFila(){

    this.personaje.hacer_luego(avanzarFilaEnCuadriculaMultipleDesdeCualquierLado,{'cuadriculaMultiple':this.cuadricula});
  }

  tomarRegalo(){
    this.personaje.hacer_luego(RecogerPorEtiqueta,{'etiqueta':'RegaloAnimado','mensajeError':'No hay un regalo aquí'});
  }

}
*/
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Tito.ts"/>
/// <reference path = "../actores/Lamparin.ts"/>
/// <reference path = "../actores/Cuadricula.ts"/>
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts"/>
/**
 * @class SuperTito1
 *
 */
var SuperTito1 = (function (_super) {
    __extends(SuperTito1, _super);
    function SuperTito1() {
        _super.apply(this, arguments);
    }
    SuperTito1.prototype.iniciar = function () {
        this.fondo = new Fondo(this.pathFondo(), 0, 0);
        this.cuadricula = new Cuadricula(0, 0, this.cantidadFilas(), 1, { separacionEntreCasillas: 5 }, { grilla: 'casilla.grisoscuro.png',
            cantColumnas: 1, ancho: 100, alto: 50 });
        this.cuadricula.casilla(this.cantidadFilas() - 1, 0).cambiarImagen('casilla.titoFinalizacion.png');
        for (var i = 0; i < this.cantidadFilas() - 1; i++) {
            this.agregarLamparinEnFila(i);
        }
        this.automata = new Tito(0, 0);
        this.cuadricula.agregarActor(this.automata, 0, 0);
        this.automata.escala *= 2;
        this.automata.y += 30;
        this.automata.x -= 15;
    };
    SuperTito1.prototype.cantidadFilas = function () {
        if (!this.cantFilas)
            this.cantFilas = Math.floor((Math.random() * 5) + 3);
        return this.cantFilas;
    };
    SuperTito1.prototype.agregarLamparinEnFila = function (i) {
        var lamparin = new Lamparin(0, 0);
        this.cuadricula.agregarActor(lamparin, i, 0);
        lamparin.x += 15;
    };
    SuperTito1.prototype.pathFondo = function () {
        return 'fondo.superTito1.png';
    };
    return SuperTito1;
})(EscenaActividad);
/// <reference path = "SuperTito1.ts" />
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/**
 * @class SuperTito2
 *
 */
var SuperTito2 = (function (_super) {
    __extends(SuperTito2, _super);
    function SuperTito2() {
        _super.apply(this, arguments);
    }
    SuperTito2.prototype.iniciar = function () {
        _super.prototype.iniciar.call(this);
        this.hayLuz = false;
    };
    SuperTito2.prototype.pathFondo = function () {
        return 'fondo.superTito2.png';
    };
    SuperTito2.prototype.agregarLamparinEnFila = function (i) {
        if (Math.random() < 0.5 || (i == this.cantidadFilas() - 2 && !this.hayLuz)) {
            _super.prototype.agregarLamparinEnFila.call(this, i);
            this.hayLuz = true;
        }
    };
    return SuperTito2;
})(SuperTito1);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Cuadricula.ts"/>
/// <reference path = "../actores/PerroCohete.ts"/>
/// <reference path = "../actores/Hueso.ts"/>
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts"/>
/**
 * @class SuperViaje
 *
 */
var SuperViaje = (function (_super) {
    __extends(SuperViaje, _super);
    function SuperViaje() {
        _super.apply(this, arguments);
        this.totalKM = 10;
    }
    SuperViaje.prototype.iniciar = function () {
        this.fondo = new Fondo('fondos.nubes.png', 0, 0);
        this.automata = new PerroCohete(0, 0);
        this.restantesKM = this.totalKM;
    };
    SuperViaje.prototype.volarUnKM = function () {
        if (this.restantesKM == 0) {
            this.automata.decir("¡Llegué!");
            return;
        }
        if (this.restantesKM == 1) {
            this.automata.decir("¡Faltan 1 kilometro!");
        }
        else {
            this.automata.decir("¡Faltan " + (this.restantesKM - 1) + " kilometros!");
        }
        this.restantesKM--;
    };
    SuperViaje.prototype.getKMFaltantes = function () {
        return this.totalKM;
    };
    SuperViaje.prototype.setKMFaltantes = function (valor) {
        this.totalKM = valor;
    };
    return SuperViaje;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/Tito.ts" />
/// <reference path = "../actores/Lamparin.ts" />
/// <reference path = "../actores/CuadriculaMultiple.ts" />
/// <reference path = "../comportamientos/ComportamientoColision.ts" />
var TitoCuadrado = (function (_super) {
    __extends(TitoCuadrado, _super);
    function TitoCuadrado() {
        _super.apply(this, arguments);
    }
    TitoCuadrado.prototype.iniciar = function () {
        this.estado = undefined;
        this.fondo = new Fondo('fondos.nubes.png', 0, 0);
        this.cantidadFilas = 7;
        this.cantidadColumnas = 7;
        var matriz = [
            ['T', 'T', 'T', 'T', 'T', 'T', 'T'],
            ['T', 'F', 'F', 'F', 'F', 'F', 'T'],
            ['T', 'F', 'F', 'F', 'F', 'F', 'T'],
            ['T', 'F', 'F', 'F', 'F', 'F', 'T'],
            ['T', 'F', 'F', 'F', 'F', 'F', 'T'],
            ['T', 'F', 'F', 'F', 'F', 'F', 'T'],
            ['T', 'T', 'T', 'T', 'T', 'T', 'T']
        ];
        this.cuadricula = new CuadriculaEsparsa(0, 0, { alto: 100 }, { grilla: 'casillas.violeta.png' }, matriz);
        this.personaje = new Tito(0, 0);
        this.cuadricula.agregarActor(this.personaje, 0, 0);
        this.agregarLuces();
    };
    TitoCuadrado.prototype.agregarLuces = function () {
        for (var i = 1; i < this.cantidadColumnas - 1; i++) {
            if (Math.random() < .5) {
                this.agregarLuz(0, i);
            }
            if (Math.random() < .5) {
                this.agregarLuz(this.cantidadFilas - 1, i);
            }
        }
        for (var j = 1; j < this.cantidadFilas - 1; j++) {
            if (Math.random() < .5) {
                this.agregarLuz(j, 0);
            }
            if (Math.random() < .5) {
                this.agregarLuz(j, this.cantidadColumnas - 1);
            }
        }
    };
    TitoCuadrado.prototype.agregarLuz = function (f, c) {
        this.cuadricula.agregarActor(new Lamparin(0, 0), f, c);
        //this.objetos.push(casillaLuminosa);
    };
    TitoCuadrado.prototype.moverArriba = function () {
        this.personaje.hacer_luego(MoverACasillaArriba);
    };
    TitoCuadrado.prototype.moverAbajo = function () {
        this.personaje.hacer_luego(MoverACasillaAbajo);
    };
    TitoCuadrado.prototype.moverDerecha = function () {
        this.personaje.hacer_luego(MoverACasillaDerecha);
    };
    TitoCuadrado.prototype.moverIzquierda = function () {
        this.personaje.hacer_luego(MoverACasillaIzquierda);
    };
    TitoCuadrado.prototype.prenderLuz = function () {
        this.personaje.hacer_luego(EncenderPorEtiqueta, { etiqueta: 'Luz' });
    };
    return TitoCuadrado;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/Tito.ts" />
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts"/>
/// <reference path = "../comportamientos/ComportamientoColision.ts" />
var TitoEnciendeLuces = (function (_super) {
    __extends(TitoEnciendeLuces, _super);
    function TitoEnciendeLuces() {
        _super.apply(this, arguments);
        this.objetos = [];
    }
    TitoEnciendeLuces.prototype.iniciar = function () {
        this.fondo = new Fondo('fondos.estrellas.png', 0, 0);
        //this.robot.izquierda = pilas.izquierda();
        this.cuadricula = new Cuadricula(0, 0, 5, 6, { separacionEntreCasillas: 5 }, { grilla: 'casilla.grisoscuro.png',
            cantColumnas: 1, alto: 50, ancho: 50 });
        //se cargan las luces
        var cant = 0;
        var fila = 3;
        var col = 0;
        while (cant < 4) {
            this.agregarLuz(fila, col);
            fila -= 1;
            col += 1;
            cant += 1;
        }
        cant = 0;
        fila = 4;
        col = 2;
        while (cant < 4) {
            this.agregarLuz(fila, col);
            fila -= 1;
            col += 1;
            cant += 1;
        }
        // se crea el automata
        this.automata = new Tito(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata, 4, 0);
        this.automata.escalarAAncho(this.cuadricula.anchoCasilla() * 1.1);
    };
    TitoEnciendeLuces.prototype.agregarLuz = function (fila, columna) {
        var casillaLuminosa = new Lamparin(0, 0);
        this.cuadricula.agregarActor(casillaLuminosa, fila, columna);
        this.objetos.push(casillaLuminosa);
    };
    TitoEnciendeLuces.prototype.prenderLuz = function () {
        this.automata.hacer_luego(EncenderPorEtiqueta, { etiqueta: 'Luz' });
    };
    TitoEnciendeLuces.prototype.irArriba = function () {
        this.automata.hacer_luego(MoverACasillaArriba);
    };
    TitoEnciendeLuces.prototype.irAbajo = function () {
        this.automata.hacer_luego(MoverACasillaAbajo);
    };
    TitoEnciendeLuces.prototype.irDerecha = function () {
        this.automata.hacer_luego(MoverACasillaDerecha);
    };
    TitoEnciendeLuces.prototype.irIzquierda = function () {
        this.automata.hacer_luego(MoverACasillaIzquierda);
    };
    return TitoEnciendeLuces;
})(EscenaActividad);
/// <reference path = "SuperTito2.ts" />
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts"/>
/// <reference path = "../comportamientos/ComportamientoColision.ts" />
/**
 * @class TitoRecargado
 *
 */
var TitoRecargado = (function (_super) {
    __extends(TitoRecargado, _super);
    function TitoRecargado() {
        _super.apply(this, arguments);
    }
    TitoRecargado.prototype.pathFondo = function () {
        return 'fondos.estrellas.png';
    };
    TitoRecargado.prototype.cantidadFilas = function () {
        return 7;
    };
    TitoRecargado.prototype.avanzar = function () {
        this.automata.hacer_luego(MoverACasillaDerecha);
    };
    TitoRecargado.prototype.prenderLuz = function () {
        this.automata.hacer_luego(EncenderPorEtiqueta, { etiqueta: 'Luz' });
    };
    return TitoRecargado;
})(SuperTito2);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Cuadricula.ts"/>
/// <reference path = "../actores/PerroCohete.ts"/>
/// <reference path = "../actores/Hueso.ts"/>
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts"/>
/**
 * @class TresHuesos
 *
 */
var TresNaranjas = (function (_super) {
    __extends(TresNaranjas, _super);
    function TresNaranjas() {
        _super.apply(this, arguments);
        this.objetos = [];
    }
    TresNaranjas.prototype.iniciar = function () {
        this.estado = undefined;
        this.fondo = new Fondo('fondos.nubes.png', 0, 0);
        this.cuadricula = new Cuadricula(0, 0, 1, 4, { alto: 70 }, { grilla: 'casillas.violeta.png' });
        //se cargan los huesos
        var hayAlMenosUno = false;
        for (var i = 0; i < 3; i++) {
            if (Math.random() < .5) {
                hayAlMenosUno = true;
                this.agregarHueso(i + 1);
            }
        }
        if (!hayAlMenosUno) {
            var columna = 1;
            var rand = Math.random();
            if (rand > 0.33 && rand < 0.66) {
                columna = 2;
            }
            else if (rand > 0.66) {
                columna = 3;
            }
            this.agregarHueso(columna);
        }
        // se crea el personaje
        this.automata = new PerroCohete(0, 0);
        this.cuadricula.agregarActor(this.automata, 0, 0);
    };
    TresNaranjas.prototype.agregarHueso = function (columna) {
        var objeto = new Hueso(0, 0);
        this.cuadricula.agregarActor(objeto, 0, columna);
        this.objetos.push(objeto);
    };
    TresNaranjas.prototype.comerHueso = function () {
        this.automata.hacer_luego(RecogerPorEtiqueta, { 'etiqueta': 'Hueso', 'mensajeError': 'No hay un hueso aqui' });
    };
    TresNaranjas.prototype.avanzar = function () {
        this.automata.hacer_luego(MoverACasillaDerecha);
    };
    return TresNaranjas;
})(EscenaActividad);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "HabilidadAnimada.ts"/>
/*Si los grados de aumento son positivos gira para la derecha
caso contrario gira para la izquierda*/
var Rotar = (function (_super) {
    __extends(Rotar, _super);
    function Rotar(receptor, argumentos) {
        _super.call(this, receptor);
        this.gradosDeAumentoStep = argumentos['gradosDeAumentoStep'] || 1;
    }
    Rotar.prototype.actualizar = function () {
        this.receptor.rotacion += this.gradosDeAumentoStep;
    };
    return Rotar;
})(HabilidadAnimada);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "HabilidadAnimada.ts"/>
var SerPateado = (function (_super) {
    __extends(SerPateado, _super);
    function SerPateado(receptor, argumentos) {
        _super.call(this, receptor);
        this.receptor.cargarAnimacion("patear");
        this.receptor.aprender(Rotar, { 'gradosDeAumentoStep': argumentos['gradosDeAumentoStep'] || 1 });
        this.actualizarPosicion();
        this.contador = Math.random() * 3;
        this.aceleracion = argumentos['aceleracion'];
        this.tiempoEnElAire = argumentos['tiempoEnElAire'] || 10;
        this.elevacionMaxima = argumentos['elevacionMaxima'] || 10;
    }
    SerPateado.prototype.actualizar = function () {
        //console.log(this.receptor.x)
        //console.log(this.receptor.y)
        this.patearConSubidaLineal();
    };
    SerPateado.prototype.patearConSubidaLineal = function () {
        this.contador += this.aceleracion;
        this.contador = this.contador % 256; // para evitar overflow
        if (this.receptor.y < this.altura_original + this.elevacionMaxima && this.tiempoEnElAire > 0) {
            //subiendo
            this.receptor.y += this.contador;
        }
        if (this.tiempoEnElAire > 0) {
            //en el aire
            this.tiempoEnElAire -= 1;
        }
        if (this.tiempoEnElAire <= 0) {
            //bajando
            if (this.receptor.y > this.altura_original) {
                this.receptor.y -= this.contador;
            }
        }
        this.receptor.x += this.contador;
    };
    SerPateado.prototype.patearParaAdelante = function () {
        this.contador += this.aceleracion;
        this.contador = this.contador % 256; // para evitar overflow
        this.receptor.x += this.contador;
    };
    SerPateado.prototype.implicaMovimiento = function () {
        return true;
    };
    SerPateado.prototype.actualizarPosicion = function () {
        this.altura_original = this.receptor.y;
    };
    return SerPateado;
})(HabilidadAnimada);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "HabilidadAnimada.ts"/>
/*Si los grados de aumento son positivos gira para la derecha
caso contrario gira para la izquierda*/
var Vibrar = (function (_super) {
    __extends(Vibrar, _super);
    function Vibrar(receptor, argumentos) {
        _super.call(this, receptor);
        this.gradosDeAumentoStep = argumentos['gradosDeAumentoStep'] || 1;
        this.tiempoVibracion = argumentos['tiempoVibracion'] || 2;
        this.izquierda = true;
        this.tiempoAEmplear = this.tiempoVibracion;
        this.enPause = true;
    }
    Vibrar.prototype.actualizar = function () {
        /*
              if(this.tiempoVibracion>0){
                this.tiempoVibracion--;
              }*/
        if (this.enPause) {
            this.tiempoAEmplear--;
            if (this.tiempoAEmplear < 0) {
                this.enPause = false;
                this.tiempoAEmplear = this.tiempoVibracion;
            }
        }
        else {
            if (this.izquierda) {
                this.receptor.rotacion += this.gradosDeAumentoStep;
                this.tiempoAEmplear--;
                if (this.tiempoAEmplear < 0) {
                    this.izquierda = false;
                    this.tiempoAEmplear = this.tiempoVibracion;
                }
            }
            else {
                this.receptor.rotacion -= this.gradosDeAumentoStep;
                this.tiempoAEmplear--;
                if (this.tiempoAEmplear < 0) {
                    this.izquierda = true;
                    this.tiempoAEmplear = this.tiempoVibracion;
                    this.enPause = true;
                }
            }
        }
    };
    return Vibrar;
})(HabilidadAnimada);
