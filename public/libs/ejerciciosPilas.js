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
    ActorAnimado.prototype.hayAbajo = function () {
        return this.cuadricula.hayAbajo(this.casillaActual());
    };
    ActorAnimado.prototype.hayArriba = function () {
        return this.cuadricula.hayArriba(this.casillaActual());
    };
    ActorAnimado.prototype.hayDerecha = function () {
        return this.cuadricula.hayDerecha(this.casillaActual());
    };
    ActorAnimado.prototype.hayIzquierda = function () {
        return this.cuadricula.hayIzquierda(this.casillaActual());
    };
    ActorAnimado.prototype.alFinalDelCamino = function () {
        return this.casillaActual() == this.cuadricula.casillas[this.cuadricula.casillas.length - 1];
    };
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
    ActorAnimado.prototype.ponerMaximaVelocidad = function () {
        for (var nombre in this._imagen.animaciones) {
            this._imagen.animaciones[nombre].velocidad = 60;
        }
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
    ActorAnimado.prototype.setCasillaActual = function (casillaNueva, moverseAhi) {
        if (moverseAhi === void 0) { moverseAhi = false; }
        if (this._casillaActual)
            this._casillaActual.eliminarActor(this);
        this._casillaActual = casillaNueva;
        casillaNueva.agregarActor(this);
        if (moverseAhi) {
            this.x = casillaNueva.x;
            this.y = casillaNueva.y;
        }
    };
    ActorAnimado.prototype.largoColumnaActual = function () {
        return this.cuadricula.largoColumna(this.casillaActual().nroColumna);
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
        actor.agregar_habilidad(ImitarAtributosNumericos2, {
            objeto_a_imitar: this,
            conVariacionEntera: ['x', 'y'],
            conVariacionPorcentual: ['escala_x', 'escala_y'],
            setters: { 'x': 'setX', 'y': 'setY' },
        });
    };
    ActorCompuesto.prototype.eliminarUltimoSubactor = function () {
        this.subactores.pop().eliminar();
    };
    ActorCompuesto.prototype.eliminarSubactor = function (etiqueta) {
        var elQueMuere = this.subactores.filter(function (actor) { return actor.tiene_etiqueta(etiqueta); })[0];
        elQueMuere.eliminar();
        this.subactores.splice(this.subactores.indexOf(elQueMuere), 1);
    };
    ActorCompuesto.prototype.cantSubactores = function () {
        return this.subactores.length;
    };
    ActorCompuesto.prototype.tieneAlgoEnLaMano = function () {
        return this.cantSubactores() >= 2;
    };
    ActorCompuesto.prototype.tieneEnLaMano = function (etiqueta) {
        return this.subactores.some(function (actor) { return actor.tiene_etiqueta(etiqueta); });
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
    ActorCompuesto.prototype.getAncho = function () {
        return this.subactores[0].getAncho();
    };
    ActorCompuesto.prototype.getAlto = function () {
        return this.subactores[0].getAlto();
    };
    return ActorCompuesto;
})(ActorAnimado);
var ImitarAtributosNumericos2 = (function (_super) {
    __extends(ImitarAtributosNumericos2, _super);
    function ImitarAtributosNumericos2() {
        _super.apply(this, arguments);
    }
    ImitarAtributosNumericos2.prototype.implicaMovimiento = function () {
        return false;
    };
    return ImitarAtributosNumericos2;
})(ImitarAtributosNumericos);
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
        _super.call(this, x, y, { grilla: 'alimento_pez.png', cantColumnas: 4, cantFilas: 1 });
        this.definirAnimacion("parado", new Cuadros(0).repetirRandom(30).concat([0, 1, 2, 3, 2, 1]), 12, true);
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
var Bruja = (function (_super) {
    __extends(Bruja, _super);
    function Bruja(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        _super.call(this, x, y, { grilla: 'bruja.png', cantColumnas: 16 });
        this.definirAnimacion("bailando", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], 6);
        this.definirAnimacion("parado", new Cuadros([0]).repetirVeces(30).concat([1, 5, 5, 5, 5, 1]), 6, true);
    }
    return Bruja;
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
        this.definirAnimacion("defender", new Cuadros([0, 1, 2, 2, 2, 2, 1, 0]).repetirVeces(3).concat([0, 0, 1, 1]).concat(new Cuadros(2).repetirVeces(999)), 6);
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
        this.definirAnimacion("parado", [2], 1);
    }
    return CarbonAnimado;
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
    Cuadricula.prototype.esFin = function (casilla) {
        return this.cantFilas == 1 && casilla.sos(0, this.cantColumnas - 1) ||
            this.cantColumnas == 1 && casilla.sos(this.cantFilas - 1, 0);
    };
    Cuadricula.prototype.esInicio = function (casilla) {
        return casilla.sos(0, 0);
    };
    Cuadricula.prototype.colisionan = function (objeto1, objeto2) {
        return objeto1.casillaActual() == objeto2.casillaActual();
    };
    return Cuadricula;
})(Actor);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "ActorAnimado.ts"/>
/// <reference path = "Cuadricula.ts"/>
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
        this.actores = [];
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
    Casilla.prototype.esEsquina = function () {
        return this.sos(0, 0) ||
            this.sos(0, this.cuadricula.cantColumnas - 1) ||
            this.sos(this.cuadricula.cantFilas - 1, 0) ||
            this.sos(this.cuadricula.cantFilas - 1, this.cuadricula.cantColumnas - 1);
    };
    Casilla.prototype.esFin = function () {
        return this.cuadricula.esFin(this);
    };
    Casilla.prototype.esInicio = function () {
        return this.cuadricula.esInicio(this);
    };
    // Este método sólo genera una referencia entre la casilla y el actor.
    // Si quiero generar la relación bidireccional no debo usar este, sino actor.setCasillaActual(c).
    Casilla.prototype.agregarActor = function (unActor) {
        this.actores.push(unActor);
    };
    Casilla.prototype.eliminarActor = function (unActor) {
        this.actores.splice(this.actores.indexOf(unActor), 1);
    };
    Casilla.prototype.tieneActorConEtiqueta = function (unaEtq) {
        return this.actores.some(function (actor) { return actor.tiene_etiqueta(unaEtq); });
    };
    Casilla.prototype.cambiarImagen = function (nombre, cantFilas, cantColumnas) {
        if (cantFilas === void 0) { cantFilas = 1; }
        if (cantColumnas === void 0) { cantColumnas = 1; }
        // PARCHEEEEE
        this.renacer(nombre, cantFilas, cantColumnas);
    };
    Casilla.prototype.renacer = function (nombreImagen, cantFilas, cantColumnas) {
        if (cantFilas === void 0) { cantFilas = 1; }
        if (cantColumnas === void 0) { cantColumnas = 1; }
        // POR FAVOR YO FUTURO PERDONAME
        this.eliminar();
        var opsCasilla = {
            grilla: this.cuadricula.opcionesCasilla.grilla,
            cantFilas: this.cuadricula.opcionesCasilla.cantFilas,
            cantColumnas: this.cuadricula.opcionesCasilla.cantColumnas,
        };
        this.cuadricula.opcionesCasilla.grilla = nombreImagen;
        this.cuadricula.opcionesCasilla.cantFilas = cantFilas;
        this.cuadricula.opcionesCasilla.cantColumnas = cantColumnas;
        var nuevoYo = new Casilla(this.nroFila, this.nroColumna, this.cuadricula);
        this.cuadricula.opcionesCasilla.grilla = opsCasilla.grilla;
        this.cuadricula.opcionesCasilla.cantFilas = opsCasilla.cantFilas;
        this.cuadricula.opcionesCasilla.cantColumnas = opsCasilla.cantColumnas;
        this.cuadricula.casillas[this.cuadricula.casillas.indexOf(this)] = nuevoYo;
    };
    return Casilla;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var CofreAnimado = (function (_super) {
    __extends(CofreAnimado, _super);
    function CofreAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'cofreAnimado.png', cantColumnas: 4 });
        this.definirAnimacion("abrir", new Cuadros([0, 1, 2]).repetirVeces(1).concat(new Cuadros(3).repetirVeces(999)), 3);
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
 *      postAnimacion(){
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
        this.sanitizarArgumentos();
        this.configurarVerificaciones();
        this.secuenciaActualizar = new Array();
        this.secuenciaActualizar.push(function () {
            this.configuracionInicial();
            this.preAnimacion();
            return true;
        }.bind(this));
        this.secuenciaActualizar.push(function () {
            return this.doActualizar();
        }.bind(this));
        this.secuenciaActualizar.push(function () {
            this.configuracionFinal();
            this.postAnimacion();
            return true;
        }.bind(this));
    };
    ComportamientoAnimado.prototype.sanitizarArgumentos = function () {
        this.receptor = this.argumentos.receptor || this.receptor;
        this.verificacionesPre = this.argumentos.verificacionesPre || [];
        this.verificacionesPost = this.argumentos.verificacionesPost || [];
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
        this.realizarVerificacionesPreAnimacion();
        this.receptor.detenerAnimacion(); // Porque hace quilombo
        this.animacionAnterior = this.receptor.nombreAnimacionActual();
        this.receptor.cargarAnimacion(this.nombreAnimacion());
    };
    ComportamientoAnimado.prototype.configuracionFinal = function () {
        this.receptor.animar();
        this.receptor.cargarAnimacion(this.nombreAnimacionSiguiente());
        this.realizarVerificacionesPostAnimacion();
    };
    ComportamientoAnimado.prototype.realizarVerificacionesPreAnimacion = function () {
        this.verificacionesPre.forEach(function (verificacion) { return verificacion.verificar(); });
        if (this.argumentos.idTransicion)
            pilas.escena_actual().estado.realizarTransicion(this.argumentos.idTransicion, this);
        pilas.escena_actual().estado.verificarQuePuedoSeguir();
    };
    ComportamientoAnimado.prototype.realizarVerificacionesPostAnimacion = function () {
        this.verificacionesPost.forEach(function (verificacion) { return verificacion.verificar(); });
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
    ComportamientoAnimado.prototype.configurarVerificaciones = function () {
        // son varios llamados a verificacionesPre.push
        // y a verificacionesPost.push
    };
    /* Redefinir si corresponde */
    ComportamientoAnimado.prototype.preAnimacion = function () {
    };
    /* Redefinir si corresponde */
    ComportamientoAnimado.prototype.postAnimacion = function () {
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
var Verificacion = (function () {
    function Verificacion(condicionEjecucion, mensajeError) {
        this.condicionEjecucion = condicionEjecucion;
        this.mensajeError = mensajeError;
    }
    Verificacion.prototype.seCumple = function () {
        return this.condicionEjecucion();
    };
    Verificacion.prototype.verificar = function () {
        if (!this.seCumple())
            throw new ActividadError(this.mensajeError);
    };
    return Verificacion;
})();
var ArgumentError = (function () {
    function ArgumentError(description) {
        this.name = "ArgumentError";
        this.message = description;
    }
    ArgumentError.prototype.toString = function () {
        return this.name + ': ' + this.message;
    };
    return ArgumentError;
})();
/// <reference path = "ComportamientoAnimado.ts"/>
/**
 * @class ComportamientoConVelocidad
 *
 * Argumentos:
 *    velocidad: Es un porcentaje. 100 significa lo más rápido. Debe ser 1 ó más.
 *               Representa la cantidad de ciclos que efectivamente se ejecutan.
 *    cantPasos: Mayor cantidad de pasos implica mayor "definicion" del movimiento.
 *               Tambien tarda mas en completarse. Jugar tambien con la velocidad.
 *               Como esto juega con la animacion, es preferible no tocarlo.
 */
var ComportamientoConVelocidad = (function (_super) {
    __extends(ComportamientoConVelocidad, _super);
    function ComportamientoConVelocidad() {
        _super.apply(this, arguments);
    }
    ComportamientoConVelocidad.prototype.preAnimacion = function () {
        _super.prototype.preAnimacion.call(this);
        this.argumentos.cantPasos = this.argumentos.cantPasos || 10;
        this.argumentos.velocidad = this.argumentos.velocidad || 20;
        this.vueltasSinEjecutar = 0;
        this.enQueVueltaEjecuto = Math.round(100 / this.velocidad());
        this.pasosRestantes = this.argumentos.cantPasos;
    };
    ComportamientoConVelocidad.prototype.velocidad = function () {
        return this.argumentos.velocidad;
    };
    ComportamientoConVelocidad.prototype.doActualizar = function () {
        var terminoAnimacion = _super.prototype.doActualizar.call(this);
        if (this.pasosRestantes <= 0) {
            this.setearEstadoFinalDeseado();
            return terminoAnimacion;
        }
        else if (this.deboEjecutar()) {
            this.darUnPaso();
            this.pasosRestantes -= 1;
        }
    };
    ComportamientoConVelocidad.prototype.deboEjecutar = function () {
        if (this.vueltasSinEjecutar + 1 == this.enQueVueltaEjecuto) {
            this.vueltasSinEjecutar = 0;
            return true;
        }
        else {
            this.vueltasSinEjecutar += 1;
            return false;
        }
    };
    ComportamientoConVelocidad.prototype.darUnPaso = function () {
        // Debe redefinirse. Es el comportamiento a realizar en cada tick.
    };
    ComportamientoConVelocidad.prototype.setearEstadoFinalDeseado = function () {
        // Debe redefinirse. Sirve para asegurar que al terminar los pasos se llegue al estado deseado
        // Por ejemplo, si me estoy moviendo a un lugar, setear ese lugar evita problemas de aproximación parcial.
    };
    return ComportamientoConVelocidad;
})(ComportamientoAnimado);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "ComportamientoConVelocidad.ts"/>
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
    MovimientoAnimado.prototype.preAnimacion = function () {
        _super.prototype.preAnimacion.call(this);
        this.sanitizarArgumentosMovAn();
        this.vectorDeAvance = this.valoresFinales.direccion.destinyFrom({ x: 0, y: 0 }, this.valoresFinales.distancia / this.valoresFinales.cantPasos);
        this.receptor.suspenderHabilidadesConMovimiento();
        this.voltearSiCorresponde();
    };
    MovimientoAnimado.prototype.postAnimacion = function () {
        this.receptor.activarHabilidadesConMovimiento();
    };
    MovimientoAnimado.prototype.darUnPaso = function () {
        this.receptor.x += this.vectorDeAvance.x;
        this.receptor.y += this.vectorDeAvance.y;
    };
    MovimientoAnimado.prototype.setearEstadoFinalDeseado = function () {
        this.receptor.x = this.valoresFinales.destino.x;
        this.receptor.y = this.valoresFinales.destino.y;
    };
    MovimientoAnimado.prototype.sanitizarArgumentosMovAn = function () {
        this.valoresFinales.distancia = this.argumentos.distancia === 0 ? 0 : this.argumentos.distancia || this.calcularDistancia();
        if (this.argumentos.direccion !== undefined && !(this.argumentos.direccion instanceof Direct))
            throw new ArgumentError("Direction should come as an instance of Direct");
        this.valoresFinales.direccion = this.argumentos.direccion || this.calcularDireccion();
        this.valoresFinales.destino = this.argumentos.destino || this.calcularDestino();
        this.valoresFinales.cantPasos = this.argumentos.cantPasos || 10;
        this.valoresFinales.velocidad = this.argumentos.velocidad || 20;
        this.valoresFinales.voltearAlIrAIzquierda = this.argumentos.voltearAlIrAIzquierda !== false;
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
})(ComportamientoConVelocidad);
var Direct = (function () {
    function Direct(origin, destiny) {
        if (destiny === void 0) { destiny = undefined; }
        if (destiny === undefined) {
            var angle = origin * Math.PI / 180;
            this.versor = { x: Math.cos(angle), y: Math.sin(angle) };
        }
        else if (!origin.x) {
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
        if (parent) {
            var mensaje = {
                tipo: "errorDeActividad",
                detalle: e.description()
            };
            parent.postMessage(mensaje, window.location.origin);
        }
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
    MovimientoEnCuadricula.prototype.preAnimacion = function () {
        this.cuadricula = this.receptor.cuadricula;
        this.direccionCasilla = this.direccionCasilla || new this.argumentos.claseDirCasilla();
        this.argumentos.direccion = new Direct(this.vectorDireccion().x, this.vectorDireccion().y);
        this.argumentos.distancia = this.distancia();
        _super.prototype.preAnimacion.call(this);
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
        return this.direccionCasilla.distancia(this);
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
        return this.direccionCasilla.proximaCasilla(casilla);
    };
    MovimientoEnCuadricula.prototype.textoAMostrar = function () {
        // Template Method. Para mostrar mensaje descriptivo al no poder avanzar
        return this.direccionCasilla.textoAMostrar();
    };
    MovimientoEnCuadricula.prototype.vectorDireccion = function () {
        return this.direccionCasilla.vectorDireccion;
    };
    return MovimientoEnCuadricula;
})(MovimientoAnimado);
var DirCasillaDerecha = (function () {
    function DirCasillaDerecha() {
        this.vectorDireccion = { x: 1, y: 0 };
    }
    DirCasillaDerecha.prototype.proximaCasilla = function (casilla) {
        return casilla.casillaASuDerecha();
    };
    DirCasillaDerecha.prototype.textoAMostrar = function () {
        return "la derecha";
    };
    DirCasillaDerecha.prototype.distancia = function (movimiento) {
        return movimiento.distanciaHorizontal();
    };
    return DirCasillaDerecha;
})();
var DirCasillaArriba = (function () {
    function DirCasillaArriba() {
        this.vectorDireccion = { x: 0, y: 1 };
    }
    DirCasillaArriba.prototype.proximaCasilla = function (casilla) {
        return casilla.casillaDeArriba();
    };
    DirCasillaArriba.prototype.textoAMostrar = function () {
        return "arriba";
    };
    DirCasillaArriba.prototype.distancia = function (movimiento) {
        return movimiento.distanciaVertical();
    };
    return DirCasillaArriba;
})();
var DirCasillaAbajo = (function () {
    function DirCasillaAbajo() {
        this.vectorDireccion = { x: 0, y: -1 };
    }
    DirCasillaAbajo.prototype.proximaCasilla = function (casilla) {
        return casilla.casillaDeAbajo();
    };
    DirCasillaAbajo.prototype.textoAMostrar = function () {
        return "abajo";
    };
    DirCasillaAbajo.prototype.distancia = function (movimiento) {
        return movimiento.distanciaVertical();
    };
    return DirCasillaAbajo;
})();
var DirCasillaIzquierda = (function () {
    function DirCasillaIzquierda() {
        this.vectorDireccion = { x: -1, y: 0 };
    }
    DirCasillaIzquierda.prototype.proximaCasilla = function (casilla) {
        return casilla.casillaASuIzquierda();
    };
    DirCasillaIzquierda.prototype.textoAMostrar = function () {
        return "la izquierda";
    };
    DirCasillaIzquierda.prototype.distancia = function (movimiento) {
        return movimiento.distanciaHorizontal();
    };
    return DirCasillaIzquierda;
})();
var MoverACasillaDerecha = (function (_super) {
    __extends(MoverACasillaDerecha, _super);
    function MoverACasillaDerecha() {
        _super.apply(this, arguments);
        this.direccionCasilla = new DirCasillaDerecha();
    }
    return MoverACasillaDerecha;
})(MovimientoEnCuadricula);
var MoverACasillaArriba = (function (_super) {
    __extends(MoverACasillaArriba, _super);
    function MoverACasillaArriba() {
        _super.apply(this, arguments);
        this.direccionCasilla = new DirCasillaArriba();
    }
    return MoverACasillaArriba;
})(MovimientoEnCuadricula);
var MoverACasillaAbajo = (function (_super) {
    __extends(MoverACasillaAbajo, _super);
    function MoverACasillaAbajo() {
        _super.apply(this, arguments);
        this.direccionCasilla = new DirCasillaAbajo();
    }
    return MoverACasillaAbajo;
})(MovimientoEnCuadricula);
var MoverACasillaIzquierda = (function (_super) {
    __extends(MoverACasillaIzquierda, _super);
    function MoverACasillaIzquierda() {
        _super.apply(this, arguments);
        this.direccionCasilla = new DirCasillaIzquierda();
    }
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
var SiguienteFila = (function (_super) {
    __extends(SiguienteFila, _super);
    function SiguienteFila() {
        _super.apply(this, arguments);
    }
    SiguienteFila.prototype.configurarVerificaciones = function () {
        var _this = this;
        _super.prototype.configurarVerificaciones.call(this);
        this.verificacionesPre.push(new Verificacion(function () { return _this.receptor.casillaActual().esInicio(); }, "No puedo ir desde acá, tengo que estar al inicio de la fila"));
    };
    return SiguienteFila;
})(MoverACasillaAbajo);
var SiguienteColumna = (function (_super) {
    __extends(SiguienteColumna, _super);
    function SiguienteColumna() {
        _super.apply(this, arguments);
    }
    SiguienteColumna.prototype.configurarVerificaciones = function () {
        var _this = this;
        _super.prototype.configurarVerificaciones.call(this);
        this.verificacionesPre.push(new Verificacion(function () { return _this.receptor.casillaActual().esInicio(); }, "No puedo ir desde acá, tengo que estar al inicio de la columna"));
    };
    return SiguienteColumna;
})(MoverACasillaDerecha);
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
            argumentos = argumentos || {};
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
/// <reference path = "../actores/CuadriculaEsparsa.ts"/>
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
    CuadriculaMultipleColumnas.prototype.esFin = function (casilla) {
        return this.esLaUltima(casilla.nroFila, casilla.nroColumna);
    };
    CuadriculaMultipleColumnas.prototype.esInicio = function (casilla) {
        return casilla.nroFila === 0;
    };
    CuadriculaMultipleColumnas.prototype.largoColumna = function (indice) {
        return this.pmatrix.filter(function (fila) { return fila[indice] === 'T'; }).length;
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
    CuadriculaMultiple.prototype.esFin = function (casilla) {
        return this.dameIndexUltimaPosicion(casilla.nroFila) === casilla.nroColumna;
    };
    CuadriculaMultiple.prototype.esInicio = function (casilla) {
        return casilla.nroColumna === 0;
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
var Detective = (function (_super) {
    __extends(Detective, _super);
    function Detective(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        _super.call(this, x, y, { grilla: 'detective.png', cantColumnas: 1 });
        this.definirAnimacion("parado", [0], 4, true);
    }
    Detective.prototype.obtenerActorBajoLaLupa = function () {
        var _this = this;
        return pilas.obtener_actores_con_etiqueta("Sospechoso").filter(function (s) { return s.colisiona_con(_this); })[0];
    };
    Detective.prototype.colisionaConElCulpable = function () {
        var sospechoso = this.obtenerActorBajoLaLupa();
        if (sospechoso.tieneDisflazPuesto) {
            throw new ActividadError("No puedo saber si es el culpable, no lo he interrogado antes.");
            return false;
        }
        return sospechoso.esCulpable();
    };
    return Detective;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var Dibujante = (function (_super) {
    __extends(Dibujante, _super);
    function Dibujante(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        _super.call(this, x, y, { grilla: 'dibujante.png', cantColumnas: 5 });
        this.definirAnimacion("parado", new Cuadros([0, 1, 2, 1]).repetirVeces(4).concat(new Cuadros([0]).repetirVeces(40)), 4, true);
        this.definirAnimacion("correr", [3, 4, 4, 4, 4, 4], 6);
        this.definirAnimacion("rotar", [3], 6);
    }
    return Dibujante;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var Dracula = (function (_super) {
    __extends(Dracula, _super);
    function Dracula(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        _super.call(this, x, y, { grilla: 'dracula.png', cantColumnas: 15 });
        this.definirAnimacion("bailando", [9, 10, 11, 12, 13, 14, 13, 12, 11, 10], 6);
        this.definirAnimacion("parado", [0], 12, true);
        this.definirAnimacion("aparecer", [0, 1, 2, 3, 4, 5, 6, 7, 8], 6);
    }
    return Dracula;
})(ActorAnimado);
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
/*Implementa un tablero, que tiene "nombre de equipo" y "puntaje"*/
/*Notar que aumentar puede tomar valores negativos o positivos*/
/* Para usarlo, hay que construirlo y setearle un observado
ver clase "observado" */
var Tablero = (function (_super) {
    __extends(Tablero, _super);
    function Tablero(x, y, argumentos) {
        this.sanitizarArgumentosTablero(argumentos);
        _super.call(this, x, y, { grilla: argumentos.imagen, cantColumnas: 1, cantFilas: 1 });
        this.buildLabel(argumentos);
        this.buildPuntaje(argumentos);
        this.updateWidth();
        this.updateHeight();
    }
    // label | separacion | puntaje     (el margen es igual tanto para el label como para el puntaje)
    Tablero.prototype.sanitizarArgumentosTablero = function (args) {
        args.imagen = args.imagen || 'invisible.png';
        args.imagenLabel = args.imagenLabel || "PlacaContarGris.png";
        args.imagenPuntaje = args.imagenPuntaje || "PlacaContarNegra.png";
        this.atributoObservado = args.atributoObservado || 'cantidad';
        this.colorTxtLabel = args.colorTxtLabel || "black";
        this.colorTxtPuntaje = args.colorTxtPuntaje || "white";
        this.separacionX = args.separacionX || 0;
        this.separacionY = args.separacionY || 0;
        this.margen = args.margen || 6;
    };
    Tablero.prototype.buildLabel = function (argumentos) {
        this.label = new Texto(0, this.y, argumentos.texto, { color: this.colorTxtLabel,
            imagenFondo: argumentos.imagenLabel,
            margen: this.margen,
        });
        this.label.setZ(this.z - 1);
    };
    Tablero.prototype.buildPuntaje = function (argumentos) {
        this.puntaje = new Puntaje(0, this.label.y + this.separacionY, argumentos.valorInicial || 0, { color: this.colorTxtPuntaje,
            imagenFondo: argumentos.imagenPuntaje,
            margen: this.margen,
        });
        this.puntaje.setZ(this.z - 2);
    };
    // label | separacion | puntaje   (cada uno tiene su margen)
    Tablero.prototype.updateWidth = function () {
        this.ancho = this.puntaje.ancho + this.separacionX + this.label.ancho;
        this.label.izquierda = this.izquierda;
        this.puntaje.izquierda = this.label.derecha + this.separacionX;
    };
    Tablero.prototype.updateHeight = function () {
        this.alto = this.separacionY + this.label.alto;
        this.label.arriba = this.arriba;
        this.puntaje.arriba = this.label.arriba;
    };
    Tablero.prototype.dameValor = function () {
        return this.puntaje.obtener();
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
        this.setearValor(this.leerObservado(observado));
        this.updateWidth();
    };
    Tablero.prototype.leerObservado = function (observado) {
        if (typeof (observado[this.atributoObservado]) === "function") {
            return observado[this.atributoObservado]();
        }
        return observado[this.atributoObservado];
    };
    Tablero.prototype.setX = function (x) {
        _super.prototype.setX.call(this, x);
        this.updateWidth();
    };
    Tablero.prototype.setY = function (y) {
        _super.prototype.setY.call(this, y);
        this.updateHeight();
    };
    return Tablero;
})(ActorAnimado);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "HabilidadAnimada.ts"/>
var Flotar = (function (_super) {
    __extends(Flotar, _super);
    function Flotar(receptor, argumentos) {
        _super.call(this, receptor);
        this.contador = Math.random() * 3;
        this.desvio = argumentos["Desvio"] || 1;
        this.eje = argumentos.eje || 'Y';
        this.actualizarPosicion();
    }
    Flotar.prototype.actualizar = function () {
        this.contador += 0.025;
        this.contador = this.contador % 256;
        //Esto es para evitar overflow.
        this.receptor['set' + this.eje](this.altura_original + Math.sin(this.contador) * this.desvio);
    };
    Flotar.prototype.implicaMovimiento = function () {
        return true;
    };
    Flotar.prototype.actualizarPosicion = function () {
        this.altura_original = this.receptor['get' + this.eje]();
    };
    return Flotar;
})(HabilidadAnimada);
/// <reference path="Tablero.ts"/>
/// <reference path="../habilidades/Flotar.ts"/>
var FlechaEscenarioAleatorio = (function (_super) {
    __extends(FlechaEscenarioAleatorio, _super);
    function FlechaEscenarioAleatorio() {
        _super.call(this, 120, 220, { imagen: 'flechaEscenarioAleatorio.png',
            texto: "¡Ejecutá varias veces!",
            separacionX: 0,
            imagenLabel: "invisible.png",
        });
        this.aprender(Flotar, { eje: 'X', Desvio: 20 });
        this.setAlto(40);
    }
    FlechaEscenarioAleatorio.prototype.buildPuntaje = function (argumentos) {
        this.puntaje = { ancho: 0 };
    };
    return FlechaEscenarioAleatorio;
})(Tablero);
/// <reference path="ActorAnimado.ts"/>
var Foco = (function (_super) {
    __extends(Foco, _super);
    function Foco(x, y) {
        var _this = this;
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        _super.call(this, x, y, { grilla: 'focos.color.png', cantColumnas: 13 });
        this.colores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        this.colores.forEach(function (nro) {
            return _this.definirAnimacion("color" + nro, [nro], 1);
        });
        this.cargarAnimacion("color0");
    }
    Foco.prototype.cambiarColor = function () {
        this.cargarAnimacion("color" + this.siguienteNumero());
    };
    Foco.prototype.siguienteNumero = function () {
        var sgte = parseInt(this.nombreAnimacionActual().slice(5)) + 1;
        return sgte > 12 ? 0 : sgte;
    };
    return Foco;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var FogataAnimada = (function (_super) {
    __extends(FogataAnimada, _super);
    function FogataAnimada(x, y) {
        _super.call(this, x, y, { grilla: 'actor.Fogata.png', cantColumnas: 3, cantFilas: 1 });
        this.definirAnimacion("parado", [0], 5);
        this.definirAnimacion("prendida", [1, 2], 5);
    }
    return FogataAnimada;
})(ActorAnimado);
/// <reference path = "ActorCompuesto.ts"/>
var FondoAnimado = (function (_super) {
    __extends(FondoAnimado, _super);
    function FondoAnimado(nombre, x, y) {
        _super.call(this, x, y, { subactores: [new ActorAnimado(x, y, { grilla: nombre })] });
    }
    return FondoAnimado;
})(ActorCompuesto);
/// <reference path="ActorAnimado.ts"/>
var Frank = (function (_super) {
    __extends(Frank, _super);
    function Frank(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        _super.call(this, x, y, { grilla: 'frank.png', cantColumnas: 10 });
        this.definirAnimacion("bailando", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1], 6);
        this.definirAnimacion("parado", new Cuadros([0]).repetirVeces(20).concat([1, 2, 2, 1]), 6, true);
    }
    return Frank;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var GatoAnimado = (function (_super) {
    __extends(GatoAnimado, _super);
    function GatoAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'gatoAnimado.png', cantColumnas: 7, cantFilas: 7 });
        this.definirAnimacion('parado', new Cuadros([0, 1, 2, 3, 2, 1]).repetirVeces(9).concat([8, 9, 10, 11, 12, 12, 12, 12, 12, 12, 11, 10, 9, 8]), 4, true);
        this.definirAnimacion('saltar', [43, 44, 45, 46, 46, 45, 44, 43], 5);
        this.definirAnimacion('saludando', [15, 16, 16, 17, 18, 19, 19, 18, 17, 16, 16, 16, 16, 17, 18, 19, 19, 16, 15], 5);
        this.definirAnimacion('acostado', [8, 9, 10, 11, 12, 11, 10, 9, 8], 5);
        this.definirAnimacion('abrirOjos', [39, 38, 37, 36], 5);
        this.definirAnimacion('ojosCerrados', [39], 5);
        this.definirAnimacion('cerrarOjos', [36, 37, 38, 39], 5);
        this.definirAnimacion('correr', [22, 23, 24, 25, 26], 6);
    }
    return GatoAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var GloboAnimado = (function (_super) {
    __extends(GloboAnimado, _super);
    function GloboAnimado(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        _super.call(this, x, y, { grilla: 'globoAnimado.png', cantColumnas: 3, cantFilas: 1 });
        this.definirAnimacion("explotar", [0, 0, 0, 1, 2, 2], 6);
    }
    return GloboAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var HeroeAnimado = (function (_super) {
    __extends(HeroeAnimado, _super);
    function HeroeAnimado(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        _super.call(this, x, y, { grilla: this.nombreArchivo(), cantColumnas: 6, cantFilas: 5 });
        this.definirAnimacion("correr", [0, 1, 2, 3, 4, 5], 6);
        this.definirAnimacion("parado", [0], 6, true);
        this.definirAnimacion("correrConEspada", [6, 7, 8, 9, 10, 11], 12);
        this.definirAnimacion("correrConSombrero", [12, 13, 14, 15, 16, 17], 12);
        this.definirAnimacion("atacar", new Cuadros([24, 25, 26, 27, 28, 29]).repetirVeces(3), 6);
    }
    HeroeAnimado.prototype.nombreArchivo = function () {
        return 'heroe.png';
    };
    return HeroeAnimado;
})(ActorAnimado);
var Heroina = (function (_super) {
    __extends(Heroina, _super);
    function Heroina() {
        _super.apply(this, arguments);
    }
    Heroina.prototype.nombreArchivo = function () {
        return 'heroina.png';
    };
    return Heroina;
})(HeroeAnimado);
/// <reference path="ActorAnimado.ts"/>
var HierroAnimado = (function (_super) {
    __extends(HierroAnimado, _super);
    function HierroAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'hierro_animado.png', cantColumnas: 3, cantFilas: 1 });
        this.definirAnimacion("quedan3", [0], 1);
        this.definirAnimacion("quedan2", [1], 1);
        this.definirAnimacion("quedan1", [2], 1);
        this.definirAnimacion("correr", [2], 1);
        this.definirAnimacion("parado", [2], 1);
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
        _super.call(this, x, y, { grilla: 'instalador.png', cantColumnas: 9, cantFilas: 1 });
        this.definirAnimacion("parado", [0], 1, true);
        this.definirAnimacion("correr", [1, 2, 3], 5);
        this.definirAnimacion("escribir", [3, 4, 5, 6, 7, 8, 7, 8, 7, 8, 7, 8], 9);
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
        this.definirAnimacion("parado", new Cuadros(1).repetirVeces(16).concat([2, 2, 2, 2, 2]), 2, true);
        this.definirAnimacion("darEspada", new Cuadros([1, 3, 4, 5, 5, 6, 6, 7, 7]).repetirVeces(1).concat(new Cuadros(0).repetirVeces(999)), 6);
        this.definirAnimacion("paradoConSombrero", [0], 12);
    }
    return MagoAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var ManzanaAnimada = (function (_super) {
    __extends(ManzanaAnimada, _super);
    function ManzanaAnimada(x, y, conSombra) {
        if (conSombra === void 0) { conSombra = true; }
        _super.call(this, x, y, { grilla: conSombra ? 'manzanaConSombra.png' : 'manzanaSinSombra.png', cantColumnas: 1, cantFilas: 1 });
    }
    return ManzanaAnimada;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var MarcianoAnimado = (function (_super) {
    __extends(MarcianoAnimado, _super);
    function MarcianoAnimado(x, y) {
        _super.call(this, x, y, this.opcionesImagen());
        this.definirAnimacion("correr", [7, 8, 9, 10, 11], 12);
        this.definirAnimacion("parado", [0, 1, 2, 3, 4, 5], 5, true);
        this.definirAnimacion("recoger", [11, 12, 12, 11], 5);
        this.definirAnimacion("recogerHierro", [11, 12, 12, 11, 13, 13, 13], 5);
        this.definirAnimacion("recogerCarbon", [11, 12, 12, 11, 14, 14, 14], 5);
        this.definirAnimacion("comerManzana", [11, 12, 12, 11, 15, 15, 15], 5);
        this.definirAnimacion("comerNaranja", [11, 12, 12, 11, 16, 16, 16], 5);
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
        _super.call(this, x, y, { grilla: 'monoAnimado.png', cantColumnas: 19, cantFilas: 1 });
        this.definirAnimacion("correr", [0, 1, 2, 3, 4, 5, 6, 7], 12);
        this.definirAnimacion("parado", new Cuadros(0).repetirVeces(50).concat([0, 1, 2, 3, 4]).concat(new Cuadros(4).repetirVeces(30)).concat([4, 3, 2, 1, 0]), 6, true);
        this.definirAnimacion("comerBanana", [8, 9, 10, 11, 12], 6);
        this.definirAnimacion("comerManzana", [13, 14, 15, 16, 17], 6);
    }
    return MonoAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var Murcielago = (function (_super) {
    __extends(Murcielago, _super);
    function Murcielago(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        _super.call(this, x, y, { grilla: 'murcielago.png', cantColumnas: 4 });
        this.definirAnimacion("parado", [0, 1, 2, 3, 2, 1], 12, true);
    }
    return Murcielago;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var NanoAnimado = (function (_super) {
    __extends(NanoAnimado, _super);
    function NanoAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'nano.png', cantColumnas: 14 });
        this.definirAnimacion('parado', new Cuadros([0]).repetirVeces(30).
            concat([1, 1, 2, 2]).
            concat(new Cuadros([2]).repetirVeces(15)).
            concat([2, 2, 1, 1]), 6, true);
        this.definirAnimacion('correr', [3, 4, 5, 6, 7, 8, 9, 10], 9);
        this.definirAnimacion('recoger', [12, 13, 14, 15, 15, 15, 15, 14, 13, 12], 6);
    }
    return NanoAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var NaranjaAnimada = (function (_super) {
    __extends(NaranjaAnimada, _super);
    function NaranjaAnimada(x, y) {
        _super.call(this, x, y, { grilla: 'naranja.png', cantColumnas: 1, cantFilas: 1 });
        this.definirAnimacion("comerse", [0], 6);
        this.definirAnimacion("mordida", [0], 1);
    }
    return NaranjaAnimada;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var NaveAnimada = (function (_super) {
    __extends(NaveAnimada, _super);
    function NaveAnimada(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        _super.call(this, x, y, { grilla: 'naveAnimada.png', cantColumnas: 4, cantFilas: 1 });
        this.definirAnimacion("parado", new Cuadros(0).repetirVeces(30).concat([1]), 4, true);
        this.definirAnimacion("correr", new Cuadros([0, 1, 2]).repetirVeces(1).concat(new Cuadros(3).repetirVeces(100)), 6);
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
        _super.call(this, x, y, { grilla: 'papaNoel.png', cantColumnas: 12 });
        this.definirAnimacion('correr', [4, 5, 6, 7, 6, 5, 4], 6);
        this.definirAnimacion('parado', new Cuadros([0]).repetirVeces(40).
            concat(new Cuadros([2, 3, 2, 1]).repetirVeces(3)), 6, true);
        this.definirAnimacion('recoger', [8, 9, 10, 11], 6);
        this.definirAnimacion('depositar', [11, 10, 9, 8], 6);
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
var Princesa = (function (_super) {
    __extends(Princesa, _super);
    function Princesa(x, y) {
        _super.call(this, x, y, { grilla: this.nombreArchivo(), cantColumnas: 2 });
        this.definirAnimacion("parado", new Cuadros(1).repetirVeces(20).concat([0, 0, 0, 0]), 2, true);
        this.definirAnimacion("correr", [0], 6);
    }
    Princesa.prototype.nombreArchivo = function () {
        return 'princesa.png';
    };
    return Princesa;
})(ActorAnimado);
var Principe = (function (_super) {
    __extends(Principe, _super);
    function Principe() {
        _super.apply(this, arguments);
    }
    Principe.prototype.nombreArchivo = function () {
        return 'principe.png';
    };
    return Principe;
})(Princesa);
/// <reference path="ActorAnimado.ts"/>
var RatonAnimado = (function (_super) {
    __extends(RatonAnimado, _super);
    function RatonAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'raton.png', cantColumnas: 9, cantFilas: 1 });
        this.definirAnimacion("parado", new Cuadros(0).repetirVeces(10).concat([1]), 1, true);
        this.definirAnimacion("correr", [2, 3, 4, 3, 4, 3, 4], 6);
        this.definirAnimacion("recoger", [5, 6, 7, 8], 12);
    }
    return RatonAnimado;
})(ActorAnimado);
var QuesoAnimado = (function (_super) {
    __extends(QuesoAnimado, _super);
    function QuesoAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'queso.png', cantColumnas: 1, cantFilas: 1 });
        this.definirAnimacion("parado", [0], 15, true);
        this.definirAnimacion("correr", [0], 15);
        this.definirAnimacion("recoger", [0], 15);
    }
    return QuesoAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var RecolectorEstrellas = (function (_super) {
    __extends(RecolectorEstrellas, _super);
    function RecolectorEstrellas(x, y) {
        _super.call(this, x, y, { grilla: 'recolectorAnimado.png', cantColumnas: 5, cantFilas: 1 });
        this.definirAnimacion("parado", [0], 2);
        this.definirAnimacion("correr", [0, 1, 2, 3, 3, 3, 4, 0], 9);
        this.definirAnimacion("recoger", [4, 3, 3, 3, 3, 3, 3, 4], 9);
    }
    return RecolectorEstrellas;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var RegaloAnimado = (function (_super) {
    __extends(RegaloAnimado, _super);
    function RegaloAnimado(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        _super.call(this, x, y, { grilla: 'regalo.png', cantColumnas: 1, cantFilas: 1 });
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
        _super.call(this, x, y, { grilla: 'sandia.png', cantColumnas: 5, cantFilas: 1 });
        this.definirAnimacion("comerse", [0, 1, 2, 3, 4], 6);
        this.definirAnimacion("mordida", [4], 1);
    }
    return SandiaAnimada;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var ScoutAnimado = (function (_super) {
    __extends(ScoutAnimado, _super);
    function ScoutAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'actor.BoyScout.png', cantColumnas: 9, cantFilas: 1 });
        this.definirAnimacion("parado", [0], 1, true);
        this.definirAnimacion("correr", [1, 2, 3], 5);
        this.definirAnimacion("prender", [3, 4, 5, 6, 7, 8, 7, 8, 7, 8, 7, 8], 9);
    }
    return ScoutAnimado;
})(ActorAnimado);
/// <reference path = "../../dependencias/pilasweb.d.ts" />
/// <reference path = "ComportamientoAnimado.ts" />
var Decir = (function (_super) {
    __extends(Decir, _super);
    function Decir() {
        _super.apply(this, arguments);
    }
    /* Redefinir si corresponde */
    Decir.prototype.preAnimacion = function () {
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
/// <reference path="ActorAnimado.ts"/>
/// <reference path="../comportamientos/Decir.ts"/>
var Sospechoso = (function (_super) {
    __extends(Sospechoso, _super);
    function Sospechoso(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        _super.call(this, x, y, { grilla: 'sospechosos.png', cantColumnas: 8 });
        this.definirAnimacion("parado", [this.nroDisfraz()], 4, true);
        this.definirAnimacion("culpable", [7], 4);
        this.tieneDisflazPuesto = true;
    }
    Sospechoso.reiniciarDisfraces = function () {
        this.disfracesUsados = [];
    };
    Sospechoso.prototype.nroDisfraz = function () {
        var disfraz = this.disfracesDisponibles()[Math.floor(Math.random() * this.disfracesDisponibles().length)];
        Sospechoso.disfracesUsados.push(disfraz);
        return disfraz;
    };
    Sospechoso.prototype.disfracesDisponibles = function () {
        var disponibles = [0, 1, 2, 3, 4, 5, 6];
        Sospechoso.disfracesUsados.forEach(function (nro) { return disponibles.splice(disponibles.indexOf(nro), 1); });
        return disponibles;
    };
    Sospechoso.prototype.hacerCulpable = function () {
        this.meaCulpa = true;
    };
    Sospechoso.prototype.esCulpable = function () {
        return this.meaCulpa;
    };
    Sospechoso.prototype.sacarDisfraz = function () {
        if (this.meaCulpa) {
            this.cargarAnimacion("culpable");
        }
        this.tieneDisflazPuesto = false; // TODO: podríamos emitir un error si se le quita el disfraz más de una vez.
    };
    Sospechoso.prototype.mensajeAlSacarDisfraz = function () {
        return this.meaCulpa ? "¡Me rindo!" : "¡No estoy disfrazado, éste soy yo!";
    };
    Sospechoso.prototype.teEncontraron = function () {
        return this.nombreAnimacionActual() === "culpable";
    };
    return Sospechoso;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var Superheroe = (function (_super) {
    __extends(Superheroe, _super);
    function Superheroe(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        _super.call(this, x, y, { grilla: 'superheroe.png', cantColumnas: 7 });
        this.definirAnimacion('parado', new Cuadros([0]).repetirVeces(10).concat([1, 0, 1, 0]), 6, true);
        this.definirAnimacion('correr', [2, 3, 4, 5, 4, 5, 4, 5, 4, 3, 2, 6, 6], 15);
    }
    return Superheroe;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var Tito = (function (_super) {
    __extends(Tito, _super);
    function Tito(x, y) {
        _super.call(this, x, y, { grilla: 'tito.png', cantColumnas: 8, cantFilas: 1 });
        this.definirAnimacion("correr", [3, 4, 5, 6, 6, 6, 6, 6, 6, 5, 4, 8], 12);
        this.definirAnimacion("parado", [0, 1, 2, 2, 3, 4], 6, true);
        this.definirAnimacion("bailando", [0, 1, 2, 2, 3, 4], 6);
        this.definirAnimacion("recoger", [0, 1, 2, 2, 2, 2, 2, 2, 3, 4], 9);
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
        this.estado = new Estado();
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
    EscenaActividad.prototype.contarActoresConEtiqueta = function (etiqueta) {
        return this.actores.filter(function (actor) { return actor.tiene_etiqueta(etiqueta); }).length;
    };
    return EscenaActividad;
})(Base);
/// <reference path = "EscenaActividad.ts" />
/**

Qué son las FSM - Version clásica

FSM significa máquina de estados finitos. Se las usa para modelar sistemas reactivos y concurrentes,
fundamentalmente porque tienen definido el operador de composición (A||B) que
modela la ejecución concurrente de A y B.

En su versión clásica, es un conjunto de estados con transiciones etiquetadas. Hay un único estado
inicial y uno o más finales. La máquina va cambiando de estado a partir de las transiciones y, en
el caso de querer transicionar por una etiqueta no definida, salta a un estado “trampa” de error,
que se asume implícito en toda máquina.

Para qué usamos las FSM
Tienen tres objetivos en el contexto de Pilas-Bloques:
1. Modelar las restricciones de precedencia en las acciones de la escena.
Por ejemplo, en la escena “La gran aventura del mar encantado” (mirarla), donde
el orden es: llave, cofre, mago, caballero y unicornio, podemos definirlo en
términos de transiciones y “de regalo” sabemos que cualquier otra combinación es errónea.

2. Definir errores ad-hoc, más declarativos para el estudiante respecto de lo
que hizo mal. En LGADME, podemos definir errores específicos, por ejemplo, si no
busco la llave “debés buscar la llave primero”. En el caso de que no se defina nada,
hay un error por default definido.

3. Definir fácilmente el estado “ganador” de la escena: como toda la lógica de la escena
está definida en términos de la máquina, basta con marcar aquellos estados que son
ganadores como “finales”.

Cómo usarlas para implementar el Ganaste!
Todas las escenas deben implementar estaResueltoElProblema().

Cuando las escenas no tienen una máquina de estados (this.estado=undefined),
perfectamente se puede implementar una función que verifique la resolución. Por ejemplo,
en el caso de María la come sandías, basta verificar que no queden sandias en la escena al finalizar.

Cuando hay máquina de estado hay dos opciones: marcar estados como de aceptación
(finales) (notar que la clase EscenaActividad implementa estaResuletoElProblema()
como verificacion de estado de aceptación) o bien hacer override y dejar que la FSM
se encargue pura y exclusivamente  de los errores de orden.


======================================
PROBLEMA:
La máquina de estados por defecto considera errónea cualquier transición no definida
en el grafo de estados.
Es por ello que no sirve para ser usada en casos donde varias soluciones pueden ser correctas,
porque la configuración debe considerarlas todas.
En estos casos, se debe pensar bien si es necesaria la FSM, y cuáles son las transiciones aceptables.
*/
var Estado = (function () {
    function Estado(funcionAceptacion) {
        if (funcionAceptacion === void 0) { funcionAceptacion = function () { return false; }; }
        this.funcionAceptacion = funcionAceptacion;
    }
    Estado.prototype.verificarQuePuedoSeguir = function () {
    };
    Estado.prototype.soyAceptacion = function () {
        return this.funcionAceptacion();
    };
    return Estado;
})();
var EstadoConTransicion = (function (_super) {
    __extends(EstadoConTransicion, _super);
    function EstadoConTransicion(idEstado) {
        _super.call(this);
        this.identifier = idEstado;
        this.transiciones = {};
    }
    EstadoConTransicion.prototype.agregarTransicion = function (estadoEntrada, idTransicion, condicionTransicion) {
        if (condicionTransicion === void 0) { condicionTransicion = function () { return true; }; }
        this.transiciones[idTransicion] = {
            estadoEntrada: estadoEntrada,
            condicionTransicion: condicionTransicion,
        };
    };
    EstadoConTransicion.prototype.realizarTransicion = function (idTransicion, comportamiento) {
        if (!this.transiciones[idTransicion])
            throw new ActividadError("¡Ups, esa no era la opción correcta!");
        pilas.escena_actual().estado = this.estadoSiguiente(comportamiento, idTransicion);
    };
    EstadoConTransicion.prototype.estadoSiguiente = function (comportamiento, idTransicion) {
        return this.transiciones[idTransicion].condicionTransicion() ?
            this.transiciones[idTransicion].estadoEntrada :
            this;
    };
    return EstadoConTransicion;
})(Estado);
var EstadoAceptacion = (function (_super) {
    __extends(EstadoAceptacion, _super);
    function EstadoAceptacion() {
        _super.apply(this, arguments);
    }
    EstadoAceptacion.prototype.soyAceptacion = function () {
        return true;
    };
    return EstadoAceptacion;
})(EstadoConTransicion);
var EstadoError = (function () {
    function EstadoError(estado, mensaje) {
        this.estadoAlQueVuelve = estado;
        this.mensajeError = mensaje;
    }
    EstadoError.prototype.verificarQuePuedoSeguir = function () {
        throw new ActividadError(this.mensajeError);
    };
    EstadoError.prototype.estadoSiguiente = function (comportamiento, idTransicion) {
        return this.estadoAlQueVuelve;
    };
    return EstadoError;
})();
var BuilderStatePattern = (function () {
    function BuilderStatePattern(idEstadoInicialp) {
        this.idEstadoInicial = idEstadoInicialp;
        this.estados = {};
        this.estados[idEstadoInicialp] = new EstadoConTransicion(idEstadoInicialp);
    }
    BuilderStatePattern.prototype.agregarEstado = function (idEstado) {
        this.estados[idEstado] = new EstadoConTransicion(idEstado);
    };
    BuilderStatePattern.prototype.agregarEstadoAceptacion = function (idEstado) {
        this.estados[idEstado] = new EstadoAceptacion(idEstado);
    };
    BuilderStatePattern.prototype.agregarTransicion = function (estadoSalida, estadoEntrada, transicion, condicionTransicion) {
        if (condicionTransicion === void 0) { condicionTransicion = function () { return true; }; }
        this.estados[estadoSalida].agregarTransicion(this.estados[estadoEntrada], transicion, condicionTransicion);
    };
    BuilderStatePattern.prototype.agregarError = function (estadoSalida, transicion, error) {
        this.estados[estadoSalida].agregarTransicion(new EstadoError(this.estados[estadoSalida], error), transicion);
    };
    BuilderStatePattern.prototype.agregarErrorAVariosEstadosDeSalida = function (estadoSalida, transicion, error, indexInicialSalida, indexFinalSalida) {
        //agrega un error para varios estados de salida con prefijos.
        //pre indefFinalSalida>indexInicialSalida
        var tamano = indexFinalSalida - indexInicialSalida;
        for (var index = 0; index <= tamano; ++index) {
            this.estados[estadoSalida + (indexInicialSalida + index)].agregarTransicion(new EstadoError(this.estados[estadoSalida + (indexInicialSalida + index)], error), transicion);
        }
    };
    BuilderStatePattern.prototype.agregarErroresIterados = function (estadoSalida, transicion, error, indexInicialSalida, indexFinalSalida, indexInicialTransi, indexFinalTransi) {
        //pre: indexFinalSalida-indexInicialSalida= indexFinalTransi-indexInicialTransi
        // NO TERMINADO
        var range = indexFinalSalida - indexInicialSalida;
        for (var index = 0; index < range; ++index) {
            this.estados[estadoSalida + (indexInicialSalida + index)].agregarTransicion(new EstadoError(this.estados[estadoSalida + (indexInicialSalida + index)], error), transicion);
        }
    };
    BuilderStatePattern.prototype.estadoInicial = function () {
        return this.estados[this.idEstadoInicial];
    };
    BuilderStatePattern.prototype.agregarEstadosPrefijados = function (prefix, indexInicial, indexFinal) {
        //prefix debe ser string e indexInicial y final ints
        for (var i = indexInicial; i <= indexFinal; ++i) {
            this.estados[prefix + i] = new EstadoConTransicion(prefix + i);
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
var EstadoParaContarBuilder = (function (_super) {
    __extends(EstadoParaContarBuilder, _super);
    function EstadoParaContarBuilder(idTransicion, cantidadEsperada) {
        _super.call(this, 'faltan');
        this.agregarEstadoAceptacion('llegue');
        var estado = this.estados['llegue'];
        estado.cant = 0;
        this.agregarTransicion('faltan', 'llegue', idTransicion, function () {
            estado.cant += 1;
            return estado.cant === cantidadEsperada;
        });
    }
    return EstadoParaContarBuilder;
})(BuilderStatePattern);
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
    ComportamientoColision.prototype.sanitizarArgumentos = function () {
        _super.prototype.sanitizarArgumentos.call(this);
        if (!this.argumentos['etiqueta'])
            throw new ArgumentError("Debe proveerse una etiqueta para verificar colisión");
    };
    ComportamientoColision.prototype.configurarVerificaciones = function () {
        var _this = this;
        var mensajeError = this.argumentos['mensajeError'] || "¡Acá no hay " + this.hacerLegible(this.argumentos['etiqueta']) + "!";
        this.verificacionesPre.push(new Verificacion(function () { return _this.colisiona(); }, mensajeError));
    };
    ComportamientoColision.prototype.postAnimacion = function () {
        var objetoTocado = this.objetoTocado();
        if (this.argumentos['animacionColisionado'])
            objetoTocado.cargarAnimacion(this.argumentos['animacionColisionado']);
        if (this.argumentos['comportamientoAdicional'])
            objetoTocado.hacer_luego(this.argumentos['comportamientoAdicional'], this.argumentos['argumentosComportamiento']);
        this.metodo(objetoTocado);
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
    ComportamientoColision.prototype.hacerLegible = function (etiqueta) {
        return etiqueta.toLowerCase().split("animada")[0].split("animado")[0];
    };
    ComportamientoColision.prototype.metodo = function (objetoColision) {
        //redefinir por subclase
    };
    return ComportamientoColision;
})(ComportamientoAnimado);
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
var DesencadenarComportamientoSiColisiona = (function (_super) {
    __extends(DesencadenarComportamientoSiColisiona, _super);
    function DesencadenarComportamientoSiColisiona() {
        _super.apply(this, arguments);
    }
    DesencadenarComportamientoSiColisiona.prototype.metodo = function (objetoColision) {
        objetoColision.hacer_luego(this.argumentos['comportamiento'], this.argumentos['argumentosComportamiento']);
    };
    return DesencadenarComportamientoSiColisiona;
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
    EncenderPorEtiqueta.prototype.configurarVerificaciones = function () {
        var _this = this;
        _super.prototype.configurarVerificaciones.call(this);
        this.verificacionesPre.push(new Verificacion(function () { return _this.estaApagada(); }, "¡Ya está " + this.nombreProximaAnimacion() + "!"));
    };
    EncenderPorEtiqueta.prototype.estaApagada = function () {
        return this.objetoTocado().nombreAnimacionActual() != this.nombreProximaAnimacion();
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
/// <reference path="ComportamientoColision.ts"/>
/*
Este comportamiento permite tomar un objeto y convertirlo en subactor
del actor que lo levanta. El subactor acompaña visualmente al actor
de ahora en adelante.
*/
var AgarrarPorEtiqueta = (function (_super) {
    __extends(AgarrarPorEtiqueta, _super);
    function AgarrarPorEtiqueta() {
        _super.apply(this, arguments);
    }
    AgarrarPorEtiqueta.prototype.metodo = function (objetoColision) {
        var objetoAgarrado = objetoColision.clonar();
        objetoAgarrado.escala = objetoColision.escala;
        objetoAgarrado.y = this.receptor.y;
        objetoAgarrado.x = this.receptor.subactores[0].derecha - (this.receptor.subactores[0].ancho / 4);
        this.receptor.agregarSubactor(objetoAgarrado);
        objetoAgarrado.cargarAnimacion("correr"); // porque tiene que cargar la misma imagen que va a usar al moverse
    };
    AgarrarPorEtiqueta.prototype.nombreAnimacion = function () {
        // redefinir por subclase
        return "recoger";
    };
    return AgarrarPorEtiqueta;
})(ComportamientoColision);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "ComportamientoAnimado.ts"/>
var AnimarSiNoEstoyYa = (function (_super) {
    __extends(AnimarSiNoEstoyYa, _super);
    function AnimarSiNoEstoyYa() {
        _super.apply(this, arguments);
    }
    AnimarSiNoEstoyYa.prototype.configurarVerificaciones = function () {
        var _this = this;
        this.verificacionesPre.push(new Verificacion(function () { return _this.puedoRealizarAnimacionYCambio(); }, "No puedo, ya estoy " + this.argumentos.valorEstar));
    };
    AnimarSiNoEstoyYa.prototype.puedoRealizarAnimacionYCambio = function () {
        return (this.esElPrimerCambioDeEstado() && !this.arrancoEnEsteEstado()) ||
            (!this.esElPrimerCambioDeEstado() && !this.yaEstabaEnEsteEstado()); // Porque no puedo cambiar al estado en el que ya estaba.
    };
    AnimarSiNoEstoyYa.prototype.arrancoEnEsteEstado = function () {
        return this.argumentos.arrancoAsi;
    };
    AnimarSiNoEstoyYa.prototype.yaEstabaEnEsteEstado = function () {
        return this.receptor[this.argumentos.descripcionEstar] === this.argumentos.valorEstar;
    };
    AnimarSiNoEstoyYa.prototype.esElPrimerCambioDeEstado = function () {
        return !this.receptor[this.argumentos.descripcionEstar];
    };
    AnimarSiNoEstoyYa.prototype.postAnimacion = function () {
        this.receptor[this.argumentos.descripcionEstar] = this.argumentos.valorEstar;
    };
    return AnimarSiNoEstoyYa;
})(ComportamientoAnimado);
/// <reference path="ComportamientoAnimado.ts"/>
var ComportamientoDeAltoOrden = (function (_super) {
    __extends(ComportamientoDeAltoOrden, _super);
    function ComportamientoDeAltoOrden() {
        _super.apply(this, arguments);
    }
    ComportamientoDeAltoOrden.prototype.nombreAnimacion = function () {
        return this.argumentos['nombreAnimacion'];
    };
    ComportamientoDeAltoOrden.prototype.postAnimacion = function () {
        this.argumentos.metodo.apply(this.argumentos['receptor']);
    };
    return ComportamientoDeAltoOrden;
})(ComportamientoAnimado);
/// <reference path="ComportamientoColision.ts"/>
/// <reference path="../actores/ObservadoAnimado.ts"/>
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
    ContarPorEtiqueta.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        if (!receptor[this.attrName()]) {
            receptor[this.attrName()] = new ObservadoConAumentar();
            receptor[this.attrName()].cantidad = 0;
            receptor[this.attrName()].registrarObservador(pilas.escena_actual().tableros[this.argumentos.etiqueta]);
        }
        ;
    };
    ContarPorEtiqueta.prototype.metodo = function (objetoColision) {
        this.receptor[this.attrName()].aumentar('cantidad', 1);
        if (this.argumentos.eliminar)
            objetoColision.eliminar();
    };
    ContarPorEtiqueta.prototype.attrName = function () {
        return 'cant' + this.argumentos.etiqueta;
    };
    return ContarPorEtiqueta;
})(ComportamientoColision);
/// <reference path="ComportamientoAnimado.ts"/>
var Depositar = (function (_super) {
    __extends(Depositar, _super);
    function Depositar() {
        _super.apply(this, arguments);
    }
    Depositar.prototype.nombreAnimacion = function () {
        return 'depositar';
    };
    Depositar.prototype.postAnimacion = function () {
        if (this.receptor.cuadricula) {
            this.receptor.cuadricula.agregarActor(new this.argumentos.claseADepositar(), this.receptor.casillaActual().nroFila, this.receptor.casillaActual().nroColumna);
        }
        else {
            new this.argumentos.claseADepositar(this.receptor.x, this.receptor.y);
        }
    };
    return Depositar;
})(ComportamientoAnimado);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "MovimientoAnimado.ts"/>
// Está pensado para iniciar la línea en el centro del receptor.
// Esto hace que no haya que hacer cálculos ni aprender qué significa Shape.regX ó cómo lo usa pilas.
// Llámenme cobarde, sí. Perdón.
var DibujarLinea = (function (_super) {
    __extends(DibujarLinea, _super);
    function DibujarLinea() {
        _super.apply(this, arguments);
    }
    DibujarLinea.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        if (!receptor.pizarra)
            receptor.pizarra = new pilas.actores.Pizarra();
    };
    DibujarLinea.prototype.darUnPaso = function () {
        var origen = { x: this.receptor.x, y: this.receptor.y };
        _super.prototype.darUnPaso.call(this);
        this.receptor.pizarra.linea(origen.x, origen.y, this.receptor.x, this.receptor.y, pilas.colores.azuloscuro, 6);
    };
    return DibujarLinea;
})(MovimientoAnimado);
var DibujarHaciaAdelante = (function (_super) {
    __extends(DibujarHaciaAdelante, _super);
    function DibujarHaciaAdelante() {
        _super.apply(this, arguments);
    }
    DibujarHaciaAdelante.prototype.preAnimacion = function () {
        this.argumentos.direccion = new Direct(this.receptor.rotacion);
        _super.prototype.preAnimacion.call(this);
    };
    return DibujarHaciaAdelante;
})(DibujarLinea);
/// <reference path="ComportamientoConVelocidad.ts"/>
var Eliminar = (function (_super) {
    __extends(Eliminar, _super);
    function Eliminar() {
        _super.apply(this, arguments);
    }
    Eliminar.prototype.postAnimacion = function () {
        this.receptor.eliminar();
    };
    return Eliminar;
})(ComportamientoConVelocidad);
var Desaparecer = (function (_super) {
    __extends(Desaparecer, _super);
    function Desaparecer() {
        _super.apply(this, arguments);
    }
    Desaparecer.prototype.postAnimacion = function () {
        this.receptor.suspenderHabilidadesConMovimiento();
        this.receptor.izquierda = pilas.derecha() + 1;
    };
    return Desaparecer;
})(ComportamientoConVelocidad);
/// <reference path = "../comportamientos/MovimientoAnimado.ts" />
// Si se pasa por argumento "escaparCon" entonces el receptor debe ser actor compuesto
var Escapar = (function (_super) {
    __extends(Escapar, _super);
    function Escapar() {
        _super.apply(this, arguments);
    }
    Escapar.prototype.iniciar = function (receptor) {
        this.argumentos.idTransicion = "escapar";
        _super.prototype.iniciar.call(this, receptor);
    };
    Escapar.prototype.preAnimacion = function () {
        this.argumentos.direccion = new Direct(1, 5);
        this.argumentos.distancia = 600;
        this.argumentos.velocidad = 8;
        this.argumentos.cantPasos = 40;
        if (this.argumentos.escaparCon)
            this.receptor.agregarSubactor(this.argumentos.escaparCon);
        _super.prototype.preAnimacion.call(this);
    };
    return Escapar;
})(MovimientoAnimado);
/// <reference path = "MovimientoAnimado.ts"/>
/// <reference path = "../actores/ActorAnimado.ts"/>
var GirarMarquesina = (function (_super) {
    __extends(GirarMarquesina, _super);
    function GirarMarquesina() {
        _super.apply(this, arguments);
    }
    GirarMarquesina.prototype.preAnimacion = function () {
        this.argumentos.distancia = this.receptor.subactores[0].getAncho();
        this.argumentos.direccion = new Direct(-1, 0);
        this.argumentos.voltearAlIrAIzquierda = false;
        this.posInicial = { x: this.receptor.subactores[0].x, y: this.receptor.subactores[0].y };
        if (!this.receptor.subactores[1]) {
            this.receptor.agregarSubactor(this.espejo());
        }
        else {
            this.receptor.subactores[1].x = this.posInicial.x + this.receptor.subactores[0].getAncho();
        }
        ;
        _super.prototype.preAnimacion.call(this);
    };
    GirarMarquesina.prototype.postAnimacion = function () {
        _super.prototype.postAnimacion.call(this);
        this.receptor.setX(this.posInicial.x);
    };
    GirarMarquesina.prototype.espejo = function () {
        var clon = new ActorAnimado(this.posInicial.x + this.receptor.subactores[0].getAncho(), this.posInicial.y, this.receptor.subactores[0].opciones);
        clon.z = this.receptor.subactores[0].z;
        return clon;
    };
    return GirarMarquesina;
})(MovimientoAnimado);
var IrASiguienteFila = (function (_super) {
    __extends(IrASiguienteFila, _super);
    function IrASiguienteFila() {
        _super.apply(this, arguments);
    }
    IrASiguienteFila.prototype.nombreAnimacion = function () {
        // redefinir por subclase
        return "parado";
    };
    IrASiguienteFila.prototype.postAnimacion = function () {
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
/// <reference path = "../comportamientos/AnimarSiNoEstoyYa.ts" />
var ModificarRotacionYAltura = (function (_super) {
    __extends(ModificarRotacionYAltura, _super);
    function ModificarRotacionYAltura() {
        _super.apply(this, arguments);
    }
    ModificarRotacionYAltura.prototype.postAnimacion = function () {
        _super.prototype.postAnimacion.call(this);
        this.receptor.y = this.argumentos['alturaIr'];
        this.receptor.rotacion = this.argumentos['rotacionIr'];
    };
    return ModificarRotacionYAltura;
})(AnimarSiNoEstoyYa);
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
        return this.argumentos.nombreAnimacion || "recoger";
    };
    return RecogerPorEtiqueta;
})(ComportamientoColision);
/// <reference path = "ComportamientoConVelocidad.ts"/>
var Rotar = (function (_super) {
    __extends(Rotar, _super);
    function Rotar() {
        _super.apply(this, arguments);
    }
    Rotar.prototype.preAnimacion = function () {
        _super.prototype.preAnimacion.call(this);
        if (!this.argumentos.angulo)
            throw new ArgumentError("Angle must be provided for Rotar to work");
        this.anguloAvance = this.argumentos.angulo / this.argumentos.cantPasos;
        this.anguloFinal = this.receptor.rotacion + this.argumentos.angulo;
    };
    Rotar.prototype.darUnPaso = function () {
        this.receptor.rotacion += this.anguloAvance;
    };
    Rotar.prototype.setearEstadoFinalDeseado = function () {
        this.receptor.rotacion = this.anguloFinal;
    };
    Rotar.prototype.nombreAnimacion = function () {
        return "rotar";
    };
    return Rotar;
})(ComportamientoConVelocidad);
/// <reference path = "ComportamientoConVelocidad.ts"/>
var SaltarAnimado = (function (_super) {
    __extends(SaltarAnimado, _super);
    function SaltarAnimado() {
        _super.apply(this, arguments);
    }
    SaltarAnimado.prototype.preAnimacion = function () {
        _super.prototype.preAnimacion.call(this);
        this.sanitizarArgumentosSaltar();
        this.suelo = this.receptor.y;
        this.velocidad_vertical = this.velocidad_inicial;
        pilas.sonidos.cargar('saltar.wav').reproducir();
    };
    SaltarAnimado.prototype.sanitizarArgumentosSaltar = function () {
        this.alTerminar = this.argumentos.alTerminar || function (r) { };
        this.gravedad = this.argumentos.gravedad || this.calcularGravedad();
        this.velocidad_inicial = this.argumentos.velocidad_inicial || this.calcularVInicial();
    };
    SaltarAnimado.prototype.calcularGravedad = function () {
        // calculo gravedad porque no vino por argumento.
        if (!this.argumentos.velocidad_inicial || !this.argumentos.alturaDeseada)
            throw new ArgumentError('Si no se proporciona gravedad, debe proporcionarse velocidad inicial y la altura deseada');
        if (this.argumentos.velocidad_inicial * this.argumentos.cantPasos / 2 < this.argumentos.alturaDeseada)
            throw new ArgumentError('Velocidad inicial insuficiente para llegar a la altura deseada en los pasos indicados');
        // justificación de esto abajo
        var cps = this.argumentos.cantPasos / 2;
        var v = this.argumentos.velocidad_inicial;
        var h = this.argumentos.alturaDeseada;
        return (cps * v - h) / ((cps - 1) * cps / 2);
    };
    SaltarAnimado.prototype.calcularVInicial = function () {
        if (!this.argumentos.alturaDeseada)
            throw new ArgumentError('Si no se proporciona velocidad inicial, debe proporcionarse la gravedad y la altura deseada');
        // justificación de esto abajo
        var cps = this.argumentos.cantPasos / 2;
        var g = this.gravedad;
        var h = this.argumentos.alturaDeseada;
        var v = g / 2 * (cps - 1) + (h / cps);
        if (v < 0)
            throw new ArgumentError('Gravedad insuficiente para llegar a la altura deseada en los pasos indicados');
        return v;
    };
    /* Fumata:

     h es altura, v es velocidad inicial, g es gravedad, cps es cantidad de pasos para la subida.
    Mirando darUnPaso, y teniendo en cuenta que la velocidad vertical va disminuyendo relativa a la anterior,
     el cálculo que hay que hacer para calcular h es:

    h = v +
        v - g +
            v - g - g +
            v - g - g - g +
            ..... cps veces.

    Entonces, siendo E() sumatoria de i = 0 a cps - 1
    h = E (v - g * i)
    Sacando la constante v de la sumatoria:
    h = cps * v + E (- g * i)
    Factor común -g
    h = cps * v - g * E (i)
    x Gauss
    h = cps * v - g * ((cps-1+0) * cps/2) --->>> si cps es par
    h = cps * v - g * ((cps-1) * cps/2) -> de acá sale la altura a partir de velocidad inicial y gravedad

    De donde sale que la gravedad g es:
    g * ((cps-1) * cps/2) = cps * v - h
    g = (cps * v - h) / ((cps-1) * cps/2) -> de acá sale la gravedad a partir de altura y velocidad inicial

    Y de donde sale que v es:
    g * ((cps-1) * cps/2) = cps * v - h
    g * ((cps-1) * cps/2) + h = cps * v
    (g * ((cps-1) * cps/2) + h ) / cps = v
    Masajeo:
    g * ((cps-1) * cps/2) / cps + h / cps = v
    g * ((cps-1) /2) + h / cps = v
    g/2 * (cps-1) + h / cps = v -> -> de acá sale la velocidad a partir de altura y gravedad
    */
    SaltarAnimado.prototype.darUnPaso = function () {
        this.receptor.y += this.velocidad_vertical;
        this.velocidad_vertical -= this.gravedad;
    };
    SaltarAnimado.prototype.setearEstadoFinalDeseado = function () {
        this.receptor.y = this.suelo;
        this.alTerminar.call(this.receptor);
    };
    SaltarAnimado.prototype.nombreAnimacion = function () {
        return "saltar";
    };
    return SaltarAnimado;
})(ComportamientoConVelocidad);
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
    SaltarHablando.prototype.postAnimacion = function () {
        this.receptor.decir(pilas.escena_actual().fraseAlSaltar());
    };
    return SaltarHablando;
})(SaltarAnimado);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "ComportamientoAnimado.ts"/>
// Decorator de la Secuencia
var SecuenciaAnimada = (function (_super) {
    __extends(SecuenciaAnimada, _super);
    function SecuenciaAnimada() {
        _super.apply(this, arguments);
    }
    SecuenciaAnimada.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.laSecuenciaPosta = new Secuencia(this.argumentos);
        this.laSecuenciaPosta.iniciar(receptor);
    };
    SecuenciaAnimada.prototype.doActualizar = function () {
        return this.laSecuenciaPosta.actualizar();
    };
    return SecuenciaAnimada;
})(ComportamientoAnimado);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "ComportamientoAnimado.ts"/>
var SerPateado = (function (_super) {
    __extends(SerPateado, _super);
    function SerPateado() {
        _super.apply(this, arguments);
    }
    SerPateado.prototype.preAnimacion = function () {
        this.receptor.cargarAnimacion("patear");
        this.receptor.aprender(RotarContinuamente, { 'gradosDeAumentoStep': this.argumentos['gradosDeAumentoStep'] || 1 });
        this.actualizarPosicion();
        this.contador = Math.random() * 3;
        this.aceleracion = this.argumentos['aceleracion'];
        this.tiempoEnElAire = this.argumentos['tiempoEnElAire'] || 10;
        this.elevacionMaxima = this.argumentos['elevacionMaxima'] || 10;
    };
    SerPateado.prototype.doActualizar = function () {
        _super.prototype.doActualizar.call(this);
        return this.patearConSubidaLineal();
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
        if (this.receptor.izquierda >= pilas.derecha()) {
            this.receptor.eliminar();
            return true;
        }
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
})(ComportamientoAnimado);
/// <reference path="ComportamientoColision.ts"/>
/*
Este comportamiento Agarra al objeto y refleja en un contador
el valor.
Argumentos adicionales al comportamiento colision: puedoSostenerMasDeUno (por defecto es falso)
*/
var Sostener = (function (_super) {
    __extends(Sostener, _super);
    function Sostener() {
        _super.apply(this, arguments);
    }
    Sostener.prototype.preAnimacion = function () {
        this.argumentos.nombreAnimacion = this.argumentos.nombreAnimacion || "recoger";
    };
    Sostener.prototype.metodo = function (objetoColision) {
        // TODO: Habría que separarlo en dos comportamientos, Tomar por un lado, Contar por el otro.
        var objetoAgarrado = objetoColision.clonar();
        objetoAgarrado.escala = objetoColision.escala;
        objetoAgarrado.y = this.receptor.y;
        objetoAgarrado.x = this.receptor.subactores[0].derecha - (this.receptor.subactores[0].ancho / 4);
        this.receptor.agregarSubactor(objetoAgarrado);
        objetoAgarrado.cargarAnimacion("correr"); // porque tiene que cargar la misma imagen que va a usar al moverse
        if (objetoColision.disminuir)
            objetoColision.disminuir('cantidad', 1);
        if (!objetoColision['cantidad'])
            objetoColision.eliminar();
    };
    Sostener.prototype.configurarVerificaciones = function () {
        var _this = this;
        _super.prototype.configurarVerificaciones.call(this);
        this.verificacionesPre.push(new Verificacion(function () { return _this.puedoSostener(); }, "No puedo sostener dos cosas a la vez..."));
    };
    Sostener.prototype.puedoSostener = function () {
        return this.argumentos.puedoSostenerMasDeUno || !this.receptor.tieneAlgoEnLaMano();
    };
    return Sostener;
})(ComportamientoColision);
var Soltar = (function (_super) {
    __extends(Soltar, _super);
    function Soltar() {
        _super.apply(this, arguments);
    }
    Soltar.prototype.metodo = function (objetoColision) {
        if (this.argumentos.queSoltar) {
            this.receptor.eliminarSubactor(this.argumentos.queSoltar);
        }
        else {
            this.receptor.eliminarUltimoSubactor();
        }
        ;
    };
    Soltar.prototype.configurarVerificaciones = function () {
        var _this = this;
        _super.prototype.configurarVerificaciones.call(this);
        this.verificacionesPre.push(new Verificacion(function () { return _this.sostieneLoQueCorresponde(); }, "No tengo " + this.hacerLegible(this.argumentos.queSoltar) + " en la mano"));
    };
    Soltar.prototype.sostieneLoQueCorresponde = function () {
        return this.argumentos.queSoltar ?
            this.receptor.tieneEnLaMano(this.argumentos.queSoltar) :
            this.receptor.tieneAlgoEnLaMano();
    };
    Soltar.prototype.hacerLegible = function (etiqueta) {
        return etiqueta ? _super.prototype.hacerLegible.call(this, etiqueta) : "nada";
    };
    return Soltar;
})(ComportamientoColision);
/// <reference path = "ComportamientoConVelocidad.ts" />
/// <reference path = "GirarMarquesina.ts" />
var VolarHeroicamente = (function (_super) {
    __extends(VolarHeroicamente, _super);
    function VolarHeroicamente() {
        _super.apply(this, arguments);
    }
    VolarHeroicamente.prototype.nombreAnimacion = function () {
        return 'correr';
    };
    VolarHeroicamente.prototype.preAnimacion = function () {
        this.argumentos.velocidad = 100;
        this.argumentos.cantPasos = 1;
        _super.prototype.preAnimacion.call(this);
        pilas.escena_actual().fondo.hacer_luego(GirarMarquesina, {});
    };
    VolarHeroicamente.prototype.postAnimacion = function () {
        _super.prototype.postAnimacion.call(this);
        if (this.receptor.fraseAlVolar)
            this.receptor.decir(this.receptor.fraseAlVolar());
    };
    return VolarHeroicamente;
})(ComportamientoConVelocidad);
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
    return AlienInicial;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
var AlienLevantaTuercas = (function (_super) {
    __extends(AlienLevantaTuercas, _super);
    function AlienLevantaTuercas() {
        _super.apply(this, arguments);
    }
    AlienLevantaTuercas.prototype.iniciar = function () {
        var _this = this;
        this.estado = new Estado(function () { return _this.cantidadObjetosConEtiqueta('TuercaAnimada') == 0; });
        this.fondo = new pilas.fondos.Laberinto1();
        this.cuadricula = new Cuadricula(0, -25, 5, 6, { alto: 400 }, { grilla: 'invisible.png',
            cantColumnas: 1 });
        this.automata = new AlienAnimado(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata, 4, 0, false);
        for (var i = 0; i < 5; i++) {
            var tuerca = new TuercaAnimada(0, 0);
            this.cuadricula.agregarActorEnPerspectiva(tuerca, i, i);
            //tuerca.aprender(Flotar,{'Desvio':10})
            //tuerca.aprender(RotarContinuamente,{'gradosDeAumentoStep':1})
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
    return AlimentandoALosPeces;
})(EscenaActividad);
/// <reference path = "../actores/CuadriculaEsparsa.ts" />
/*Builder para una cuadricula esparsa con forma de camino*/
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
        var cuadricula = new CuadriculaEsparsa(this.x, this.y, this.opcionesCuadricula, this.opcionesCasilla, this.matriz);
        this.cambiarImagenesCasillasCamino(cuadricula);
        return cuadricula;
    };
    Camino.prototype.cambiarImagenesCasillasCamino = function (cuadricula) {
        for (var i = 0; i < cuadricula.casillas.length - 1; i++) {
            cuadricula.casillas[i].cambiarImagen(this.opcionesCasilla[this.direcciones[i]]);
        }
        cuadricula.casillas[cuadricula.casillas.length - 1].cambiarImagen('finCamino.png', 1, 4);
        var llegada = cuadricula.casillas[cuadricula.casillas.length - 1]; // Porque el cambiarImagen rompe integridad referencial
        llegada.definirAnimacion('->', [0], 1);
        llegada.definirAnimacion('^', [3], 1);
        llegada.definirAnimacion('<-', [2], 1);
        llegada.definirAnimacion('v', [1], 1);
        llegada.cargarAnimacion(this.direcciones[cuadricula.casillas.length - 2]);
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
        //var aDevolver = Array(this.cantidadFilas).fill(Array(this.cantidadColumnas).fill('F'));
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
    function CuadriculaParaRaton(x, y, cantFilas, cantColumnas, opcionesCuadricula, opcionesCasilla) {
        _super.call(this, x, y, this.dameDirecciones(1, 1, cantFilas, cantColumnas, opcionesCuadricula), cantFilas, cantColumnas, opcionesCuadricula, opcionesCasilla);
    }
    CuadriculaParaRaton.prototype.validarOpcionesCuadricula = function (opciones, maxAbj, maxDer) {
        if (opciones['largo_min'] != undefined &&
            opciones['largo_max'] != undefined) {
            var largo_min = opciones['largo_min'];
            var largo_max = opciones['largo_max'];
            if (largo_min < 1) {
                throw new ArgumentError("El largo debe ser al menos 1");
            }
            if (largo_min > maxAbj + maxDer + 1) {
                throw new ArgumentError("El largo minimo supera al maximo posile");
            }
            if (largo_max < largo_min) {
                throw new ArgumentError("El largo debe maximo debe ser >= al minimo");
            }
            if (largo_max > maxAbj + maxDer + 1) {
                throw new ArgumentError("El largo maximo supera al maximo posile");
            }
        }
    };
    CuadriculaParaRaton.prototype.calcularCantidadMovimientos = function (opciones, maxAbj, maxDer) {
        var largo_min = maxAbj + maxDer + 1;
        var largo_max = largo_min;
        if (opciones['largo_min'] != undefined &&
            opciones['largo_max'] != undefined) {
            largo_min = opciones['largo_min'];
            largo_max = opciones['largo_max'];
        }
        // Elegir al azar un largo entre el min y el max
        var largo = largo_min + Math.floor(Math.random() * (largo_max - largo_min + 1));
        // -1 Porque el largo esta en casillas y necesitamos cantidad de movimientos
        return largo - 1;
    };
    CuadriculaParaRaton.prototype.dameDirecciones = function (filaInicio, colInicio, filaFin, colFin, opcionesCuadricula) {
        //pre: solo me voy a moder para abajo y derecha. Con lo cual la
        //pos posInicialX<posFinalX posInicialY<posFinalY
        var cantMovDer = colFin - colInicio;
        var cantMovAbj = filaFin - filaInicio;
        this.validarOpcionesCuadricula(opcionesCuadricula, cantMovAbj, cantMovDer);
        var nMovimientos = this.calcularCantidadMovimientos(opcionesCuadricula, cantMovAbj, cantMovDer);
        var a = Array.apply(null, new Array(cantMovDer)).map(function () { return '->'; });
        var b = Array.apply(null, new Array(cantMovAbj)).map(function () { return 'v'; });
        var aDevolver = a.concat(b);
        return this.shuffleArray(aDevolver).slice(0, nMovimientos);
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
/// <reference path = "../actores/Dibujante.ts" />
var DibujandoFiguras = (function (_super) {
    __extends(DibujandoFiguras, _super);
    function DibujandoFiguras() {
        _super.apply(this, arguments);
    }
    DibujandoFiguras.prototype.iniciar = function () {
        this.fondo = new Fondo('fondo.dibujando.figuras.png', 0, 0);
        this.automata = new Dibujante();
        this.automata.escala = 0.5;
        this.automata.x = -150;
        this.automata.y = 100;
        this.dibujarFiguraFantasma();
    };
    DibujandoFiguras.prototype.dibujarFiguraFantasma = function () {
        var _this = this;
        this.pizarraFantasma = new pilas.actores.Pizarra();
        var origen = { x: this.automata.x, y: this.automata.y };
        this.puntosSolucion().forEach(function (destino) {
            _this.pizarraFantasma.linea(origen.x, origen.y, destino.x, destino.y, pilas.colores.grisclaro, 6);
            origen = destino;
        });
    };
    DibujandoFiguras.prototype.estaResueltoElProblema = function () {
        return this.automata.pizarra.tieneIgualDibujoQue(this.pizarraFantasma);
    };
    DibujandoFiguras.prototype.puntosSolucion = function () {
        // abstracto, sobreescribir.
        // Es un array de puntos que se obtiene haciendo
        // automata.pizarra.puntosSinRepetir()
        return [];
    };
    return DibujandoFiguras;
})(EscenaActividad);
// Puntos obtenidos haciendo:
// pilas.escena_actual().automata.pizarra.puntosDeLineas().map(p => " {x:" + p.x.toString() +",y:" + p.y.toString() + "}").toString()
var DibujandoCuadrado = (function (_super) {
    __extends(DibujandoCuadrado, _super);
    function DibujandoCuadrado() {
        _super.apply(this, arguments);
    }
    DibujandoCuadrado.prototype.puntosSolucion = function () {
        return [{ x: -140, y: 100 }, { x: -130, y: 100 }, { x: -120, y: 100 }, { x: -110, y: 100 }, { x: -100, y: 100 }, { x: -90, y: 100 }, { x: -80, y: 100 }, { x: -70, y: 100 }, { x: -60, y: 100 }, { x: -50, y: 100 }, { x: -50, y: 90 }, { x: -50, y: 80 }, { x: -50, y: 70 }, { x: -50, y: 60 }, { x: -50, y: 50 }, { x: -50, y: 40 }, { x: -50, y: 30 }, { x: -50, y: 20 }, { x: -50, y: 10 }, { x: -50, y: 0 }, { x: -60, y: 0 }, { x: -70, y: 0 }, { x: -80, y: 0 }, { x: -90, y: 0 }, { x: -100, y: 0 }, { x: -110, y: 0 }, { x: -120, y: 0 }, { x: -130, y: 0 }, { x: -140, y: 0 }, { x: -150, y: 0 }, { x: -150, y: 10 }, { x: -150, y: 20 }, { x: -150, y: 30 }, { x: -150, y: 40 }, { x: -150, y: 50 }, { x: -150, y: 60 }, { x: -150, y: 70 }, { x: -150, y: 80 }, { x: -150, y: 90 }, { x: -150, y: 100 }];
    };
    return DibujandoCuadrado;
})(DibujandoFiguras);
var Dibujando5CuadradosHorizontal = (function (_super) {
    __extends(Dibujando5CuadradosHorizontal, _super);
    function Dibujando5CuadradosHorizontal() {
        _super.apply(this, arguments);
    }
    Dibujando5CuadradosHorizontal.prototype.puntosSolucion = function () {
        return [{ x: -145, y: 100 }, { x: -140, y: 100 }, { x: -135, y: 100 }, { x: -130, y: 100 }, { x: -125, y: 100 }, { x: -120, y: 100 }, { x: -115, y: 100 }, { x: -110, y: 100 }, { x: -105, y: 100 }, { x: -100, y: 100 }, { x: -100, y: 95 }, { x: -100, y: 90 }, { x: -100, y: 85 }, { x: -100, y: 80 }, { x: -100, y: 75 }, { x: -100, y: 70 }, { x: -100, y: 65 }, { x: -100, y: 60 }, { x: -100, y: 55 }, { x: -100, y: 50 }, { x: -105, y: 50 }, { x: -110, y: 50 }, { x: -115, y: 50 }, { x: -120, y: 50 }, { x: -125, y: 50 }, { x: -130, y: 50 }, { x: -135, y: 50 }, { x: -140, y: 50 }, { x: -145, y: 50 }, { x: -150, y: 50 }, { x: -150, y: 55 }, { x: -150, y: 60 }, { x: -150, y: 65 }, { x: -150, y: 70 }, { x: -150, y: 75 }, { x: -150, y: 80 }, { x: -150, y: 85 }, { x: -150, y: 90 }, { x: -150, y: 95 }, { x: -150, y: 100 }, { x: -145, y: 100 }, { x: -140, y: 100 }, { x: -135, y: 100 }, { x: -130, y: 100 }, { x: -125, y: 100 }, { x: -120, y: 100 }, { x: -115, y: 100 }, { x: -110, y: 100 }, { x: -105, y: 100 }, { x: -100, y: 100 }, { x: -95, y: 100 }, { x: -90, y: 100 }, { x: -85, y: 100 }, { x: -80, y: 100 }, { x: -75, y: 100 }, { x: -70, y: 100 }, { x: -65, y: 100 }, { x: -60, y: 100 }, { x: -55, y: 100 }, { x: -50, y: 100 }, { x: -50, y: 95 }, { x: -50, y: 90 }, { x: -50, y: 85 }, { x: -50, y: 80 }, { x: -50, y: 75 }, { x: -50, y: 70 }, { x: -50, y: 65 }, { x: -50, y: 60 }, { x: -50, y: 55 }, { x: -50, y: 50 }, { x: -55, y: 50 }, { x: -60, y: 50 }, { x: -65, y: 50 }, { x: -70, y: 50 }, { x: -75, y: 50 }, { x: -80, y: 50 }, { x: -85, y: 50 }, { x: -90, y: 50 }, { x: -95, y: 50 }, { x: -100, y: 50 }, { x: -100, y: 55 }, { x: -100, y: 60 }, { x: -100, y: 65 }, { x: -100, y: 70 }, { x: -100, y: 75 }, { x: -100, y: 80 }, { x: -100, y: 85 }, { x: -100, y: 90 }, { x: -100, y: 95 }, { x: -100, y: 100 }, { x: -95, y: 100 }, { x: -90, y: 100 }, { x: -85, y: 100 }, { x: -80, y: 100 }, { x: -75, y: 100 }, { x: -70, y: 100 }, { x: -65, y: 100 }, { x: -60, y: 100 }, { x: -55, y: 100 }, { x: -50, y: 100 }, { x: -45, y: 100 }, { x: -40, y: 100 }, { x: -35, y: 100 }, { x: -30, y: 100 }, { x: -25, y: 100 }, { x: -20, y: 100 }, { x: -15, y: 100 }, { x: -10, y: 100 }, { x: -5, y: 100 }, { x: 0, y: 100 }, { x: 0, y: 95 }, { x: 0, y: 90 }, { x: 0, y: 85 }, { x: 0, y: 80 }, { x: 0, y: 75 }, { x: 0, y: 70 }, { x: 0, y: 65 }, { x: 0, y: 60 }, { x: 0, y: 55 }, { x: 0, y: 50 }, { x: -5, y: 50 }, { x: -10, y: 50 }, { x: -15, y: 50 }, { x: -20, y: 50 }, { x: -25, y: 50 }, { x: -30, y: 50 }, { x: -35, y: 50 }, { x: -40, y: 50 }, { x: -45, y: 50 }, { x: -50, y: 50 }, { x: -50, y: 55 }, { x: -50, y: 60 }, { x: -50, y: 65 }, { x: -50, y: 70 }, { x: -50, y: 75 }, { x: -50, y: 80 }, { x: -50, y: 85 }, { x: -50, y: 90 }, { x: -50, y: 95 }, { x: -50, y: 100 }, { x: -45, y: 100 }, { x: -40, y: 100 }, { x: -35, y: 100 }, { x: -30, y: 100 }, { x: -25, y: 100 }, { x: -20, y: 100 }, { x: -15, y: 100 }, { x: -10, y: 100 }, { x: -5, y: 100 }, { x: 0, y: 100 }, { x: 5, y: 100 }, { x: 10, y: 100 }, { x: 15, y: 100 }, { x: 20, y: 100 }, { x: 25, y: 100 }, { x: 30, y: 100 }, { x: 35, y: 100 }, { x: 40, y: 100 }, { x: 45, y: 100 }, { x: 50, y: 100 }, { x: 50, y: 95 }, { x: 50, y: 90 }, { x: 50, y: 85 }, { x: 50, y: 80 }, { x: 50, y: 75 }, { x: 50, y: 70 }, { x: 50, y: 65 }, { x: 50, y: 60 }, { x: 50, y: 55 }, { x: 50, y: 50 }, { x: 45, y: 50 }, { x: 40, y: 50 }, { x: 35, y: 50 }, { x: 30, y: 50 }, { x: 25, y: 50 }, { x: 20, y: 50 }, { x: 15, y: 50 }, { x: 10, y: 50 }, { x: 5, y: 50 }, { x: 0, y: 50 }, { x: 0, y: 55 }, { x: 0, y: 60 }, { x: 0, y: 65 }, { x: 0, y: 70 }, { x: 0, y: 75 }, { x: 0, y: 80 }, { x: 0, y: 85 }, { x: 0, y: 90 }, { x: 0, y: 95 }, { x: 0, y: 100 }, { x: 5, y: 100 }, { x: 10, y: 100 }, { x: 15, y: 100 }, { x: 20, y: 100 }, { x: 25, y: 100 }, { x: 30, y: 100 }, { x: 35, y: 100 }, { x: 40, y: 100 }, { x: 45, y: 100 }, { x: 50, y: 100 }, { x: 55, y: 100 }, { x: 60, y: 100 }, { x: 65, y: 100 }, { x: 70, y: 100 }, { x: 75, y: 100 }, { x: 80, y: 100 }, { x: 85, y: 100 }, { x: 90, y: 100 }, { x: 95, y: 100 }, { x: 100, y: 100 }, { x: 100, y: 95 }, { x: 100, y: 90 }, { x: 100, y: 85 }, { x: 100, y: 80 }, { x: 100, y: 75 }, { x: 100, y: 70 }, { x: 100, y: 65 }, { x: 100, y: 60 }, { x: 100, y: 55 }, { x: 100, y: 50 }, { x: 95, y: 50 }, { x: 90, y: 50 }, { x: 85, y: 50 }, { x: 80, y: 50 }, { x: 75, y: 50 }, { x: 70, y: 50 }, { x: 65, y: 50 }, { x: 60, y: 50 }, { x: 55, y: 50 }, { x: 50, y: 50 }, { x: 50, y: 55 }, { x: 50, y: 60 }, { x: 50, y: 65 }, { x: 50, y: 70 }, { x: 50, y: 75 }, { x: 50, y: 80 }, { x: 50, y: 85 }, { x: 50, y: 90 }, { x: 50, y: 95 }, { x: 50, y: 100 }, { x: 55, y: 100 }, { x: 60, y: 100 }, { x: 65, y: 100 }, { x: 70, y: 100 }, { x: 75, y: 100 }, { x: 80, y: 100 }, { x: 85, y: 100 }, { x: 90, y: 100 }, { x: 95, y: 100 }, { x: 100, y: 100 }];
    };
    return Dibujando5CuadradosHorizontal;
})(DibujandoFiguras);
var Dibujando5CuadradosDiagonal = (function (_super) {
    __extends(Dibujando5CuadradosDiagonal, _super);
    function Dibujando5CuadradosDiagonal() {
        _super.apply(this, arguments);
    }
    Dibujando5CuadradosDiagonal.prototype.puntosSolucion = function () {
        return [{ x: -145, y: 100 }, { x: -140, y: 100 }, { x: -135, y: 100 }, { x: -130, y: 100 }, { x: -125, y: 100 }, { x: -120, y: 100 }, { x: -115, y: 100 }, { x: -110, y: 100 }, { x: -105, y: 100 }, { x: -100, y: 100 }, { x: -100, y: 95 }, { x: -100, y: 90 }, { x: -100, y: 85 }, { x: -100, y: 80 }, { x: -100, y: 75 }, { x: -100, y: 70 }, { x: -100, y: 65 }, { x: -100, y: 60 }, { x: -100, y: 55 }, { x: -100, y: 50 }, { x: -105, y: 50 }, { x: -110, y: 50 }, { x: -115, y: 50 }, { x: -120, y: 50 }, { x: -125, y: 50 }, { x: -130, y: 50 }, { x: -135, y: 50 }, { x: -140, y: 50 }, { x: -145, y: 50 }, { x: -150, y: 50 }, { x: -150, y: 55 }, { x: -150, y: 60 }, { x: -150, y: 65 }, { x: -150, y: 70 }, { x: -150, y: 75 }, { x: -150, y: 80 }, { x: -150, y: 85 }, { x: -150, y: 90 }, { x: -150, y: 95 }, { x: -150, y: 100 }, { x: -145, y: 100 }, { x: -140, y: 100 }, { x: -135, y: 100 }, { x: -130, y: 100 }, { x: -125, y: 100 }, { x: -120, y: 100 }, { x: -115, y: 100 }, { x: -110, y: 100 }, { x: -105, y: 100 }, { x: -100, y: 100 }, { x: -100, y: 95 }, { x: -100, y: 90 }, { x: -100, y: 85 }, { x: -100, y: 80 }, { x: -100, y: 75 }, { x: -100, y: 70 }, { x: -100, y: 65 }, { x: -100, y: 60 }, { x: -100, y: 55 }, { x: -100, y: 50 }, { x: -95, y: 50 }, { x: -90, y: 50 }, { x: -85, y: 50 }, { x: -80, y: 50 }, { x: -75, y: 50 }, { x: -70, y: 50 }, { x: -65, y: 50 }, { x: -60, y: 50 }, { x: -55, y: 50 }, { x: -50, y: 50 }, { x: -50, y: 45 }, { x: -50, y: 40 }, { x: -50, y: 35 }, { x: -50, y: 30 }, { x: -50, y: 25 }, { x: -50, y: 20 }, { x: -50, y: 15 }, { x: -50, y: 10 }, { x: -50, y: 5 }, { x: -50, y: 0 }, { x: -55, y: 0 }, { x: -60, y: 0 }, { x: -65, y: 0 }, { x: -70, y: 0 }, { x: -75, y: 0 }, { x: -80, y: 0 }, { x: -85, y: 0 }, { x: -90, y: 0 }, { x: -95, y: 0 }, { x: -100, y: 0 }, { x: -100, y: 5 }, { x: -100, y: 10 }, { x: -100, y: 15 }, { x: -100, y: 20 }, { x: -100, y: 25 }, { x: -100, y: 30 }, { x: -100, y: 35 }, { x: -100, y: 40 }, { x: -100, y: 45 }, { x: -100, y: 50 }, { x: -95, y: 50 }, { x: -90, y: 50 }, { x: -85, y: 50 }, { x: -80, y: 50 }, { x: -75, y: 50 }, { x: -70, y: 50 }, { x: -65, y: 50 }, { x: -60, y: 50 }, { x: -55, y: 50 }, { x: -50, y: 50 }, { x: -50, y: 45 }, { x: -50, y: 40 }, { x: -50, y: 35 }, { x: -50, y: 30 }, { x: -50, y: 25 }, { x: -50, y: 20 }, { x: -50, y: 15 }, { x: -50, y: 10 }, { x: -50, y: 5 }, { x: -50, y: 0 }, { x: -45, y: 0 }, { x: -40, y: 0 }, { x: -35, y: 0 }, { x: -30, y: 0 }, { x: -25, y: 0 }, { x: -20, y: 0 }, { x: -15, y: 0 }, { x: -10, y: 0 }, { x: -5, y: 0 }, { x: 0, y: 0 }, { x: 0, y: -5 }, { x: 0, y: -10 }, { x: 0, y: -15 }, { x: 0, y: -20 }, { x: 0, y: -25 }, { x: 0, y: -30 }, { x: 0, y: -35 }, { x: 0, y: -40 }, { x: 0, y: -45 }, { x: 0, y: -50 }, { x: -5, y: -50 }, { x: -10, y: -50 }, { x: -15, y: -50 }, { x: -20, y: -50 }, { x: -25, y: -50 }, { x: -30, y: -50 }, { x: -35, y: -50 }, { x: -40, y: -50 }, { x: -45, y: -50 }, { x: -50, y: -50 }, { x: -50, y: -45 }, { x: -50, y: -40 }, { x: -50, y: -35 }, { x: -50, y: -30 }, { x: -50, y: -25 }, { x: -50, y: -20 }, { x: -50, y: -15 }, { x: -50, y: -10 }, { x: -50, y: -5 }, { x: -50, y: 0 }, { x: -45, y: 0 }, { x: -40, y: 0 }, { x: -35, y: 0 }, { x: -30, y: 0 }, { x: -25, y: 0 }, { x: -20, y: 0 }, { x: -15, y: 0 }, { x: -10, y: 0 }, { x: -5, y: 0 }, { x: 0, y: 0 }, { x: 0, y: -5 }, { x: 0, y: -10 }, { x: 0, y: -15 }, { x: 0, y: -20 }, { x: 0, y: -25 }, { x: 0, y: -30 }, { x: 0, y: -35 }, { x: 0, y: -40 }, { x: 0, y: -45 }, { x: 0, y: -50 }, { x: 5, y: -50 }, { x: 10, y: -50 }, { x: 15, y: -50 }, { x: 20, y: -50 }, { x: 25, y: -50 }, { x: 30, y: -50 }, { x: 35, y: -50 }, { x: 40, y: -50 }, { x: 45, y: -50 }, { x: 50, y: -50 }, { x: 50, y: -55 }, { x: 50, y: -60 }, { x: 50, y: -65 }, { x: 50, y: -70 }, { x: 50, y: -75 }, { x: 50, y: -80 }, { x: 50, y: -85 }, { x: 50, y: -90 }, { x: 50, y: -95 }, { x: 50, y: -100 }, { x: 45, y: -100 }, { x: 40, y: -100 }, { x: 35, y: -100 }, { x: 30, y: -100 }, { x: 25, y: -100 }, { x: 20, y: -100 }, { x: 15, y: -100 }, { x: 10, y: -100 }, { x: 5, y: -100 }, { x: 0, y: -100 }, { x: 0, y: -95 }, { x: 0, y: -90 }, { x: 0, y: -85 }, { x: 0, y: -80 }, { x: 0, y: -75 }, { x: 0, y: -70 }, { x: 0, y: -65 }, { x: 0, y: -60 }, { x: 0, y: -55 }, { x: 0, y: -50 }, { x: 5, y: -50 }, { x: 10, y: -50 }, { x: 15, y: -50 }, { x: 20, y: -50 }, { x: 25, y: -50 }, { x: 30, y: -50 }, { x: 35, y: -50 }, { x: 40, y: -50 }, { x: 45, y: -50 }, { x: 50, y: -50 }, { x: 50, y: -55 }, { x: 50, y: -60 }, { x: 50, y: -65 }, { x: 50, y: -70 }, { x: 50, y: -75 }, { x: 50, y: -80 }, { x: 50, y: -85 }, { x: 50, y: -90 }, { x: 50, y: -95 }, { x: 50, y: -100 }, { x: 55, y: -100 }, { x: 60, y: -100 }, { x: 65, y: -100 }, { x: 70, y: -100 }, { x: 75, y: -100 }, { x: 80, y: -100 }, { x: 85, y: -100 }, { x: 90, y: -100 }, { x: 95, y: -100 }, { x: 100, y: -100 }, { x: 100, y: -105 }, { x: 100, y: -110 }, { x: 100, y: -115 }, { x: 100, y: -120 }, { x: 100, y: -125 }, { x: 100, y: -130 }, { x: 100, y: -135 }, { x: 100, y: -140 }, { x: 100, y: -145 }, { x: 100, y: -150 }, { x: 95, y: -150 }, { x: 90, y: -150 }, { x: 85, y: -150 }, { x: 80, y: -150 }, { x: 75, y: -150 }, { x: 70, y: -150 }, { x: 65, y: -150 }, { x: 60, y: -150 }, { x: 55, y: -150 }, { x: 50, y: -150 }, { x: 50, y: -145 }, { x: 50, y: -140 }, { x: 50, y: -135 }, { x: 50, y: -130 }, { x: 50, y: -125 }, { x: 50, y: -120 }, { x: 50, y: -115 }, { x: 50, y: -110 }, { x: 50, y: -105 }, { x: 50, y: -100 }, { x: 55, y: -100 }, { x: 60, y: -100 }, { x: 65, y: -100 }, { x: 70, y: -100 }, { x: 75, y: -100 }, { x: 80, y: -100 }, { x: 85, y: -100 }, { x: 90, y: -100 }, { x: 95, y: -100 }, { x: 100, y: -100 }, { x: 100, y: -105 }, { x: 100, y: -110 }, { x: 100, y: -115 }, { x: 100, y: -120 }, { x: 100, y: -125 }, { x: 100, y: -130 }, { x: 100, y: -135 }, { x: 100, y: -140 }, { x: 100, y: -145 }, { x: 100, y: -150 }];
    };
    return Dibujando5CuadradosDiagonal;
})(DibujandoFiguras);
var Dibujando4CuadradosInteriores = (function (_super) {
    __extends(Dibujando4CuadradosInteriores, _super);
    function Dibujando4CuadradosInteriores() {
        _super.apply(this, arguments);
    }
    Dibujando4CuadradosInteriores.prototype.puntosSolucion = function () {
        return [{ x: -145, y: 100 }, { x: -140, y: 100 }, { x: -135, y: 100 }, { x: -130, y: 100 }, { x: -125, y: 100 }, { x: -120, y: 100 }, { x: -115, y: 100 }, { x: -110, y: 100 }, { x: -105, y: 100 }, { x: -100, y: 100 }, { x: -100, y: 95 }, { x: -100, y: 90 }, { x: -100, y: 85 }, { x: -100, y: 80 }, { x: -100, y: 75 }, { x: -100, y: 70 }, { x: -100, y: 65 }, { x: -100, y: 60 }, { x: -100, y: 55 }, { x: -100, y: 50 }, { x: -105, y: 50 }, { x: -110, y: 50 }, { x: -115, y: 50 }, { x: -120, y: 50 }, { x: -125, y: 50 }, { x: -130, y: 50 }, { x: -135, y: 50 }, { x: -140, y: 50 }, { x: -145, y: 50 }, { x: -150, y: 50 }, { x: -150, y: 55 }, { x: -150, y: 60 }, { x: -150, y: 65 }, { x: -150, y: 70 }, { x: -150, y: 75 }, { x: -150, y: 80 }, { x: -150, y: 85 }, { x: -150, y: 90 }, { x: -150, y: 95 }, { x: -150, y: 100 }, { x: -140, y: 100 }, { x: -130, y: 100 }, { x: -120, y: 100 }, { x: -110, y: 100 }, { x: -100, y: 100 }, { x: -90, y: 100 }, { x: -80, y: 100 }, { x: -70, y: 100 }, { x: -60, y: 100 }, { x: -50, y: 100 }, { x: -50, y: 90 }, { x: -50, y: 80 }, { x: -50, y: 70 }, { x: -50, y: 60 }, { x: -50, y: 50 }, { x: -50, y: 40 }, { x: -50, y: 30 }, { x: -50, y: 20 }, { x: -50, y: 10 }, { x: -50, y: 0 }, { x: -60, y: 0 }, { x: -70, y: 0 }, { x: -80, y: 0 }, { x: -90, y: 0 }, { x: -100, y: 0 }, { x: -110, y: 0 }, { x: -120, y: 0 }, { x: -130, y: 0 }, { x: -140, y: 0 }, { x: -150, y: 0 }, { x: -150, y: 10 }, { x: -150, y: 20 }, { x: -150, y: 30 }, { x: -150, y: 40 }, { x: -150, y: 50 }, { x: -150, y: 60 }, { x: -150, y: 70 }, { x: -150, y: 80 }, { x: -150, y: 90 }, { x: -150, y: 100 }, { x: -135, y: 100 }, { x: -120, y: 100 }, { x: -105, y: 100 }, { x: -90, y: 100 }, { x: -75, y: 100 }, { x: -60, y: 100 }, { x: -45, y: 100 }, { x: -30, y: 100 }, { x: -15, y: 100 }, { x: 0, y: 100 }, { x: 0, y: 85 }, { x: 0, y: 70 }, { x: 0, y: 55 }, { x: 0, y: 40 }, { x: 0, y: 25 }, { x: 0, y: 10 }, { x: 0, y: -5 }, { x: 0, y: -20 }, { x: 0, y: -35 }, { x: 0, y: -50 }, { x: -15, y: -50 }, { x: -30, y: -50 }, { x: -45, y: -50 }, { x: -60, y: -50 }, { x: -75, y: -50 }, { x: -90, y: -50 }, { x: -105, y: -50 }, { x: -120, y: -50 }, { x: -135, y: -50 }, { x: -150, y: -50 }, { x: -150, y: -35 }, { x: -150, y: -20 }, { x: -150, y: -5 }, { x: -150, y: 10 }, { x: -150, y: 25 }, { x: -150, y: 40 }, { x: -150, y: 55 }, { x: -150, y: 70 }, { x: -150, y: 85 }, { x: -150, y: 100 }, { x: -130, y: 100 }, { x: -110, y: 100 }, { x: -90, y: 100 }, { x: -70, y: 100 }, { x: -50, y: 100 }, { x: -30, y: 100 }, { x: -10, y: 100 }, { x: 10, y: 100 }, { x: 30, y: 100 }, { x: 50, y: 100 }, { x: 50, y: 80 }, { x: 50, y: 60 }, { x: 50, y: 40 }, { x: 50, y: 20 }, { x: 50, y: 0 }, { x: 50, y: -20 }, { x: 50, y: -40 }, { x: 50, y: -60 }, { x: 50, y: -80 }, { x: 50, y: -100 }, { x: 30, y: -100 }, { x: 10, y: -100 }, { x: -10, y: -100 }, { x: -30, y: -100 }, { x: -50, y: -100 }, { x: -70, y: -100 }, { x: -90, y: -100 }, { x: -110, y: -100 }, { x: -130, y: -100 }, { x: -150, y: -100 }, { x: -150, y: -80 }, { x: -150, y: -60 }, { x: -150, y: -40 }, { x: -150, y: -20 }, { x: -150, y: 0 }, { x: -150, y: 20 }, { x: -150, y: 40 }, { x: -150, y: 60 }, { x: -150, y: 80 }, { x: -150, y: 100 }];
    };
    return Dibujando4CuadradosInteriores;
})(DibujandoFiguras);
var DibujandoCabezaElefante = (function (_super) {
    __extends(DibujandoCabezaElefante, _super);
    function DibujandoCabezaElefante() {
        _super.apply(this, arguments);
    }
    DibujandoCabezaElefante.prototype.puntosSolucion = function () {
        return [{ x: -140, y: 100 }, { x: -130, y: 100 }, { x: -120, y: 100 }, { x: -110, y: 100 }, { x: -100, y: 100 }, { x: -90, y: 100 }, { x: -80, y: 100 }, { x: -70, y: 100 }, { x: -60, y: 100 }, { x: -50, y: 100 }, { x: -50, y: 90 }, { x: -50, y: 80 }, { x: -50, y: 70 }, { x: -50, y: 60 }, { x: -50, y: 50 }, { x: -50, y: 40 }, { x: -50, y: 30 }, { x: -50, y: 20 }, { x: -50, y: 10 }, { x: -50, y: 0 }, { x: -60, y: 0 }, { x: -70, y: 0 }, { x: -80, y: 0 }, { x: -90, y: 0 }, { x: -100, y: 0 }, { x: -110, y: 0 }, { x: -120, y: 0 }, { x: -130, y: 0 }, { x: -140, y: 0 }, { x: -150, y: 0 }, { x: -150, y: 10 }, { x: -150, y: 20 }, { x: -150, y: 30 }, { x: -150, y: 40 }, { x: -150, y: 50 }, { x: -150, y: 60 }, { x: -150, y: 70 }, { x: -150, y: 80 }, { x: -150, y: 90 }, { x: -150, y: 100 }, { x: -140, y: 100 }, { x: -130, y: 100 }, { x: -120, y: 100 }, { x: -110, y: 100 }, { x: -100, y: 100 }, { x: -90, y: 100 }, { x: -80, y: 100 }, { x: -70, y: 100 }, { x: -60, y: 100 }, { x: -50, y: 100 }, { x: -50, y: 90 }, { x: -50, y: 80 }, { x: -50, y: 70 }, { x: -50, y: 60 }, { x: -50, y: 50 }, { x: -50, y: 40 }, { x: -50, y: 30 }, { x: -50, y: 20 }, { x: -50, y: 10 }, { x: -50, y: 0 }, { x: -50, y: -5 }, { x: -50, y: -10 }, { x: -50, y: -15 }, { x: -50, y: -20 }, { x: -50, y: -25 }, { x: -50, y: -30 }, { x: -50, y: -35 }, { x: -50, y: -40 }, { x: -50, y: -45 }, { x: -50, y: -50 }, { x: -55, y: -50 }, { x: -60, y: -50 }, { x: -65, y: -50 }, { x: -70, y: -50 }, { x: -75, y: -50 }, { x: -80, y: -50 }, { x: -85, y: -50 }, { x: -90, y: -50 }, { x: -95, y: -50 }, { x: -100, y: -50 }, { x: -100, y: -45 }, { x: -100, y: -40 }, { x: -100, y: -35 }, { x: -100, y: -30 }, { x: -100, y: -25 }, { x: -100, y: -20 }, { x: -100, y: -15 }, { x: -100, y: -10 }, { x: -100, y: -5 }, { x: -100, y: 0 }, { x: -95, y: 0 }, { x: -90, y: 0 }, { x: -85, y: 0 }, { x: -80, y: 0 }, { x: -75, y: 0 }, { x: -70, y: 0 }, { x: -65, y: 0 }, { x: -60, y: 0 }, { x: -55, y: 0 }, { x: -50, y: 0 }, { x: -50, y: -5 }, { x: -50, y: -10 }, { x: -50, y: -15 }, { x: -50, y: -20 }, { x: -50, y: -25 }, { x: -50, y: -30 }, { x: -50, y: -35 }, { x: -50, y: -40 }, { x: -50, y: -45 }, { x: -50, y: -50 }, { x: -50, y: -55 }, { x: -50, y: -60 }, { x: -50, y: -65 }, { x: -50, y: -70 }, { x: -50, y: -75 }, { x: -50, y: -80 }, { x: -50, y: -85 }, { x: -50, y: -90 }, { x: -50, y: -95 }, { x: -50, y: -100 }, { x: -55, y: -100 }, { x: -60, y: -100 }, { x: -65, y: -100 }, { x: -70, y: -100 }, { x: -75, y: -100 }, { x: -80, y: -100 }, { x: -85, y: -100 }, { x: -90, y: -100 }, { x: -95, y: -100 }, { x: -100, y: -100 }, { x: -100, y: -95 }, { x: -100, y: -90 }, { x: -100, y: -85 }, { x: -100, y: -80 }, { x: -100, y: -75 }, { x: -100, y: -70 }, { x: -100, y: -65 }, { x: -100, y: -60 }, { x: -100, y: -55 }, { x: -100, y: -50 }, { x: -95, y: -50 }, { x: -90, y: -50 }, { x: -85, y: -50 }, { x: -80, y: -50 }, { x: -75, y: -50 }, { x: -70, y: -50 }, { x: -65, y: -50 }, { x: -60, y: -50 }, { x: -55, y: -50 }, { x: -50, y: -50 }, { x: -50, y: -55 }, { x: -50, y: -60 }, { x: -50, y: -65 }, { x: -50, y: -70 }, { x: -50, y: -75 }, { x: -50, y: -80 }, { x: -50, y: -85 }, { x: -50, y: -90 }, { x: -50, y: -95 }, { x: -50, y: -100 }, { x: -50, y: -105 }, { x: -50, y: -110 }, { x: -50, y: -115 }, { x: -50, y: -120 }, { x: -50, y: -125 }, { x: -50, y: -130 }, { x: -50, y: -135 }, { x: -50, y: -140 }, { x: -50, y: -145 }, { x: -50, y: -150 }, { x: -55, y: -150 }, { x: -60, y: -150 }, { x: -65, y: -150 }, { x: -70, y: -150 }, { x: -75, y: -150 }, { x: -80, y: -150 }, { x: -85, y: -150 }, { x: -90, y: -150 }, { x: -95, y: -150 }, { x: -100, y: -150 }, { x: -100, y: -145 }, { x: -100, y: -140 }, { x: -100, y: -135 }, { x: -100, y: -130 }, { x: -100, y: -125 }, { x: -100, y: -120 }, { x: -100, y: -115 }, { x: -100, y: -110 }, { x: -100, y: -105 }, { x: -100, y: -100 }, { x: -95, y: -100 }, { x: -90, y: -100 }, { x: -85, y: -100 }, { x: -80, y: -100 }, { x: -75, y: -100 }, { x: -70, y: -100 }, { x: -65, y: -100 }, { x: -60, y: -100 }, { x: -55, y: -100 }, { x: -50, y: -100 }, { x: -50, y: -105 }, { x: -50, y: -110 }, { x: -50, y: -115 }, { x: -50, y: -120 }, { x: -50, y: -125 }, { x: -50, y: -130 }, { x: -50, y: -135 }, { x: -50, y: -140 }, { x: -50, y: -145 }, { x: -50, y: -150 }, { x: -50, y: -155 }, { x: -50, y: -160 }, { x: -50, y: -165 }, { x: -50, y: -170 }, { x: -50, y: -175 }, { x: -50, y: -180 }, { x: -50, y: -185 }, { x: -50, y: -190 }, { x: -50, y: -195 }, { x: -50, y: -200 }, { x: -55, y: -200 }, { x: -60, y: -200 }, { x: -65, y: -200 }, { x: -70, y: -200 }, { x: -75, y: -200 }, { x: -80, y: -200 }, { x: -85, y: -200 }, { x: -90, y: -200 }, { x: -95, y: -200 }, { x: -100, y: -200 }, { x: -100, y: -195 }, { x: -100, y: -190 }, { x: -100, y: -185 }, { x: -100, y: -180 }, { x: -100, y: -175 }, { x: -100, y: -170 }, { x: -100, y: -165 }, { x: -100, y: -160 }, { x: -100, y: -155 }, { x: -100, y: -150 }, { x: -95, y: -150 }, { x: -90, y: -150 }, { x: -85, y: -150 }, { x: -80, y: -150 }, { x: -75, y: -150 }, { x: -70, y: -150 }, { x: -65, y: -150 }, { x: -60, y: -150 }, { x: -55, y: -150 }, { x: -50, y: -150 }, { x: -50, y: -155 }, { x: -50, y: -160 }, { x: -50, y: -165 }, { x: -50, y: -170 }, { x: -50, y: -175 }, { x: -50, y: -180 }, { x: -50, y: -185 }, { x: -50, y: -190 }, { x: -50, y: -195 }, { x: -50, y: -200 }];
    };
    return DibujandoCabezaElefante;
})(DibujandoFiguras);
var DibujandoHexagono = (function (_super) {
    __extends(DibujandoHexagono, _super);
    function DibujandoHexagono() {
        _super.apply(this, arguments);
    }
    DibujandoHexagono.prototype.puntosSolucion = function () {
        return [{ x: -140, y: 100 }, { x: -130, y: 100 }, { x: -120, y: 100 }, { x: -110, y: 100 }, { x: -100, y: 100 }, { x: -90, y: 100 }, { x: -80, y: 100 }, { x: -70, y: 100 }, { x: -60, y: 100 }, { x: -50, y: 100 }, { x: -45, y: 91 }, { x: -40, y: 83 }, { x: -35, y: 74 }, { x: -30, y: 65 }, { x: -25, y: 57 }, { x: -20, y: 48 }, { x: -15, y: 39 }, { x: -10, y: 31 }, { x: -5, y: 22 }, { x: 0, y: 13 }, { x: -5, y: 5 }, { x: -10, y: -4 }, { x: -15, y: -13 }, { x: -20, y: -21 }, { x: -25, y: -30 }, { x: -30, y: -39 }, { x: -35, y: -47 }, { x: -40, y: -56 }, { x: -45, y: -65 }, { x: -50, y: -73 }, { x: -60, y: -73 }, { x: -70, y: -73 }, { x: -80, y: -73 }, { x: -90, y: -73 }, { x: -100, y: -73 }, { x: -110, y: -73 }, { x: -120, y: -73 }, { x: -130, y: -73 }, { x: -140, y: -73 }, { x: -150, y: -73 }, { x: -155, y: -65 }, { x: -160, y: -56 }, { x: -165, y: -47 }, { x: -170, y: -39 }, { x: -175, y: -30 }, { x: -180, y: -21 }, { x: -185, y: -13 }, { x: -190, y: -4 }, { x: -195, y: 5 }, { x: -200, y: 13 }, { x: -195, y: 22 }, { x: -190, y: 31 }, { x: -185, y: 39 }, { x: -180, y: 48 }, { x: -175, y: 57 }, { x: -170, y: 65 }, { x: -165, y: 74 }, { x: -160, y: 83 }, { x: -155, y: 91 }, { x: -150, y: 100 }];
    };
    return DibujandoHexagono;
})(DibujandoFiguras);
var DibujandoTrianguloEquilatero = (function (_super) {
    __extends(DibujandoTrianguloEquilatero, _super);
    function DibujandoTrianguloEquilatero() {
        _super.apply(this, arguments);
    }
    DibujandoTrianguloEquilatero.prototype.puntosSolucion = function () {
        return [{ x: -140, y: 100 }, { x: -130, y: 100 }, { x: -120, y: 100 }, { x: -110, y: 100 }, { x: -100, y: 100 }, { x: -90, y: 100 }, { x: -80, y: 100 }, { x: -70, y: 100 }, { x: -60, y: 100 }, { x: -50, y: 100 }, { x: -55, y: 91 }, { x: -60, y: 83 }, { x: -65, y: 74 }, { x: -70, y: 65 }, { x: -75, y: 57 }, { x: -80, y: 48 }, { x: -85, y: 39 }, { x: -90, y: 31 }, { x: -95, y: 22 }, { x: -100, y: 13 }, { x: -105, y: 22 }, { x: -110, y: 31 }, { x: -115, y: 39 }, { x: -120, y: 48 }, { x: -125, y: 57 }, { x: -130, y: 65 }, { x: -135, y: 74 }, { x: -140, y: 83 }, { x: -145, y: 91 }, { x: -150, y: 100 }];
    };
    return DibujandoTrianguloEquilatero;
})(DibujandoFiguras);
var DibujandoPoligonosInteriores = (function (_super) {
    __extends(DibujandoPoligonosInteriores, _super);
    function DibujandoPoligonosInteriores() {
        _super.apply(this, arguments);
    }
    DibujandoPoligonosInteriores.prototype.puntosSolucion = function () {
        return [{ x: -140, y: 100 }, { x: -130, y: 100 }, { x: -120, y: 100 }, { x: -110, y: 100 }, { x: -100, y: 100 }, { x: -90, y: 100 }, { x: -80, y: 100 }, { x: -70, y: 100 }, { x: -60, y: 100 }, { x: -50, y: 100 }, { x: -55, y: 91 }, { x: -60, y: 83 }, { x: -65, y: 74 }, { x: -70, y: 65 }, { x: -75, y: 57 }, { x: -80, y: 48 }, { x: -85, y: 39 }, { x: -90, y: 31 }, { x: -95, y: 22 }, { x: -100, y: 13 }, { x: -105, y: 22 }, { x: -110, y: 31 }, { x: -115, y: 39 }, { x: -120, y: 48 }, { x: -125, y: 57 }, { x: -130, y: 65 }, { x: -135, y: 74 }, { x: -140, y: 83 }, { x: -145, y: 91 }, { x: -150, y: 100 }, { x: -140, y: 100 }, { x: -130, y: 100 }, { x: -120, y: 100 }, { x: -110, y: 100 }, { x: -100, y: 100 }, { x: -90, y: 100 }, { x: -80, y: 100 }, { x: -70, y: 100 }, { x: -60, y: 100 }, { x: -50, y: 100 }, { x: -50, y: 90 }, { x: -50, y: 80 }, { x: -50, y: 70 }, { x: -50, y: 60 }, { x: -50, y: 50 }, { x: -50, y: 40 }, { x: -50, y: 30 }, { x: -50, y: 20 }, { x: -50, y: 10 }, { x: -50, y: 0 }, { x: -60, y: 0 }, { x: -70, y: 0 }, { x: -80, y: 0 }, { x: -90, y: 0 }, { x: -100, y: 0 }, { x: -110, y: 0 }, { x: -120, y: 0 }, { x: -130, y: 0 }, { x: -140, y: 0 }, { x: -150, y: 0 }, { x: -150, y: 10 }, { x: -150, y: 20 }, { x: -150, y: 30 }, { x: -150, y: 40 }, { x: -150, y: 50 }, { x: -150, y: 60 }, { x: -150, y: 70 }, { x: -150, y: 80 }, { x: -150, y: 90 }, { x: -150, y: 100 }, { x: -140, y: 100 }, { x: -130, y: 100 }, { x: -120, y: 100 }, { x: -110, y: 100 }, { x: -100, y: 100 }, { x: -90, y: 100 }, { x: -80, y: 100 }, { x: -70, y: 100 }, { x: -60, y: 100 }, { x: -50, y: 100 }, { x: -47, y: 90 }, { x: -44, y: 81 }, { x: -41, y: 71 }, { x: -38, y: 62 }, { x: -35, y: 52 }, { x: -31, y: 43 }, { x: -28, y: 33 }, { x: -25, y: 24 }, { x: -22, y: 14 }, { x: -19, y: 5 }, { x: -27, y: -1 }, { x: -35, y: -7 }, { x: -43, y: -13 }, { x: -51, y: -19 }, { x: -60, y: -24 }, { x: -68, y: -30 }, { x: -76, y: -36 }, { x: -84, y: -42 }, { x: -92, y: -48 }, { x: -100, y: -54 }, { x: -108, y: -48 }, { x: -116, y: -42 }, { x: -124, y: -36 }, { x: -132, y: -30 }, { x: -140, y: -24 }, { x: -149, y: -19 }, { x: -157, y: -13 }, { x: -165, y: -7 }, { x: -173, y: -1 }, { x: -181, y: 5 }, { x: -178, y: 14 }, { x: -175, y: 24 }, { x: -172, y: 33 }, { x: -169, y: 43 }, { x: -165, y: 52 }, { x: -162, y: 62 }, { x: -159, y: 71 }, { x: -156, y: 81 }, { x: -153, y: 90 }, { x: -150, y: 100 }];
    };
    return DibujandoPoligonosInteriores;
})(DibujandoFiguras);
var DibujandoCuevaEstalagtitas = (function (_super) {
    __extends(DibujandoCuevaEstalagtitas, _super);
    function DibujandoCuevaEstalagtitas() {
        _super.apply(this, arguments);
    }
    DibujandoCuevaEstalagtitas.prototype.puntosSolucion = function () {
        return [{ x: -130, y: 100 }, { x: -110, y: 100 }, { x: -90, y: 100 }, { x: -70, y: 100 }, { x: -50, y: 100 }, { x: -30, y: 100 }, { x: -10, y: 100 }, { x: 10, y: 100 }, { x: 30, y: 100 }, { x: 50, y: 100 }, { x: 50, y: 80 }, { x: 50, y: 60 }, { x: 50, y: 40 }, { x: 50, y: 20 }, { x: 50, y: 0 }, { x: 50, y: -20 }, { x: 50, y: -40 }, { x: 50, y: -60 }, { x: 50, y: -80 }, { x: 50, y: -100 }, { x: 30, y: -100 }, { x: 10, y: -100 }, { x: -10, y: -100 }, { x: -30, y: -100 }, { x: -50, y: -100 }, { x: -70, y: -100 }, { x: -90, y: -100 }, { x: -110, y: -100 }, { x: -130, y: -100 }, { x: -150, y: -100 }, { x: -150, y: -80 }, { x: -150, y: -60 }, { x: -150, y: -40 }, { x: -150, y: -20 }, { x: -150, y: 0 }, { x: -150, y: 20 }, { x: -150, y: 40 }, { x: -150, y: 60 }, { x: -150, y: 80 }, { x: -150, y: 100 }, { x: -146, y: 100 }, { x: -142, y: 100 }, { x: -138, y: 100 }, { x: -134, y: 100 }, { x: -130, y: 100 }, { x: -126, y: 100 }, { x: -122, y: 100 }, { x: -118, y: 100 }, { x: -114, y: 100 }, { x: -110, y: 100 }, { x: -112, y: 97 }, { x: -114, y: 93 }, { x: -116, y: 90 }, { x: -118, y: 86 }, { x: -120, y: 83 }, { x: -122, y: 79 }, { x: -124, y: 76 }, { x: -126, y: 72 }, { x: -128, y: 69 }, { x: -130, y: 65 }, { x: -132, y: 69 }, { x: -134, y: 72 }, { x: -136, y: 76 }, { x: -138, y: 79 }, { x: -140, y: 83 }, { x: -142, y: 86 }, { x: -144, y: 90 }, { x: -146, y: 93 }, { x: -148, y: 97 }, { x: -150, y: 100 }, { x: -146, y: 100 }, { x: -142, y: 100 }, { x: -138, y: 100 }, { x: -134, y: 100 }, { x: -130, y: 100 }, { x: -126, y: 100 }, { x: -122, y: 100 }, { x: -118, y: 100 }, { x: -114, y: 100 }, { x: -110, y: 100 }, { x: -104, y: 100 }, { x: -98, y: 100 }, { x: -92, y: 100 }, { x: -86, y: 100 }, { x: -80, y: 100 }, { x: -74, y: 100 }, { x: -68, y: 100 }, { x: -62, y: 100 }, { x: -56, y: 100 }, { x: -50, y: 100 }, { x: -53, y: 95 }, { x: -56, y: 90 }, { x: -59, y: 84 }, { x: -62, y: 79 }, { x: -65, y: 74 }, { x: -68, y: 69 }, { x: -71, y: 64 }, { x: -74, y: 58 }, { x: -77, y: 53 }, { x: -80, y: 48 }, { x: -83, y: 53 }, { x: -86, y: 58 }, { x: -89, y: 64 }, { x: -92, y: 69 }, { x: -95, y: 74 }, { x: -98, y: 79 }, { x: -101, y: 84 }, { x: -104, y: 90 }, { x: -107, y: 95 }, { x: -110, y: 100 }, { x: -104, y: 100 }, { x: -98, y: 100 }, { x: -92, y: 100 }, { x: -86, y: 100 }, { x: -80, y: 100 }, { x: -74, y: 100 }, { x: -68, y: 100 }, { x: -62, y: 100 }, { x: -56, y: 100 }, { x: -50, y: 100 }, { x: -40, y: 100 }, { x: -30, y: 100 }, { x: -20, y: 100 }, { x: -10, y: 100 }, { x: 0, y: 100 }, { x: 10, y: 100 }, { x: 20, y: 100 }, { x: 30, y: 100 }, { x: 40, y: 100 }, { x: 50, y: 100 }, { x: 45, y: 91 }, { x: 40, y: 83 }, { x: 35, y: 74 }, { x: 30, y: 65 }, { x: 25, y: 57 }, { x: 20, y: 48 }, { x: 15, y: 39 }, { x: 10, y: 31 }, { x: 5, y: 22 }, { x: 0, y: 13 }, { x: -5, y: 22 }, { x: -10, y: 31 }, { x: -15, y: 39 }, { x: -20, y: 48 }, { x: -25, y: 57 }, { x: -30, y: 65 }, { x: -35, y: 74 }, { x: -40, y: 83 }, { x: -45, y: 91 }, { x: -50, y: 100 }];
    };
    return DibujandoCuevaEstalagtitas;
})(DibujandoFiguras);
/// <reference path = "EscenaActividad.ts" />
/// <reference path="../comportamientos/RecogerPorEtiqueta.ts"/>
/// <reference path="../actores/CuadriculaEsparsa.ts"/>
/// <reference path="../actores/GloboAnimado.ts"/>
/// <reference path="../actores/CangrejoAnimado.ts"/>
/// <reference path = "../comportamientos/RecogerPorEtiqueta.ts" />}
var ElCangrejoAguafiestas = (function (_super) {
    __extends(ElCangrejoAguafiestas, _super);
    function ElCangrejoAguafiestas() {
        _super.apply(this, arguments);
    }
    ElCangrejoAguafiestas.prototype.iniciar = function () {
        this.fondo = new Fondo('fondo.cangrejo_aguafiestas.png', 0, 0);
        this.cantidadFilas = 5;
        this.cantidadColumnas = 6;
        var matriz = [
            ['T', 'T', 'T', 'T', 'T', 'T'],
            ['T', 'F', 'F', 'F', 'F', 'T'],
            ['T', 'T', 'T', 'T', 'T', 'T'],
            ['T', 'F', 'F', 'F', 'F', 'T'],
            ['T', 'T', 'T', 'T', 'T', 'T']];
        this.cuadricula = new CuadriculaEsparsa(0, 15, { alto: 360, ancho: 400 }, { grilla: 'casilla.cangrejo_aguafiestas.png' }, matriz);
        this.completarConGlobos();
        this.automata = new CangrejoAnimado(0, 0);
        this.automata.escala *= 1.2;
        this.cuadricula.agregarActor(this.automata, 0, 0);
        this.estado = new EstadoParaContarBuilder('explotar', 18).estadoInicial();
    };
    ElCangrejoAguafiestas.prototype.completarConGlobos = function () {
        var _this = this;
        this.cuadricula.casillas.forEach(function (c) { if (!c.esEsquina())
            _this.agregarGlobo(c.nroFila, c.nroColumna); });
    };
    ElCangrejoAguafiestas.prototype.agregarGlobo = function (fila, col) {
        var globo = new GloboAnimado();
        this.cuadricula.agregarActor(globo, fila, col, false);
        globo.y += 20;
        globo.escala *= 0.8;
        globo.aprender(Flotar, { Desvio: 5 });
    };
    return ElCangrejoAguafiestas;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/Detective.ts" />
/// <reference path = "../actores/Sospechoso.ts" />
/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../habilidades/Flotar.ts" />
/// <reference path = "../comportamientos/Decir.ts" />
var ElDetectiveChaparro = (function (_super) {
    __extends(ElDetectiveChaparro, _super);
    function ElDetectiveChaparro() {
        _super.apply(this, arguments);
    }
    ElDetectiveChaparro.prototype.iniciar = function () {
        var _this = this;
        this.fondo = new Fondo('fondo.detective.png', 0, 0);
        this.cuadricula = new Cuadricula(0, -30, 1, 7, { ancho: 400, alto: 400 }, { grilla: 'invisible.png', cantColumnas: 1 });
        Sospechoso.reiniciarDisfraces();
        var nroCulpable = Math.floor(Math.random() * 7);
        [0, 1, 2, 3, 4, 5, 6].forEach(function (pos) {
            var sospechoso = new Sospechoso();
            _this.cuadricula.agregarActor(sospechoso, 0, pos, false);
            if (pos === nroCulpable)
                _this.culpable = sospechoso;
        });
        this.culpable.hacerCulpable();
        this.automata = new Detective();
        this.cuadricula.agregarActor(this.automata, 0, Math.floor(Math.random() * 7), false);
        this.automata.y = -100;
        this.automata.aprender(Flotar, {});
    };
    ElDetectiveChaparro.prototype.estaResueltoElProblema = function () {
        return this.automata.casillaActual() === this.culpable.casillaActual() &&
            this.culpable.teEncontraron();
    };
    return ElDetectiveChaparro;
})(EscenaActividad);
var SacarDisfraz = (function (_super) {
    __extends(SacarDisfraz, _super);
    function SacarDisfraz() {
        _super.apply(this, arguments);
    }
    SacarDisfraz.prototype.iniciar = function (receptorDetective) {
        this.argumentos.receptor = receptorDetective.obtenerActorBajoLaLupa();
        this.argumentos.receptor.sacarDisfraz();
        this.argumentos.mensaje = this.argumentos.receptor.mensajeAlSacarDisfraz();
        _super.prototype.iniciar.call(this, receptorDetective);
    };
    return SacarDisfraz;
})(Decir);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/GatoAnimado.ts" />}
var ElGatoEnLaCalle = (function (_super) {
    __extends(ElGatoEnLaCalle, _super);
    function ElGatoEnLaCalle() {
        _super.apply(this, arguments);
    }
    ElGatoEnLaCalle.prototype.iniciar = function () {
        this.fondo = new Fondo('fondo.gatoEnLaCalle.png', 0, 0);
        this.automata = new GatoAnimado(0, -150);
    };
    ElGatoEnLaCalle.prototype.estaResueltoElProblema = function () {
        return true; // Como este ejercicio es de exploración, cualquier solución sería buena.
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
        var _this = this;
        this.estado = new Estado(function () { return _this.cantidadObjetosConEtiqueta('ManzanaAnimada') == 0; });
        this.fondo = new Fondo('fondo.elMarcianoEnElDesierto.png', 0, 0);
        var cantidadFilas = 4;
        var cantidadColumnas = 5;
        this.cuadricula = new Cuadricula(0, -9, cantidadFilas, cantidadColumnas, { alto: 262, ancho: 330 }, { grilla: 'invisible.png' });
        this.manzanas = [];
        var posiciones = [[0, 0], [0, 2], [0, 4], [1, 4], [2, 4], [3, 2], [3, 1]];
        for (var i = 0; i < posiciones.length; i++) {
            var objeto = new ManzanaAnimada(0, 0, false);
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
/// <reference path="../actores/ManzanaAnimada.ts"/>
/// <reference path="../actores/BananaAnimada.ts"/>
/// <reference path="../actores/MonoAnimado.ts"/>
/// <reference path="../actores/Tablero.ts"/>
/// <reference path="../actores/ObservadoAnimado.ts"/>
var ElMonoQueSabeContar = (function (_super) {
    __extends(ElMonoQueSabeContar, _super);
    function ElMonoQueSabeContar() {
        _super.apply(this, arguments);
    }
    ElMonoQueSabeContar.prototype.iniciar = function () {
        this.fondo = new Fondo('fondos.selva.png', 0, 0);
        this.cuadricula = new CuadriculaMultipleColumnas(new DefinidorColumnasRandom(5, 6), 0, -45, { separacionEntreCasillas: 5 }, { alto: 40, ancho: 40, grilla: 'casillamediomono.png', cantColumnas: 1 });
        this.cuadricula.cambiarImagenInicio('casillainiciomono.png');
        this.cambiarImagenesFin();
        this.cuadricula.completarConObjetosRandom(new ConjuntoClases([ManzanaAnimada, BananaAnimada]), { condiciones: [
                function (fila, col, pmatrix) { return fila != 0; },
                //no incluye en primera fila
                function (fila, col, pmatrix) { return pmatrix[fila + 1] != undefined && pmatrix[fila + 1][col] == 'T'; }
            ] });
        this.automata = new MonoAnimado(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata, 0, 0);
        this.automata.escala *= 1.5;
        this.tableros = {};
        this.tableros.ManzanaAnimada = new Tablero(150, 210, { texto: "Manzanas" });
        this.tableros.BananaAnimada = new Tablero(-150, 210, { texto: "Bananas" });
    };
    ElMonoQueSabeContar.prototype.cambiarImagenesFin = function () {
        this.cuadricula.cambiarImagenFin('casillafinalmono.png');
    };
    ElMonoQueSabeContar.prototype.estaResueltoElProblema = function () {
        return this.cantidadObjetosConEtiqueta('BananaAnimada') === this.tableros.BananaAnimada.dameValor() &&
            this.cantidadObjetosConEtiqueta('ManzanaAnimada') === this.tableros.ManzanaAnimada.dameValor();
    };
    return ElMonoQueSabeContar;
})(EscenaActividad);
/// <reference path="ElMonoQueSabeContar.ts"/>
var ElMonoCuentaDeNuevo = (function (_super) {
    __extends(ElMonoCuentaDeNuevo, _super);
    function ElMonoCuentaDeNuevo() {
        _super.apply(this, arguments);
    }
    ElMonoCuentaDeNuevo.prototype.iniciar = function () {
        _super.prototype.iniciar.call(this);
        this.tableros.largoFila = new Tablero(0, 210, { texto: "Largo Columna Actual", atributoObservado: 'largoColumnaActual2' });
        Trait.toObject(Observado, this.automata);
        this.automata.largoColumnaActual2 = function () { return this.largoColumnaActual() - 1; };
        this.automata.registrarObservador(this.tableros.largoFila);
        this.automata.setCasillaActualViejo = this.automata.setCasillaActual;
        this.automata.setCasillaActual = function (c, m) {
            this.setCasillaActualViejo(c, m);
            this.changed();
        };
        this.automata.changed();
    };
    ElMonoCuentaDeNuevo.prototype.cambiarImagenesFin = function () {
        //No hace nada
    };
    return ElMonoCuentaDeNuevo;
})(ElMonoQueSabeContar);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/BananaAnimada.ts" />
/// <reference path = "../actores/ManzanaAnimada.ts" />
/// <reference path = "../actores/MonoAnimado.ts" />
/// <reference path = "../actores/FlechaEscenarioAleatorio.ts" />
/// <reference path = "../comportamientos/RecogerPorEtiqueta.ts" />
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts" />
var LaEleccionDelMono = (function (_super) {
    __extends(LaEleccionDelMono, _super);
    function LaEleccionDelMono() {
        _super.apply(this, arguments);
    }
    LaEleccionDelMono.prototype.iniciar = function () {
        var _this = this;
        this.estado = new Estado(function () { return _this.cantidadObjetosConEtiqueta('BananaAnimada') == 0 && _this.cantidadObjetosConEtiqueta('ManzanaAnimada') == 0 && _this.automata.casillaActual().sos(0, 1); });
        this.fondo = new Fondo('fondos.selva.png', 0, 0);
        this.cuadricula = new Cuadricula(0, 0, 1, 2, { alto: 200 }, { grilla: 'casillas.violeta.png',
            cantColumnas: 1 });
        this.automata = new MonoAnimado(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata, 0, 0, false);
        this.agregarFruta();
        new FlechaEscenarioAleatorio();
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
        //this.recolector.izquierda = pilas.izquierda();
        this.cantidadFilas = 4;
        this.cantidadColumnas = 5;
        this.fondo = new Fondo('fondos.elPlanetaDeNano.png', 0, 0);
        this.cuadricula = new Cuadricula(0, 0, this.cantidadFilas, this.cantidadColumnas, { alto: 300, ancho: 300, separacionEntreCasillas: 3 }, { grilla: 'casillas.elPlanetaDeNano.png' });
        this.automata = new NanoAnimado(0, 0);
        this.cuadricula.agregarActor(this.automata, this.cantidadFilas - 1, 0);
        this.automata.escala *= 1.8;
        this.automata.y += 15;
        this.secuenciaCaminata = new Secuencia({ 'secuencia': [new MoverACasillaIzquierda({})] });
        this.secuenciaCaminata.iniciar(this.automata);
        this.completarConBananas();
        this.cantidadInicial = this.contarActoresConEtiqueta('BananaAnimada');
        this.tablero = new Tablero(150, 220, { texto: "Bananas" });
    };
    ElPlanetaDeNano.prototype.actualizar = function () {
        _super.prototype.actualizar.call(this);
        this.tablero.setearValor(this.cantidadRecolectadas());
    };
    ElPlanetaDeNano.prototype.cantidadRecolectadas = function () {
        var cantidadActual = this.contarActoresConEtiqueta('BananaAnimada');
        return this.cantidadInicial - cantidadActual;
    };
    ElPlanetaDeNano.prototype.completarConBananas = function () {
        var cantidad = [2, 4, 1, 3];
        for (var i = 0; i < this.cantidadFilas; i++) {
            for (var j = 1; j <= cantidad[i]; j++) {
                this.cuadricula.agregarActor(new BananaAnimada(0, 0), i, j);
            }
        }
    };
    ElPlanetaDeNano.prototype.estaResueltoElProblema = function () {
        return this.contarActoresConEtiqueta('BananaAnimada') == 0;
    };
    return ElPlanetaDeNano;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/RecolectorEstrellas.ts" />
/// <reference path = "../habilidades/Flotar.ts" />
var ElRecolectorDeEstrellas = (function (_super) {
    __extends(ElRecolectorDeEstrellas, _super);
    function ElRecolectorDeEstrellas() {
        _super.apply(this, arguments);
    }
    ElRecolectorDeEstrellas.prototype.iniciar = function () {
        var _this = this;
        this.estado = new Estado(function () { return _this.cantidadObjetosConEtiqueta('EstrellaAnimada') == 0; });
        this.fondo = new Fondo('fondo.recolector.png', 0, 0);
        //this.recolector.izquierda = pilas.izquierda();
        var cantidadFilas = 4;
        var cantidadColumnas = 5;
        this.cuadricula = new Cuadricula(0, -20, cantidadFilas, cantidadColumnas, { alto: 400 }, {
            grilla: 'invisible.png',
            cantColumnas: 1
        });
        this.automata = new RecolectorEstrellas(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata, cantidadFilas - 1, 0);
        this.automata.aprender(Flotar, { Desvio: 5 });
        // La posición inicial pretende respectar el ejemplo
        this.objetos = [];
        for (var fila = 0; fila < cantidadFilas; fila++) {
            for (var columna = 1; columna < cantidadColumnas; columna++) {
                var objeto = new EstrellaAnimada(0, 0);
                this.cuadricula.agregarActor(objeto, fila, columna);
                objeto.escala *= 0.7;
                this.objetos.push(objeto);
            }
        }
    };
    return ElRecolectorDeEstrellas;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
/// <reference path="../actores/ActorAnimado.ts"/>
/// <reference path = "EstadosDeEscena.ts" />
var FutbolRobots = (function (_super) {
    __extends(FutbolRobots, _super);
    function FutbolRobots() {
        _super.apply(this, arguments);
    }
    FutbolRobots.prototype.iniciar = function () {
        this.fondo = new Fondo('fondos.futbolRobots.png', 0, 0);
        this.cantidadFilas = 8;
        this.cuadricula = new CuadriculaMultiple(new DefinidorColumnasRandom(this.cantidadFilas, 6), 0, -50, { separacionEntreCasillas: 5 }, { grilla: 'casilla.futbolRobots2.png', alto: 40, ancho: 40 });
        this.cuadricula.cambiarImagenInicio('casilla.futbolRobots1.png');
        this.automata = new RobotAnimado(0, 0);
        this.cuadricula.agregarActor(this.automata, 0, 0);
        var casilla = this.cuadricula.casilla(0, 0);
        this.automata.escalarAAlto(3.5 * casilla.alto);
        this.automata.abajo = casilla.y - (0.25 * casilla.alto);
        this.automata.radio_de_colision = this.automata.alto / 2.5;
        for (var fila = 0; fila < this.cantidadFilas; ++fila) {
            this.cuadricula.agregarActor(new PelotaAnimada(0, 0), fila, this.cuadricula.dameIndexUltimaPosicion(fila));
        }
        ;
        this.estado = new EstadoParaContarBuilder('patear', this.cantidadFilas).estadoInicial();
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
        builder.agregarEstadoAceptacion('todoInstalado');
        builder.agregarTransicionesIteradas('prendido', 'escritoA', 'escribirA', 1, 3, 1, 3);
        builder.agregarTransicionesIteradas('escritoA', 'escritoB', 'escribirB', 1, 3, 1, 3);
        builder.agregarTransicionesIteradas('escritoB', 'escritoC', 'escribirC', 1, 3, 1, 3);
        builder.agregarTransicionesIteradas('escritoC', 'juegoInstalado', 'instalar', 1, 3, 1, 3);
        builder.agregarTransicionesIteradas('juegoInstalado', 'maquinaApagada', 'apagar', 1, 2, 1, 2);
        builder.agregarTransicion('juegoInstalado3', 'todoInstalado', 'apagar');
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
        this.automata.y = -70;
        this.automata.x = -170;
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
        if (this.argumentos['idTransicion'] == 'escribirC') {
            objetoColision.hacer_luego(ComportamientoAnimado, { nombreAnimacion: "claveok", mantenerAnimacion: true });
        }
    };
    return EscribirEnCompuAnimada;
})(ComportamientoColision);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/Frank.ts" />
/// <reference path = "../actores/Bruja.ts" />
/// <reference path = "../actores/Dracula.ts" />
/// <reference path = "../actores/Tito.ts" />
/// <reference path = "../actores/Murcielago.ts" />
/// <reference path = "../habilidades/Flotar.ts" />
/// <reference path = "../comportamientos/SecuenciaAnimada.ts" />
/// <reference path = "../comportamientos/ComportamientoColision.ts" />
var LaFiestaDeDracula = (function (_super) {
    __extends(LaFiestaDeDracula, _super);
    function LaFiestaDeDracula() {
        _super.apply(this, arguments);
        this.focos = [];
        this.bailarines = [];
    }
    LaFiestaDeDracula.prototype.iniciar = function () {
        this.fondo = new Fondo('fondo.fiestadracula.png', 0, 0);
        this.cuadricula = new Cuadricula(0, 200, 1, 3, { alto: 100 }, { grilla: 'invisible.png', cantColumnas: 1 });
        this.agregarAutomata();
        this.agregarFocos();
        this.agregarBailarines();
        this.crearEstado();
    };
    LaFiestaDeDracula.prototype.agregarAutomata = function () {
        this.automata = new Murcielago();
        this.cuadricula.agregarActor(this.automata, 0, 0, false);
        this.automata.y -= 120;
        this.automata.aprender(Flotar, { Desvio: 10 });
    };
    LaFiestaDeDracula.prototype.agregarFocos = function () {
        this.focos.push(new Foco());
        this.focos.push(new Foco());
        this.focos.push(new Foco());
        this.cuadricula.agregarActor(this.focos[0], 0, 0, false);
        this.cuadricula.agregarActor(this.focos[1], 0, 1, false);
        this.cuadricula.agregarActor(this.focos[2], 0, 2, false);
        this.focos.forEach(function (f) { return f.y -= 30; });
    };
    LaFiestaDeDracula.prototype.agregarBailarines = function () {
        this.bailarines.push(new Frank(-150, -150));
        this.bailarines.push(new Bruja(-50, -150));
        var tito = new Tito(50, -150);
        tito.definirAnimacion("parado", [0], 6, true);
        this.bailarines.push(tito);
        this.bailarines.push(new Dracula(150, -150));
        this.bailarines.forEach(function (b) { return b.escala = 0.7; });
    };
    LaFiestaDeDracula.prototype.crearEstado = function () {
        var builder = new BuilderStatePattern('nadieBaila');
        builder.agregarEstadoAceptacion('todosBailando');
        builder.agregarTransicion('nadieBaila', 'todosBailando', 'empezarFiesta');
        this.estado = builder.estadoInicial();
    };
    return LaFiestaDeDracula;
})(EscenaActividad);
var CambiarColor = (function (_super) {
    __extends(CambiarColor, _super);
    function CambiarColor() {
        _super.apply(this, arguments);
    }
    CambiarColor.prototype.sanitizarArgumentos = function () {
        this.argumentos.etiqueta = "Foco";
        _super.prototype.sanitizarArgumentos.call(this);
    };
    CambiarColor.prototype.metodo = function (foco) {
        foco.cambiarColor();
    };
    return CambiarColor;
})(ComportamientoColision);
var EmpezarFiesta = (function (_super) {
    __extends(EmpezarFiesta, _super);
    function EmpezarFiesta() {
        _super.apply(this, arguments);
    }
    EmpezarFiesta.prototype.sanitizarArgumentos = function () {
        _super.prototype.sanitizarArgumentos.call(this);
        var dracula = pilas.escena_actual().bailarines[pilas.escena_actual().bailarines.length - 1];
        this.argumentos.secuencia = [
            new Desaparecer({}),
            new ComportamientoConVelocidad({ receptor: dracula, nombreAnimacion: "aparecer" }),
        ];
    };
    EmpezarFiesta.prototype.configurarVerificaciones = function () {
        _super.prototype.configurarVerificaciones.call(this);
        this.agregarVerificacionFoco(0, 5, "primer");
        this.agregarVerificacionFoco(1, 8, "segundo");
        this.agregarVerificacionFoco(2, 12, "tercer");
    };
    EmpezarFiesta.prototype.agregarVerificacionFoco = function (i, veces, ordinal) {
        this.verificacionesPre.push(new Verificacion(function () { return pilas.escena_actual().focos[i].nombreAnimacionActual() === "color" + veces; }, "¡El " + ordinal + " foco debe cambiarse de color " + veces + " veces!"));
    };
    EmpezarFiesta.prototype.postAnimacion = function () {
        _super.prototype.postAnimacion.call(this);
        pilas.escena_actual().bailarines.forEach(function (b) { return b.cargarAnimacion("bailando"); });
    };
    return EmpezarFiesta;
})(SecuenciaAnimada);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../comportamientos/Sostener.ts"/>
/// <reference path = "../actores/Cuadricula.ts"/>
/// <reference path = "../actores/HeroeAnimado.ts"/>
/// <reference path = "../actores/CofreAnimado.ts"/>
/// <reference path = "../actores/LlaveAnimado.ts"/>
/// <reference path = "../actores/MagoAnimado.ts"/>
/// <reference path = "../actores/CaballeroAnimado.ts"/>
/// <reference path = "../actores/UnicornioAnimado.ts"/>
/// <reference path = "../actores/ActorCompuesto.ts" />
/// <reference path = "../actores/Princesa.ts" />
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
        this.fondo = new Fondo('fondo.marEncantado.png', 0, 0);
        this.cuadricula = new Cuadricula(0, 0, 4, 5, { alto: 376, ancho: 380 }, { grilla: 'invisible.png' });
        this.llave = new LlaveAnimado(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.llave, 1, 4);
        this.llave.escala *= 0.5;
        this.llave.aprender(Flotar, { Desvio: 5 });
        this.cofre = new CofreAnimado(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.cofre, 0, 0);
        this.cofre.x += 8;
        this.cofre.aprender(Flotar, { Desvio: 5 });
        this.caballero = new CaballeroAnimado(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.caballero, 1, 2);
        this.caballero.x += 19;
        this.caballero.escala *= 1.5;
        this.princesa = new Principe(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.princesa, 1, 2);
        this.princesa.x -= 19;
        this.princesa.escala *= 1.5;
        this.mago = new MagoAnimado(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.mago, 3, 1);
        this.mago.escala *= 1.5;
        this.unicornio = new UnicornioAnimado(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.unicornio, 3, 4);
        this.unicornio.escala *= 1.5;
        this.automata = new ActorCompuesto(0, 0, { subactores: [new Heroina(0, 0)] });
        this.cuadricula.agregarActorEnPerspectiva(this.automata, 3, 0);
        this.automata.escala *= 0.08;
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
        builder.agregarTransicion('princesaRescatada', 'montandoUnicornio', 'escapar');
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
                builder.agregarError(estados[i], 'escaparEnUnicornio', 'Para escapar en unicornio, debés rescatar al príncipe.');
            }
        }
        this.estado = builder.estadoInicial();
    };
    return LaGranAventuraDelMarEncantado;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "Camino.ts" />
/// <reference path = "../actores/RatonAnimado.ts" />
var LaberintoLargo = (function (_super) {
    __extends(LaberintoLargo, _super);
    function LaberintoLargo() {
        _super.apply(this, arguments);
    }
    LaberintoLargo.prototype.iniciar = function () {
        this.fondo = new Fondo(this.nombreFondo(), 0, 0);
        this.cuadricula = new CuadriculaParaRaton(0, 0, this.cantidadFilas(), this.cantidadColumnas(), this.dameOpcionesCuadricula(), { '->': 'casillaDerecha.png', '<-': 'casillaIzquierda.png', 'v': 'casillaAbajo.png', '^': 'casillaArriba.png' }).dameCamino();
        this.automata = new RatonAnimado(0, 0);
        this.cuadricula.agregarActor(this.automata, 0, 0);
        this.automata.escala *= 2;
        this.automata.x -= 5;
    };
    LaberintoLargo.prototype.dameOpcionesCuadricula = function () {
        return { 'alto': 440, 'ancho': 400 };
    };
    LaberintoLargo.prototype.cantidadFilas = function () {
        return 8;
    };
    LaberintoLargo.prototype.cantidadColumnas = function () {
        return 8;
    };
    LaberintoLargo.prototype.nombreFondo = function () {
        return 'fondo.laberinto.largo.png';
    };
    LaberintoLargo.prototype.estaResueltoElProblema = function () {
        return this.automata.alFinalDelCamino();
    };
    return LaberintoLargo;
})(EscenaActividad);
/// <reference path = "LaberintoLargo.ts" />
/// <reference path="../actores/RatonAnimado.ts"/>
var LaberintoConQueso = (function (_super) {
    __extends(LaberintoConQueso, _super);
    function LaberintoConQueso() {
        _super.apply(this, arguments);
    }
    LaberintoConQueso.prototype.iniciar = function () {
        _super.prototype.iniciar.call(this);
        this.cuadricula.completarConObjetosRandom(new ConjuntoClases([QuesoAnimado]), { condiciones: [
                function (fila, col, pmatrix) { return !(fila == 0 && col == 0); },
                function (fila, col, pmatrix) {
                    return (pmatrix[fila + 1] != undefined && pmatrix[fila + 1][col] == 'T') ||
                        (pmatrix[fila][col + 1] == 'T');
                }
            ]
        });
        this.automata.setZ(pilas.escena_actual().minZ() - 1);
    };
    LaberintoConQueso.prototype.dameOpcionesCuadricula = function () {
        return { 'alto': 440, 'ancho': 400, 'largo_min': 3, 'largo_max': 15 };
    };
    LaberintoConQueso.prototype.nombreFondo = function () {
        return 'fondo.laberinto.queso.png';
    };
    LaberintoConQueso.prototype.estaResueltoElProblema = function () {
        return this.automata.alFinalDelCamino() && this.contarActoresConEtiqueta('QuesoAnimado') == 0;
    };
    return LaberintoConQueso;
})(LaberintoLargo);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../escenas/LaberintoLargo.ts"/>
var LaberintoCorto = (function (_super) {
    __extends(LaberintoCorto, _super);
    function LaberintoCorto() {
        _super.apply(this, arguments);
    }
    LaberintoCorto.prototype.iniciar = function () {
        this.aDerecha = Math.random() < 0.5;
        _super.prototype.iniciar.call(this);
    };
    LaberintoCorto.prototype.cantidadFilas = function () {
        return this.aDerecha ? 1 : 2;
    };
    LaberintoCorto.prototype.cantidadColumnas = function () {
        return this.aDerecha ? 2 : 1;
    };
    LaberintoCorto.prototype.nombreFondo = function () {
        return 'fondo.laberinto.corto.png';
    };
    LaberintoCorto.prototype.dameOpcionesCuadricula = function () {
        return { 'alto': 200, 'ancho': 200 };
    };
    return LaberintoCorto;
})(LaberintoLargo);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/MariaAnimada.ts" />
/// <reference path = "../actores/Cuadricula.ts" />
var MariaLaComeSandias = (function (_super) {
    __extends(MariaLaComeSandias, _super);
    function MariaLaComeSandias() {
        _super.apply(this, arguments);
    }
    MariaLaComeSandias.prototype.iniciar = function () {
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
    MariaLaComeSandias.prototype.estaResueltoElProblema = function () {
        return this.contarActoresConEtiqueta('SandiaAnimada') == 0;
    };
    return MariaLaComeSandias;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../comportamientos/SaltarHablando.ts" />
/// <reference path = "../actores/GatoAnimado.ts" />
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
        this.automata = new GatoAnimado(0, -17);
        this.saltosFaltantes = 30;
    };
    NoMeCansoDeSaltar.prototype.fraseAlSaltar = function () {
        this.saltosFaltantes--;
        if (this.saltosFaltantes > 0)
            return "Faltan " + this.saltosFaltantes + " saltos";
        if (this.saltosFaltantes == 0)
            return "¡Ya salté todo lo necesario!";
        throw new ActividadError("¡Uy! Salté mucho... ¡Me pasé!");
    };
    NoMeCansoDeSaltar.prototype.estaResueltoElProblema = function () {
        return this.saltosFaltantes == 0;
    };
    return NoMeCansoDeSaltar;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/InstaladorAnimado.ts" />
/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/CompuAnimada.ts" />
var PrendiendoLasCompus = (function (_super) {
    __extends(PrendiendoLasCompus, _super);
    function PrendiendoLasCompus() {
        _super.apply(this, arguments);
    }
    PrendiendoLasCompus.prototype.iniciar = function () {
        this.compus = [];
        this.cantidadMaxColumnas = 12;
        this.cantidadMinColumnas = 4;
        this.cantidadMaxFilas = 10;
        this.cantidadMinFilas = 5;
        this.ladoCasilla = 30;
        this.fondo = new Fondo('fondo.prendiendoLasCompus.png', 0, 0);
        this.cantidadFilas = Math.floor(this.cantidadMinFilas + (Math.random() * (this.cantidadMaxFilas - this.cantidadMinFilas)));
        this.cantidadColumnas = Math.floor(this.cantidadMinColumnas + (Math.random() * (this.cantidadMaxColumnas - this.cantidadMinColumnas)));
        this.cuadricula = new Cuadricula(0, (this.ladoCasilla + 2) * 2, this.cantidadFilas, this.cantidadColumnas, { separacionEntreCasillas: 2 }, { grilla: 'casilla.prendiendoLasCompus.png', alto: this.ladoCasilla, ancho: this.ladoCasilla });
        this.automata = new InstaladorAnimado(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata, 0, 0);
        this.completarConCompusEnLaterales();
    };
    PrendiendoLasCompus.prototype.completarConCompusEnLaterales = function () {
        //Completo la primer y ultima fila
        for (var i = 1; i < this.cantidadColumnas - 1; ++i) {
            this.addCompu(0, i);
            this.addCompu(this.cantidadFilas - 1, i);
        }
        //Completo la primer y ultima columna
        for (var i = 1; i < this.cantidadFilas - 1; ++i) {
            this.addCompu(i, 0);
            this.addCompu(i, this.cantidadColumnas - 1);
        }
    };
    PrendiendoLasCompus.prototype.addCompu = function (fila, columna) {
        var compu = new CompuAnimada(0, 0);
        this.cuadricula.agregarActor(compu, fila, columna);
        this.compus.push(compu);
    };
    PrendiendoLasCompus.prototype.estaResueltoElProblema = function () {
        return this.compus.every(function (compu) { return compu.nombreAnimacionActual() === 'prendida'; });
    };
    return PrendiendoLasCompus;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/ScoutAnimado.ts" />
/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/CompuAnimada.ts" />
var PrendiendoLasFogatas = (function (_super) {
    __extends(PrendiendoLasFogatas, _super);
    function PrendiendoLasFogatas() {
        _super.apply(this, arguments);
    }
    PrendiendoLasFogatas.prototype.iniciar = function () {
        this.fogatas = [];
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
        this.cuadricula = new CuadriculaEsparsa(0, 0, { ancho: 400, alto: 400 }, { grilla: 'casillas.violeta.png' }, matriz);
        this.ladoCasilla = 30;
        this.fondo = new Fondo('fondo.BosqueDeNoche.png', 0, 0);
        this.agregarFogatas();
        this.automata = new ScoutAnimado(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata, 0, 0);
    };
    PrendiendoLasFogatas.prototype.agregarFogatas = function () {
        for (var i = 1; i < this.cantidadColumnas - 1; i++) {
            if (Math.random() < .5) {
                this.agregarFogata(0, i);
            }
            if (Math.random() < .5) {
                this.agregarFogata(this.cantidadFilas - 1, i);
            }
        }
        for (var j = 1; j < this.cantidadFilas - 1; j++) {
            if (Math.random() < .5) {
                this.agregarFogata(j, 0);
            }
            if (Math.random() < .5) {
                this.agregarFogata(j, this.cantidadColumnas - 1);
            }
        }
    };
    PrendiendoLasFogatas.prototype.agregarFogata = function (fila, columna) {
        var fogata = new FogataAnimada(0, 0);
        this.cuadricula.agregarActor(fogata, fila, columna);
        this.fogatas.push(fogata);
    };
    PrendiendoLasFogatas.prototype.estaResueltoElProblema = function () {
        return this.fogatas.every(function (fogata) {
            return (fogata.nombreAnimacionActual() === 'prendida');
        });
    };
    return PrendiendoLasFogatas;
})(EscenaActividad);
/// <reference path = "../../dependencias/pilasweb.d.ts" />
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/MarcianoAnimado.ts" />
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
        this.cuadricula = new Cuadricula(0, 0, 4, 5, { ancho: 323, alto: 261 }, { grilla: 'invisible.png',
            cantColumnas: 1 });
        this.crearActores();
        this.crearTableros();
        this.crearEstado();
    };
    ReparandoLaNave.prototype.crearActores = function () {
        this.crearAutomata();
        var lanave = new NaveAnimada();
        this.cuadricula.agregarActor(lanave, this.cuadricula.cantFilas - 1, 0);
        this.nave = new ActorCompuesto(0, 0, { subactores: [lanave] });
        this.nave.escala = 2.5;
        this.nave.y += 10;
        this.hierro = new HierroAnimado(0, 0);
        this.hierro.cantidad = 3;
        this.carbon = new CarbonAnimado(0, 0);
        this.carbon.cantidad = 3;
        this.cuadricula.agregarActor(this.hierro, 0, 0);
        this.hierro.aprender(Flotar, { Desvio: 2 });
        this.cuadricula.agregarActor(this.carbon, 0, this.cuadricula.cantColumnas - 1);
        this.carbon.aprender(Flotar, { Desvio: 2 });
    };
    ReparandoLaNave.prototype.crearAutomata = function () {
        this.automata = new ActorCompuesto(0, 0, { subactores: [new MarcianoAnimado(0, 0)] });
        this.cuadricula.agregarActorEnPerspectiva(this.automata, this.cuadricula.cantFilas - 1, 0, false);
        this.automata.escala = 0.8;
        this.automata.y += 50;
    };
    ReparandoLaNave.prototype.crearTableros = function () {
        Trait.toObject(ObservadoConDisminuir, this.carbon);
        Trait.toObject(ObservadoConDisminuir, this.hierro);
        this.hierro.registrarObservador(new Tablero(-150, 190, { texto: "Hierro" }));
        this.carbon.registrarObservador(new Tablero(150, 190, { texto: "Carbón" }));
        this.carbon.changed();
        this.hierro.changed();
    };
    ReparandoLaNave.prototype.crearEstado = function () {
        var _this = this;
        var builder = new BuilderStatePattern('faltanMateriales');
        builder.agregarEstado('naveReparada');
        builder.agregarEstadoAceptacion('haEscapado');
        builder.agregarError('faltanMateriales', 'escapar', '¡No puedo escaparme sin antes haber reparado la nave!');
        builder.agregarTransicion('faltanMateriales', 'naveReparada', 'depositar', function () { return _this.hierro.cantidad == 0 && _this.carbon.cantidad == 0; });
        builder.agregarTransicion('naveReparada', 'haEscapado', 'escapar');
        this.estado = builder.estadoInicial();
    };
    return ReparandoLaNave;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/PapaNoelAnimado.ts" />
var SalvandoLaNavidad = (function (_super) {
    __extends(SalvandoLaNavidad, _super);
    function SalvandoLaNavidad() {
        _super.apply(this, arguments);
    }
    SalvandoLaNavidad.prototype.iniciar = function () {
        this.fondo = new Fondo('fondo.salvandonavidad.png', 0, 0);
        this.cuadricula = new CuadriculaMultiple(new DefinidorColumnasFijo(5, [5, 6, 8, 4, 7]), 0, 0, { separacionEntreCasillas: 5 }, { grilla: 'casilla.futbolRobots2.png', alto: 40, ancho: 40 });
        this.cuadricula.cambiarImagenInicio('casillainiciomono.png');
        this.automata = new PapaNoelAnimado(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata, 0, 0);
        this.automata.escala *= 1.8;
    };
    SalvandoLaNavidad.prototype.estaResueltoElProblema = function () {
        return this.hayRegalosAlFinalDeLasFilas() && this.cuadricula.cantFilas === this.cantidadObjetosConEtiqueta("RegaloAnimado");
    };
    SalvandoLaNavidad.prototype.hayRegalosAlFinalDeLasFilas = function () {
        return this.ultimasCasillas().every(function (casilla) { return casilla.tieneActorConEtiqueta('RegaloAnimado'); });
    };
    SalvandoLaNavidad.prototype.ultimasCasillas = function () {
        return this.cuadricula.casillas.filter(function (casilla) { return casilla.esFin(); });
    };
    return SalvandoLaNavidad;
})(EscenaActividad);
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
        this.objetos = [];
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
        this.objetos.push(lamparin);
        this.cuadricula.agregarActor(lamparin, i, 0);
        lamparin.x += 15;
    };
    SuperTito1.prototype.pathFondo = function () {
        return 'fondo.superTito1.png';
    };
    SuperTito1.prototype.estaResueltoElProblema = function () {
        return this.objetos.every(function (o) { return o.nombreAnimacionActual() == 'prendida'; });
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
/// <reference path = "Errores.ts" />
/// <reference path = "../actores/FondoAnimado.ts"/>
/// <reference path = "../actores/Superheroe.ts"/>
/**
 * @class SuperViaje
 *
 */
var SuperViaje = (function (_super) {
    __extends(SuperViaje, _super);
    function SuperViaje() {
        _super.apply(this, arguments);
    }
    SuperViaje.prototype.iniciar = function () {
        this.fondo = new FondoAnimado('fondo.elSuperviaje.png', pilas.derecha(), 0);
        this.automata = new Superheroe();
        this.automata.aprender(Flotar, { Desvio: 10 });
        this.automata.totalKM = 15 + Math.round(Math.random() * 30);
        this.automata.restantesKM = this.automata.totalKM;
        this.automata.kmsTotales = function () {
            return this.totalKM;
        };
        this.crearTablero();
        this.automata.fraseAlVolar = function () {
            this.restantesKM--;
            if (this.restantesKM == 0)
                return "¡Llegué!";
            if (this.restantesKM == 1)
                return "¡Falta 1 kilometro!";
            if (this.restantesKM < 0)
                throw new ActividadError("Ya llegué, ¡no debo seguir volando!");
            return "¡Faltan " + this.restantesKM + " kilometros!";
        };
    };
    SuperViaje.prototype.crearTablero = function () {
        Trait.toObject(Observado, this.automata);
        var tablero = new Tablero(0, 210, { texto: "Kilómetros a recorrer", atributoObservado: 'kmsTotales' });
        this.automata.registrarObservador(tablero);
    };
    SuperViaje.prototype.estaResueltoElProblema = function () {
        return this.automata.restantesKM === 0;
    };
    return SuperViaje;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/Tito.ts" />
/// <reference path = "../actores/Lamparin.ts" />
/// <reference path = "../actores/CuadriculaEsparsa.ts" />
var TitoCuadrado = (function (_super) {
    __extends(TitoCuadrado, _super);
    function TitoCuadrado() {
        _super.apply(this, arguments);
    }
    TitoCuadrado.prototype.iniciar = function () {
        this.fondo = new Fondo('fondo.tito-cuadrado.png', 0, 0);
        this.luces = [];
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
        this.cuadricula = new CuadriculaEsparsa(0, 0, { ancho: 400, alto: 400 }, { grilla: 'casillas.violeta.png' }, matriz);
        this.agregarLuces();
        this.automata = new Tito(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata, 0, 0);
        this.automata.escala *= 1.5;
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
        var luz = new Lamparin(0, 0);
        this.luces.push(luz);
        this.cuadricula.agregarActor(luz, f, c);
    };
    TitoCuadrado.prototype.estaResueltoElProblema = function () {
        return this.luces.every(function (l) { return l.nombreAnimacionActual() == 'prendida'; });
    };
    return TitoCuadrado;
})(EscenaActividad);
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/Tito.ts" />
/// <reference path = "../actores/Lamparin.ts" />
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
        ;
        // se crea el automata
        this.automata = new Tito(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata, 4, 0);
        this.automata.escalarAAncho(this.cuadricula.anchoCasilla() * 1.5);
    };
    TitoEnciendeLuces.prototype.agregarLuz = function (fila, columna) {
        var casillaLuminosa = new Lamparin(0, 0);
        this.cuadricula.agregarActor(casillaLuminosa, fila, columna);
        this.objetos.push(casillaLuminosa);
    };
    TitoEnciendeLuces.prototype.estaResueltoElProblema = function () {
        return this.objetos.every(function (o) { return o.nombreAnimacionActual() == 'prendida'; });
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
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts"/>
/**
 * @class TresNaranjas
 *
 */
var TresNaranjas = (function (_super) {
    __extends(TresNaranjas, _super);
    function TresNaranjas() {
        _super.apply(this, arguments);
        this.objetos = [];
    }
    TresNaranjas.prototype.iniciar = function () {
        this.fondo = new Fondo('fondo.tresNaranjas.png', 0, 0);
        this.cuadricula = new Cuadricula(0, 0, 1, 4, { separacionEntreCasillas: 5 }, { grilla: 'casilla.tresNaranjas.png', ancho: 100, alto: 100 });
        //se cargan los Naranjas
        var hayAlMenosUno = false;
        for (var i = 0; i < 3; i++) {
            if (Math.random() < .5) {
                hayAlMenosUno = true;
                this.agregarNaranja(i + 1);
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
            this.agregarNaranja(columna);
        }
        // se crea el personaje
        this.automata = new MarcianoAnimado(0, 0);
        this.cuadricula.agregarActor(this.automata, 0, 0);
    };
    TresNaranjas.prototype.agregarNaranja = function (columna) {
        var objeto = new NaranjaAnimada(0, 0);
        this.cuadricula.agregarActor(objeto, 0, columna);
        this.objetos.push(objeto);
    };
    TresNaranjas.prototype.estaResueltoElProblema = function () {
        return this.contarActoresConEtiqueta('NaranjaAnimada') == 0;
    };
    return TresNaranjas;
})(EscenaActividad);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "HabilidadAnimada.ts"/>
/*Si los grados de aumento son positivos gira para la derecha
caso contrario gira para la izquierda*/
var RotarContinuamente = (function (_super) {
    __extends(RotarContinuamente, _super);
    function RotarContinuamente(receptor, argumentos) {
        _super.call(this, receptor);
        this.gradosDeAumentoStep = argumentos['gradosDeAumentoStep'] || 1;
    }
    RotarContinuamente.prototype.actualizar = function () {
        this.receptor.rotacion += this.gradosDeAumentoStep;
    };
    return RotarContinuamente;
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
