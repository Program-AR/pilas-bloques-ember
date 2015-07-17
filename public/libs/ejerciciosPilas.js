/// <reference path = "../../dependencias/pilasweb.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
        this.sanitizarOpciones(opciones);
        var imagen = pilas.imagenes.cargar_animacion(this.opciones.grilla, this.opciones.cantColumnas, this.opciones.cantFilas);
        _super.call(this, imagen, x, y);
        this.definirAnimacion("correr", this.opciones.cuadrosCorrer, 5);
        this.definirAnimacion("parado", this.opciones.cuadrosParado, 5);
        this.detener_animacion();
        this.objetosRecogidos = [];
    }
    ActorAnimado.prototype.sanitizarOpciones = function (ops) {
        this.opciones = ops;
        this.opciones.cuadrosCorrer = ops.cuadrosCorrer || this.seguidillaHasta(ops.cantColumnas) || [0, 0];
        this.opciones.cuadrosParado = ops.cuadrosParado || [0, 0];
        this.opciones.cantColumnas = ops.cantColumnas || this.opciones.cuadrosCorrer.length;
        this.opciones.cantFilas = ops.cantFilas || 1;
    };
    ActorAnimado.prototype.mover = function (x, y) {
        this.x += x;
        this.y += y;
        this.pasito_correr();
    };
    ActorAnimado.prototype.definirAnimacion = function (nombre, cuadros, velocidad) {
        this._imagen.definir_animacion(nombre, cuadros, velocidad);
    };
    ActorAnimado.prototype.pasito_correr = function () {
        this.cargarAnimacion("correr");
        this._imagen.avanzar();
    };
    ActorAnimado.prototype.detener_animacion = function () {
        this.cargarAnimacion("parado");
    };
    ActorAnimado.prototype.cargarAnimacion = function (nombre) {
        this._imagen.cargar_animacion(nombre);
    };
    ActorAnimado.prototype.avanzarAnimacion = function () {
        return this._imagen.avanzar();
    };
    ActorAnimado.prototype.seguidillaHasta = function (nro) {
        var seguidilla = [];
        if (nro !== undefined) {
            for (var i = 0; i < nro; i++) {
                seguidilla.push(i);
            }
        }
        return seguidilla;
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
    return ActorAnimado;
})(Actor);
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
        _super.call(this, x, y, { grilla: 'banana.png', cantColumnas: 2, cantFilas: 1 });
        this.escala_x = 2;
        this.escala_y = 2;
    }
    return BananaAnimada;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var BuzoAnimado = (function (_super) {
    __extends(BuzoAnimado, _super);
    function BuzoAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'buzo.png', cantColumnas: 1, cantFilas: 1 });
    }
    return BuzoAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var CaballeroAnimado = (function (_super) {
    __extends(CaballeroAnimado, _super);
    function CaballeroAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'mock_caballero.png', cantColumnas: 1 });
        //this.escala_x = 0.05;
        //this.escala_y = 0.05;
    }
    return CaballeroAnimado;
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
                (this.nroColumna * this.ancho);
    };
    Casilla.prototype.reubicarEnY = function () {
        this.y =
            this.cuadricula.arriba -
                (this.alto / 2) -
                (this.nroFila * this.alto);
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
    return Casilla;
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
        this.ancho = this.cantColumnas * opcionesCasilla.ancho;
        this.alto = this.cantFilas * opcionesCasilla.alto;
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
        this.opcionesCasilla.ancho = this.opcionesCasilla.ancho || this.opcionesCuadricula.ancho / this.cantColumnas;
        this.opcionesCasilla.alto = this.opcionesCasilla.alto || this.opcionesCuadricula.alto / this.cantFilas;
    };
    Cuadricula.prototype.setAncho = function (nuevo) {
        this.ancho = nuevo;
        this.opcionesCasilla.ancho = nuevo / this.cantColumnas;
        this.casillas.forEach(function (casilla) { casilla.reubicate(); });
    };
    Cuadricula.prototype.setAlto = function (nuevo) {
        this.alto = nuevo;
        this.opcionesCasilla.alto = nuevo / this.cantFilas;
        this.casillas.forEach(function (casilla) { casilla.reubicate(); });
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
    return Cuadricula;
})(Actor);
/// <reference path="Cuadricula.ts"/>
/// <reference path="Casilla.ts"/>
/**
 * class @Camino
 * El camino se construye parecido a la cuadrícula, sólo que no se indica
 * la cantidad de filas y ccolumnas, sino directamente las direcciones que
 * lo definen (arriba ^ , abajo v , izquierda <- , derecha ->).
 *
 * Las opciones que recibe son también 2 diccionarios: 1 para el camino, 1 para
 * cada casilla.
 * Las casillas deben tener sí o sí un
 * Esto es hasta que pilas resuelva el bug #
 *
 *
 */
/*
class Camino extends Cuadricula {
    puntos:[Punto];
    puntoActual;

    constructor(x, y, direcciones:[String], opcionesCuadricula, opcionesCasilla){
        this.puntoActual = new Punto(0,0);
        this.puntos = this.puntosPara(direcciones);
        super(x, y, this.cantFilasCamino(), this.cantColumnasCamino(), opcionesCuadricula, opcionesCasilla);

        this.construirCamino();
    }

    puntosPara(direcciones){
        return direcciones.map(dir => this.nuevoPuntoPara(dir));
    }

    nuevoPuntoPara(dir){
        this.puntoActual = this.puntoActual.siguienteEn(dir);
        return this.puntoActual;
    }

    construirCamino(){
        var thiss = this;
        this.puntos.forEach(function(punto){
            punto.cambiarOrigenDeCoordenadas(thiss.minimoX(),thiss.maximoY());
            punto.invertirY();
        });

        this.casillas.slice(0).filter(c => !this.laNecesito(c)).forEach(c => this.eliminarCasilla(c));
    }

    laNecesito(c:Casilla){
        return this.puntos.some(p => c.sos(p.x,p.y));
    }

    eliminarCasilla(c:Casilla){
        this.casillas = this.casillas.splice(this.casillas.indexOf(c),1);
        c.eliminar();
    }

    cantFilasCamino(){
        return this.maximoY() + this.maximoSegun(punto => 0-punto.y) + 1;
    }
    cantColumnasCamino(){
        return this.maximoSegun(punto => punto.x) - this.minimoX() + 1;
    }
    minimoX(){
        return 0 - this.maximoSegun(punto => 0-punto.x);
    }
    maximoY(){
        return this.maximoSegun(punto => punto.y);
    }

    maximoSegun(f:(p:Punto) => number){
        return this.puntos.map(f).reduce((maximo,nro) => Math.max(maximo,nro));
    }
}*/
/// <reference path="ActorAnimado.ts"/>
var CangrejoAnimado = (function (_super) {
    __extends(CangrejoAnimado, _super);
    function CangrejoAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'cangrejo.png', cantColumnas: 1, cantFilas: 1 });
    }
    return CangrejoAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var CarbonAnimado = (function (_super) {
    __extends(CarbonAnimado, _super);
    function CarbonAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'carbon_animado.png', cantColumnas: 1, cantFilas: 1 });
    }
    return CarbonAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var CasillaConLuz = (function (_super) {
    __extends(CasillaConLuz, _super);
    function CasillaConLuz(x, y) {
        _super.call(this, x, y, { grilla: 'casilla_con_luz.png', cantColumnas: 2, cantFilas: 1 });
        this.definirAnimacion("apagada", [0], 1);
        this.definirAnimacion("prendida", [1], 1);
    }
    return CasillaConLuz;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var CofreAnimado = (function (_super) {
    __extends(CofreAnimado, _super);
    function CofreAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'mock_cofre.png', cantColumnas: 1 });
    }
    return CofreAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var CompuAnimada = (function (_super) {
    __extends(CompuAnimada, _super);
    function CompuAnimada(x, y) {
        _super.call(this, x, y, { grilla: 'compu_animada.png', cantColumnas: 4, cantFilas: 1 });
        this.definirAnimacion("apagada", [0], 1);
        this.definirAnimacion("prendida", [1], 1);
        this.definirAnimacion("claveok", [2], 1);
        this.definirAnimacion("instalado", [3], 1);
    }
    return CompuAnimada;
})(ActorAnimado);
/*

1. La clase implementa una matriz donde cada fila tiene una cantidad distinta de columnas.

2. Cada fila es una cuadricula

3. Se permite inicializar con tamaños random o con tamaños fijos.

4. También, dado un definidor de Columnas (ver clase de este archivo), permite inicializar
esta matriz con objetos de esos tipos de manera aleatoria.

5. Se provee el método posicionar objeto que reemplaza al agregarActor tradicional

6. Para un ejemplo de utilizacion ver ElMonoQueSabeContar.ts

*/
var CuadriculaMultiple /*extends ActorAnimado*/ = (function () {
    function CuadriculaMultiple /*extends ActorAnimado*/(definidorColumnas) {
        //super(0,0,10);
        this.filas = [];
        this.inicializar(definidorColumnas);
    }
    CuadriculaMultiple /*extends ActorAnimado*/.prototype.inicializar = function (definidorColumnas) {
        while (definidorColumnas.hayProxColumnas()) {
            this.filas.push(new Fila(this, definidorColumnas.nroFila(), definidorColumnas.dameProxColumnas()));
        }
    };
    CuadriculaMultiple /*extends ActorAnimado*/.prototype.completarConObjetosRandom = function (arrayClases) {
        arrayClases = new conjuntoClases(arrayClases);
        for (var i = 0; i < this.filas.length; i += 1) {
            this.filas[i].completarConObjetosRandom(arrayClases);
        }
    };
    CuadriculaMultiple /*extends ActorAnimado*/.prototype.avanzarFila = function (objeto) {
        //TODO: deberia tener en cuenta que se puede ir del tablero????
        if (objeto.casillaActual().nroColumna == 0) {
            objeto.cuadricula.siguienteFila().agregarActor(objeto, 0, 0);
        }
        else {
            throw "No estoy al inicio de la fila";
        }
    };
    CuadriculaMultiple /*extends ActorAnimado*/.prototype.dameFila = function (objeto) {
        return this.diccionarioFilaObjeto[objeto];
    };
    CuadriculaMultiple /*extends ActorAnimado*/.prototype.posicionarObjeto = function (objeto, i, j) {
        //this.diccionarioFilaObjeto[objeto]=i;
        this.filas[i].agregarActor(objeto, 0, j);
    };
    return CuadriculaMultiple /*extends ActorAnimado*/;
})();
var conjuntoClases = (function () {
    function conjuntoClases(clases) {
        this.clases = clases;
    }
    conjuntoClases.prototype.dameUno = function () {
        return new this.clases[Math.floor(Math.random() * this.clases.length)](0, 0);
    };
    return conjuntoClases;
})();
var Fila = (function (_super) {
    __extends(Fila, _super);
    function Fila(cuadriculaMultipleP, nroFilaP, cantidadColumnasP) {
        this.cantidadColumnas = cantidadColumnasP;
        this.cuadriculaMultiple = cuadriculaMultipleP;
        this.nroFila = nroFilaP;
        _super.call(this, -200 + (this.cantidadColumnas / 2) * 40, 200 - (55 * this.nroFila), 1, this.cantidadColumnas, { alto: 40, ancho: 40 * this.cantidadColumnas }, { grilla: 'casillaLightbot.png', cantColumnas: 5 });
    }
    /*
    El ancho seteado de esa manera permite que todas las casillas tengan el mismo tamano
    El x tiene que ver con lograr acomodar todas las casillas sobre el margen izquierdo

    */
    //TODO: reemplazar el 200 por algun valor independiente del navegador
    Fila.prototype.siguienteFila = function () {
        if (this.existeSiguienteFila()) {
            return this.cuadriculaMultiple.filas[this.nroFila + 1];
        }
        else {
            throw "No hay siguiente fila";
        }
    };
    Fila.prototype.existeSiguienteFila = function () {
        return this.nroFila < this.cuadriculaMultiple.filas.length - 1;
    };
    Fila.prototype.completarConObjetosRandom = function (conjuntoClases) {
        // en la primer posicion no se debe guardar ningun objeto
        for (var index = 1; index < this.cantColumnas; index += 1) {
            if (Math.random() < 0.5) {
                this.agregarActor(conjuntoClases.dameUno(), 0, index);
            }
        }
    };
    return Fila;
})(Cuadricula);
var DefinidorColumnasDeUnaFila = (function () {
    function DefinidorColumnasDeUnaFila() {
        this.index = 0;
        this.tamanos = [];
    }
    DefinidorColumnasDeUnaFila.prototype.dameProxColumnas = function () {
        var a = this.tamanos[this.index];
        this.index += 1;
        return a;
    };
    DefinidorColumnasDeUnaFila.prototype.hayProxColumnas = function () {
        return this.index < this.tamanos.length;
    };
    DefinidorColumnasDeUnaFila.prototype.nroFila = function () {
        //comienza a numerar desde cero
        return this.index;
    };
    return DefinidorColumnasDeUnaFila;
})();
var DefinidorColumnasRandom = (function (_super) {
    __extends(DefinidorColumnasRandom, _super);
    function DefinidorColumnasRandom(filas, cantidadMaxColumnas) {
        _super.call(this);
        this.tamanos = Array.apply(null, Array(filas)).map(function (_, i) { return Math.floor((Math.random() * cantidadMaxColumnas) + 1); });
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
var GloboAnimado = (function (_super) {
    __extends(GloboAnimado, _super);
    function GloboAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'globoAnimado.png', cantColumnas: 1, cantFilas: 1 });
    }
    return GloboAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var HeroeAnimado = (function (_super) {
    __extends(HeroeAnimado, _super);
    function HeroeAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'mock_heroe.png', cantColumnas: 1 });
        //this.escala_x = 0.05;
        //this.escala_y = 0.05;
        this.definirAnimacion("correr", [0], 15);
        this.definirAnimacion("parado", [0], 5);
        this.definirAnimacion("recoger", [0], 10);
    }
    return HeroeAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var HierroAnimado = (function (_super) {
    __extends(HierroAnimado, _super);
    function HierroAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'hierro_animado.png', cantColumnas: 1, cantFilas: 1 });
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
        _super.call(this, x, y, { grilla: 'monkey_normal.png', cantColumnas: 1, cantFilas: 1 });
        this.definirAnimacion("correr", [0], 15);
        this.definirAnimacion("parado", [0], 5);
        this.definirAnimacion("recoger", [0], 10);
    }
    return InstaladorAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var LlaveAnimado = (function (_super) {
    __extends(LlaveAnimado, _super);
    function LlaveAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'mock_llave.png', cantColumnas: 1 });
        //this.escala_x = 1;
        //this.escala_y = 1;
    }
    return LlaveAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var MagoAnimado = (function (_super) {
    __extends(MagoAnimado, _super);
    function MagoAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'mock_mago.png', cantColumnas: 1 });
        //this.escala_x = 0.05;
        //this.escala_y = 0.05;
    }
    return MagoAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var ManzanaAnimada = (function (_super) {
    __extends(ManzanaAnimada, _super);
    function ManzanaAnimada(x, y) {
        _super.call(this, x, y, { grilla: 'manzana.png', cantColumnas: 1, cantFilas: 1 });
    }
    return ManzanaAnimada;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var MarcianoAnimado = (function (_super) {
    __extends(MarcianoAnimado, _super);
    function MarcianoAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'rpg.maton.png', cantColumnas: 12, cantFilas: 1 });
        this.definirAnimacion("correr", [3, 4], 15);
        this.definirAnimacion("parado", [5], 5);
        this.definirAnimacion("recoger", [4, 6, 4], 5);
        this.detener_animacion();
    }
    return MarcianoAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var MarcianoVerdeAnimado = (function (_super) {
    __extends(MarcianoVerdeAnimado, _super);
    function MarcianoVerdeAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'marcianoVerdeAnimado.png', cantColumnas: 3, cantFilas: 1 });
        this.definirAnimacion("parado", [0], 1);
        this.definirAnimacion("conHierroAnimadoEnMano", [1], 1);
        this.definirAnimacion("conCarbonAnimadoEnMano", [2], 1);
    }
    return MarcianoVerdeAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var MariaAnimada = (function (_super) {
    __extends(MariaAnimada, _super);
    function MariaAnimada(x, y) {
        _super.call(this, x, y, { grilla: 'maria.png', cantColumnas: 1, cantFilas: 1 });
    }
    return MariaAnimada;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var MonoAnimado = (function (_super) {
    __extends(MonoAnimado, _super);
    function MonoAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'monkey_normal.png', cantColumnas: 1, cantFilas: 1 });
        this.definirAnimacion("correr", [0], 15);
        this.definirAnimacion("parado", [0], 5);
        this.definirAnimacion("recoger", [0], 10);
    }
    return MonoAnimado;
})(ActorAnimado);
var NaveAnimada = (function (_super) {
    __extends(NaveAnimada, _super);
    function NaveAnimada(x, y) {
        _super.call(this, x, y, { grilla: 'naveAnimada.png', cantColumnas: 2, cantFilas: 1 });
    }
    return NaveAnimada;
})(ActorAnimado);
/// <reference path = "../../dependencias/pilasweb.d.ts" />
var Animar = (function (_super) {
    __extends(Animar, _super);
    function Animar() {
        _super.apply(this, arguments);
    }
    Animar.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.sanitizarArgumentos();
        this.imagenAnterior = this.receptor._imagen;
        this.receptor.imagen = pilas.imagenes.cargar_grilla(this.argumentos.grilla, this.argumentos.cantColumnas);
        this.receptor._imagen.definir_cuadro(0);
        this.paso = 0;
    };
    Animar.prototype.actualizar = function () {
        this.paso += 0.3;
        if (this.paso > this.argumentos.cantColumnas) {
            this.paso = 0;
            this.argumentos.cantEjecuciones -= 1;
            if (this.argumentos.cantEjecuciones === 0) {
                this.terminarrlo();
                return true;
            }
        }
        this.receptor._imagen.definir_cuadro(this.argumentos.cuadros[parseInt(this.paso)]);
    };
    Animar.prototype.terminarrlo = function () {
        this.receptor.imagen = this.imagenAnterior;
    };
    Animar.prototype.seguidillaHastaCant = function () {
        var seguidilla = [];
        if (this.argumentos.cantColumnas !== undefined) {
            for (var i = 0; i < this.argumentos.cantColumnas; i++) {
                seguidilla.push(i);
            }
        }
        return seguidilla;
    };
    Animar.prototype.sanitizarArgumentos = function () {
        this.argumentos.cantEjecuciones = this.argumentos.cantEjecuciones || 1;
        this.argumentos.velocidad = this.argumentos.velocidad || 2;
        this.argumentos.cuadros = this.argumentos.cuadros || this.seguidillaHastaCant() || [0];
        this.argumentos.cantColumnas = this.argumentos.cantColumnas || this.argumentos.cuadros.length;
        this.argumentos.cuadroEstatico = this.argumentos.cuadroEstatico || 0;
    };
    return Animar;
})(Comportamiento);
/// <reference path = "../../dependencias/pilasweb.d.ts" />
/// <reference path="ActorAnimado.ts"/>
/// <reference path = "../comportamientos/Animar.ts"/>
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
var Observado = (function () {
    function Observado(valorInicial) {
        //super(x, y, {grilla: 'mock_caballero.png', cantColumnas:1});
        //this.escala_x = 0.05;
        //this.escala_y = 0.05;
        this.atributo = valorInicial;
        this.observadores = [];
    }
    Observado.prototype.registrarObservador = function (observador) {
        this.observadores.push(observador);
        this.changed();
    };
    Observado.prototype.changed = function () {
        //TODO:reemplazar con foreach
        for (var index = 0; index < this.observadores.length; index++) {
            this.observadores[index].tuObservadoCambio(this);
        }
    };
    Observado.prototype.dameAtributo = function () {
        return this.atributo;
    };
    return Observado;
})();
var ObservadoConAumentar = (function (_super) {
    __extends(ObservadoConAumentar, _super);
    function ObservadoConAumentar() {
        _super.apply(this, arguments);
    }
    ObservadoConAumentar.prototype.aumentar = function (valorAumento) {
        this.atributo = this.atributo + valorAumento;
        this.changed();
    };
    return ObservadoConAumentar;
})(Observado);
var ObservadoConDisminuir = (function (_super) {
    __extends(ObservadoConDisminuir, _super);
    function ObservadoConDisminuir() {
        _super.apply(this, arguments);
    }
    ObservadoConDisminuir.prototype.disminuir = function (valorAumento) {
        this.atributo = this.atributo - valorAumento;
        this.changed();
    };
    return ObservadoConDisminuir;
})(Observado);
var PelotaAnimada = (function (_super) {
    __extends(PelotaAnimada, _super);
    function PelotaAnimada(x, y) {
        _super.call(this, x, y, { grilla: 'pelotaAnimada.png', cantColumnas: 1 });
    }
    return PelotaAnimada;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var PerroCohete = (function (_super) {
    __extends(PerroCohete, _super);
    function PerroCohete(x, y) {
        _super.call(this, x, y, { grilla: 'perro_cohete.png', cantColumnas: 1, cantFilas: 7 });
        this.definirAnimacion("correr", [4, 5, 6, 5], 15);
        this.definirAnimacion("parado", [4], 5);
        this.definirAnimacion("recoger", [4, 2, 0, 2, 4], 10);
    }
    return PerroCohete;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var PezAnimado = (function (_super) {
    __extends(PezAnimado, _super);
    function PezAnimado(x, y) {
        if (Math.random() < 0.5) {
            _super.call(this, x, y, { grilla: 'pez1.png', cantColumnas: 1, cantFilas: 1 });
        }
        else {
            if (Math.random() < 0.5) {
                _super.call(this, x, y, { grilla: 'pez2.png', cantColumnas: 1, cantFilas: 1 });
            }
            else {
                _super.call(this, x, y, { grilla: 'pez2.png', cantColumnas: 1, cantFilas: 1 });
            }
        }
    }
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
        _super.call(this, x, y, { grilla: 'perro_cohete.png', cantColumnas: 1, cantFilas: 7 });
        this.definirAnimacion("correr", [4, 5, 6, 5], 15);
        this.definirAnimacion("parado", [4], 5);
        this.definirAnimacion("recoger", [4], 5);
    }
    return RecolectorEstrellas;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var Robot = (function (_super) {
    __extends(Robot, _super);
    function Robot(x, y) {
        _super.call(this, x, y, { grilla: 'robot.png', cantColumnas: 1, cantFilas: 1 });
        this.definirAnimacion("caminando", [0], 1);
        this.definirAnimacion("parado", [0], 1);
    }
    return Robot;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var RobotAnimado = (function (_super) {
    __extends(RobotAnimado, _super);
    function RobotAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'robotAnimado.png', cantColumnas: 1 });
    }
    return RobotAnimado;
})(ActorAnimado);
/// <reference path="ActorAnimado.ts"/>
var SandiaAnimada = (function (_super) {
    __extends(SandiaAnimada, _super);
    function SandiaAnimada(x, y) {
        _super.call(this, x, y, { grilla: 'sandia.png', cantColumnas: 2, cantFilas: 1 });
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
var Tablero = (function () {
    /*Saco por ahora la observacion de algo, no lo necesito so far.*/
    function Tablero(x, y, texto) {
        //this.observado=observadoP || undefined;
        var colorNombre = undefined;
        var colorPuntaje = undefined;
        this.nombre = new Texto(x, y, texto, colorNombre);
        this.puntaje = new Puntaje(x + 10, y, 0, colorPuntaje);
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
        this.setearValor(observado.dameAtributo());
    };
    return Tablero;
})();
/// <reference path="ActorAnimado.ts"/>
var UnicornioAnimado = (function (_super) {
    __extends(UnicornioAnimado, _super);
    function UnicornioAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'mock_unicornio.png', cantColumnas: 1 });
        //this.escala_x = 0.05;
        //this.escala_y = 0.05;
    }
    return UnicornioAnimado;
})(ActorAnimado);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
var MovimientoEnCuadricula = (function (_super) {
    __extends(MovimientoEnCuadricula, _super);
    function MovimientoEnCuadricula() {
        _super.apply(this, arguments);
    }
    MovimientoEnCuadricula.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.cuadricula = receptor.cuadricula;
        this.movimiento = new this.claseQueImita({});
        this.movimiento.iniciar(receptor);
        this.movimiento.velocidad = this.velocidad();
        this.estoyEmpezandoAMoverme = true;
    };
    MovimientoEnCuadricula.prototype.actualizar = function () {
        if (!this.puedoMovermeEnEsaDireccion() || this.movimiento.actualizar()) {
            return true;
        }
    };
    //    claseQueImita(){
    //        // Template Method. Las subclases deben devolver una clase de comportamiento.
    //    }
    MovimientoEnCuadricula.prototype.puedoMovermeEnEsaDireccion = function () {
        if (this.estoyEmpezandoAMoverme) {
            this.estoyEmpezandoAMoverme = false;
            return this.verificarDireccion(this.receptor.casillaActual());
        }
        return true;
    };
    MovimientoEnCuadricula.prototype.velocidad = function () {
        // Template Method. Devuelve la velocidad vertical ú horizontal según corresponda 
    };
    // El nro 0.05 depende del nro 0.05 establecido en CaminaBase
    MovimientoEnCuadricula.prototype.velocidadHorizontal = function () {
        return this.cuadricula.anchoCasilla() * 0.05;
    };
    MovimientoEnCuadricula.prototype.velocidadVertical = function () {
        return this.cuadricula.altoCasilla() * 0.05;
    };
    MovimientoEnCuadricula.prototype.verificarDireccion = function (casilla) {
        var proximaCasilla = this.proximaCasilla(casilla);
        if (!proximaCasilla) {
            this.receptor.decir("No puedo ir para " + this.textoAMostrar());
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
})(Comportamiento);
var MoverACasillaDerecha = (function (_super) {
    __extends(MoverACasillaDerecha, _super);
    function MoverACasillaDerecha() {
        _super.apply(this, arguments);
        this.claseQueImita = CaminaDerecha;
    }
    MoverACasillaDerecha.prototype.proximaCasilla = function (casilla) {
        return casilla.casillaASuDerecha();
    };
    MoverACasillaDerecha.prototype.textoAMostrar = function () {
        return "la derecha";
    };
    MoverACasillaDerecha.prototype.velocidad = function () {
        return this.velocidadHorizontal();
    };
    return MoverACasillaDerecha;
})(MovimientoEnCuadricula);
var MoverACasillaArriba = (function (_super) {
    __extends(MoverACasillaArriba, _super);
    function MoverACasillaArriba() {
        _super.apply(this, arguments);
        this.claseQueImita = CaminaArriba;
    }
    MoverACasillaArriba.prototype.proximaCasilla = function (casilla) {
        return casilla.casillaDeArriba();
    };
    MoverACasillaArriba.prototype.textoAMostrar = function () {
        return "arriba";
    };
    MoverACasillaArriba.prototype.velocidad = function () {
        return this.velocidadVertical();
    };
    return MoverACasillaArriba;
})(MovimientoEnCuadricula);
var MoverACasillaAbajo = (function (_super) {
    __extends(MoverACasillaAbajo, _super);
    function MoverACasillaAbajo() {
        _super.apply(this, arguments);
        this.claseQueImita = CaminaAbajo;
    }
    MoverACasillaAbajo.prototype.proximaCasilla = function (casilla) {
        return casilla.casillaDeAbajo();
    };
    MoverACasillaAbajo.prototype.textoAMostrar = function () {
        return "abajo";
    };
    MoverACasillaAbajo.prototype.velocidad = function () {
        return this.velocidadVertical();
    };
    return MoverACasillaAbajo;
})(MovimientoEnCuadricula);
var MoverACasillaIzquierda = (function (_super) {
    __extends(MoverACasillaIzquierda, _super);
    function MoverACasillaIzquierda() {
        _super.apply(this, arguments);
        this.claseQueImita = CaminaIzquierda;
    }
    MoverACasillaIzquierda.prototype.proximaCasilla = function (casilla) {
        return casilla.casillaASuIzquierda();
    };
    MoverACasillaIzquierda.prototype.textoAMostrar = function () {
        return "la izquierda";
    };
    MoverACasillaIzquierda.prototype.velocidad = function () {
        return this.velocidadHorizontal();
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
    MoverTodoAIzquierda.prototype.velocidad = function () {
        return this.velocidadHorizontal() * this.receptor.casillaActual().nroColumna;
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
    MoverTodoADerecha.prototype.velocidad = function () {
        return this.velocidadHorizontal() * (this.cuadricula.cantColumnas - 1 - this.receptor.casillaActual().nroColumna);
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
    MoverTodoArriba.prototype.velocidad = function () {
        return this.velocidadVertical() * this.receptor.casillaActual().nroFila;
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
    MoverTodoAbajo.prototype.velocidad = function () {
        return this.velocidadVertical() * (this.cuadricula.cantFilas - 1 - this.receptor.casillaActual().nroColumna);
    };
    return MoverTodoAbajo;
})(MoverACasillaAbajo);
/// <reference path="../comportamientos/movimientosEnCuadricula.ts"/>
/// <reference path="Cuadricula.ts"/>
var CuadriculaEsparsa = (function (_super) {
    __extends(CuadriculaEsparsa, _super);
    function CuadriculaEsparsa(x, y, cantidadFilasMax, cantidadColumnasMax, opcionesCuadricula, opcionesCasilla, matriz) {
        this.matriz = matriz;
        _super.call(this, x, y, cantidadFilasMax, cantidadColumnasMax, opcionesCuadricula, opcionesCasilla);
    }
    CuadriculaEsparsa.prototype.crearCasillas = function () {
        this.casillas = new Array();
        for (var nroFila = 0; nroFila < this.cantFilas; nroFila++) {
            for (var nroColumna = 0; nroColumna < this.cantColumnas; nroColumna++) {
                if (this.matriz[nroFila][nroColumna] == 'T') {
                    this.casillas.push(new Casilla(nroFila, nroColumna, this));
                }
            }
        }
    };
    CuadriculaEsparsa.prototype.completarConObjetosRandom = function (conjuntoDeClases) {
        for (var index = 0; index < this.casillas.length; ++index) {
            if (Math.random() < 0.4) {
                this.agregarActor(conjuntoDeClases.dameUno(), this.casillas[index].nroFila, this.casillas[index].nroColumna);
            }
        }
    };
    CuadriculaEsparsa.prototype.hayDerecha = function (casilla) {
        return (casilla.nroColumna < this.matriz[casilla.nroFila].length + 1);
    };
    CuadriculaEsparsa.prototype.hayIzquierda = function (casilla) {
        return (casilla.nroColumna + 1 > 0);
    };
    CuadriculaEsparsa.prototype.hayAbajo = function (casilla) {
        return (casilla.nroFila < this.matriz.length + 1);
    };
    CuadriculaEsparsa.prototype.hayArriba = function (casilla) {
        return (casilla.nroFila + 1 > 0);
    };
    return CuadriculaEsparsa;
})(Cuadricula);
var MoverACasillaDerechaEsparsa = (function (_super) {
    __extends(MoverACasillaDerechaEsparsa, _super);
    function MoverACasillaDerechaEsparsa() {
        _super.apply(this, arguments);
    }
    MoverACasillaDerechaEsparsa.prototype.proximaCasilla = function (casilla) {
        if (casilla.cuadricula.hayDerecha(casilla)) {
            return casilla.casillaASuDerecha();
        }
        else {
            return undefined;
        }
    };
    return MoverACasillaDerechaEsparsa;
})(MoverACasillaDerecha);
var MoverACasillaIzquierdaEsparsa = (function (_super) {
    __extends(MoverACasillaIzquierdaEsparsa, _super);
    function MoverACasillaIzquierdaEsparsa() {
        _super.apply(this, arguments);
    }
    MoverACasillaIzquierdaEsparsa.prototype.proximaCasilla = function (casilla) {
        if (casilla.cuadricula.hayIzquierda(casilla)) {
            return casilla.casillaASuIzquierda();
        }
        else {
            return undefined;
        }
    };
    return MoverACasillaIzquierdaEsparsa;
})(MoverACasillaIzquierda);
var MoverACasillaArribaEsparsa = (function (_super) {
    __extends(MoverACasillaArribaEsparsa, _super);
    function MoverACasillaArribaEsparsa() {
        _super.apply(this, arguments);
    }
    MoverACasillaArribaEsparsa.prototype.proximaCasilla = function (casilla) {
        if (casilla.cuadricula.hayArriba(casilla)) {
            return casilla.casillaDeArriba();
        }
        else {
            return undefined;
        }
    };
    return MoverACasillaArribaEsparsa;
})(MoverACasillaArriba);
var MoverACasillaAbajoEsparsa = (function (_super) {
    __extends(MoverACasillaAbajoEsparsa, _super);
    function MoverACasillaAbajoEsparsa() {
        _super.apply(this, arguments);
    }
    MoverACasillaAbajoEsparsa.prototype.proximaCasilla = function (casilla) {
        if (casilla.cuadricula.hayAbajo(casilla)) {
            return casilla.casillaDeAbajo();
        }
        else {
            return undefined;
        }
    };
    return MoverACasillaAbajoEsparsa;
})(MoverACasillaAbajo);
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
            this.receptor.cargarAnimacion(this.nombreAnimacion());
            this.alIniciar();
            return true;
        }.bind(this));
        this.secuenciaActualizar.push(function () {
            return this.doActualizar();
        }.bind(this));
        this.secuenciaActualizar.push(function () {
            this.receptor.cargarAnimacion(this.nombreAnimacionParado());
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
    /* Redefinir si corresponde animar el comportamiento. */
    ComportamientoAnimado.prototype.nombreAnimacion = function () {
        return this.argumentos.nombreAnimacion || this.nombreAnimacionParado();
    };
    /* Redefinir si corresponde */
    ComportamientoAnimado.prototype.nombreAnimacionParado = function () {
        return this.argumentos.nombreAnimacionParado || 'parado';
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
var EncenderCompu = (function (_super) {
    __extends(EncenderCompu, _super);
    function EncenderCompu() {
        _super.apply(this, arguments);
    }
    EncenderCompu.prototype.actualizar = function () {
        if (this.tocandoLuz()) {
            var casillaConLuz = this.getCasillaConLuz();
            casillaConLuz.agregar_habilidad(HabilidadAnimada, { nombreAnimacion: 'prendida' });
        }
        else {
            this.receptor.decir('¡Aquí no hay compu por prender!');
        }
        return true;
    };
    EncenderCompu.prototype.tocandoLuz = function () {
        var _this = this;
        return pilas.obtener_actores_con_etiqueta('CompuAnimada').some(function (objeto) { return objeto.colisiona_con(_this.receptor); });
    };
    EncenderCompu.prototype.getCasillaConLuz = function () {
        var _this = this;
        return pilas.obtener_actores_con_etiqueta('CompuAnimada').filter(function (objeto) { return objeto.colisiona_con(_this.receptor); })[0];
    };
    return EncenderCompu;
})(Comportamiento);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
var HabilidadAnimada = (function (_super) {
    __extends(HabilidadAnimada, _super);
    function HabilidadAnimada(receptor, argumentos) {
        _super.call(this, receptor, argumentos);
        console.log(this);
        this.receptor.cargarAnimacion(this.nombreAnimacion());
    }
    /* Redefinir si corresponde animar la habilidad. */
    HabilidadAnimada.prototype.nombreAnimacion = function () {
        return this.argumentos.nombreAnimacion;
    };
    HabilidadAnimada.prototype.actualizar = function () {
        this.receptor.avanzarAnimacion();
    };
    return HabilidadAnimada;
})(Habilidad);
/// <reference path="ComportamientoAnimado.ts"/>
/// <reference path="../habilidades/HabilidadAnimada.ts"/>
var EncenderLuz = (function (_super) {
    __extends(EncenderLuz, _super);
    function EncenderLuz() {
        _super.apply(this, arguments);
    }
    EncenderLuz.prototype.actualizar = function () {
        if (this.tocandoLuz()) {
            var casillaConLuz = this.getCasillaConLuz();
            casillaConLuz.agregar_habilidad(HabilidadAnimada, { nombreAnimacion: 'prendida' });
        }
        else {
            this.receptor.decir('¡Aquí no hay una luz por prender!');
        }
        return true;
    };
    EncenderLuz.prototype.tocandoLuz = function () {
        var _this = this;
        return pilas.obtener_actores_con_etiqueta('CasillaConLuz').some(function (objeto) { return objeto.colisiona_con(_this.receptor); });
    };
    EncenderLuz.prototype.getCasillaConLuz = function () {
        var _this = this;
        return pilas.obtener_actores_con_etiqueta('CasillaConLuz').filter(function (objeto) { return objeto.colisiona_con(_this.receptor); })[0];
    };
    return EncenderLuz;
})(Comportamiento);
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
/*
Es un comportamiento genérico con la idea de ser extendido
Sus características son

Si se está colisionando con un objeto de etiqueta A:
    Realizar acciones dependientes de ese objeto
Caso Contrario:
    El personaje principal ejecuta un mensaje de error.

La escena que lo utiliza debe tener definido
personajePrincipal()


*/
var ComportamientoColision = (function (_super) {
    __extends(ComportamientoColision, _super);
    function ComportamientoColision() {
        _super.apply(this, arguments);
    }
    ComportamientoColision.prototype.nombreAnimacion = function () {
        // redefinir por subclase
        return "parado";
    };
    ComportamientoColision.prototype.alTerminarAnimacion = function () {
        if (pilas.escena_actual().estado !== undefined) {
            pilas.escena_actual().estado.realizarTransicion(this.argumentos['idComportamiento'], this);
        }
        else {
            this.elEstadoEsValido();
        }
    };
    ComportamientoColision.prototype.elEstadoEsValido = function () {
        var _this = this;
        if (pilas.obtener_actores_con_etiqueta(this.argumentos['etiqueta'])
            .some(function (objeto) { return objeto.colisiona_con(_this.receptor); })) {
            this.metodo(pilas.obtener_actores_con_etiqueta(this.argumentos['etiqueta']).filter(function (objeto) { return objeto.colisiona_con(_this.receptor); })[0]);
            return true;
        }
        else {
            pilas.escena_actual().personajePrincipal().decir(this.argumentos['mensajeError']);
            return false;
        }
    };
    ComportamientoColision.prototype.metodo = function (objetoColision) {
        //redefinir por subclase
    };
    return ComportamientoColision;
})(ComportamientoAnimado);
var MorderPorEtiqueta = (function (_super) {
    __extends(MorderPorEtiqueta, _super);
    function MorderPorEtiqueta() {
        _super.apply(this, arguments);
    }
    MorderPorEtiqueta.prototype.metodo = function (objetoColision) {
        objetoColision.cargarAnimacion("mordida");
    };
    return MorderPorEtiqueta;
})(ComportamientoColision);
var EncenderPorEtiqueta = (function (_super) {
    __extends(EncenderPorEtiqueta, _super);
    function EncenderPorEtiqueta() {
        _super.apply(this, arguments);
    }
    EncenderPorEtiqueta.prototype.metodo = function (objetoColision) {
        objetoColision.cargarAnimacion("prendida");
    };
    return EncenderPorEtiqueta;
})(ComportamientoColision);
/// <reference path="comportamientoColision.ts"/>
/*
class RecogerPorEtiqueta extends ComportamientoAnimado {
    nombreAnimacion(){
        return 'parado';
    }

    alTerminarAnimacion(){

            if (this.receptorTocandoEtiqueta(this.argumentos['etiqueta'])) {

                this.eliminarObjetoTocadoConEtiqueta(this.argumentos['etiqueta']);
            } else {
                this.receptor.decir(this.argumentos['mensajeError']);
            }
    }


    eliminarObjetoTocadoConEtiqueta(etiqueta){
        //se va a eliminar un unico objeto en el caso de multiples colisiones
        return pilas.obtener_actores_con_etiqueta(etiqueta).filter(objeto => objeto.colisiona_con(this.receptor))[0].eliminar();
    }

    receptorTocandoEtiqueta(etiqueta){
        return pilas.obtener_actores_con_etiqueta(etiqueta).some(objeto => objeto.colisiona_con(this.receptor));
        }

}*/
var RecogerPorEtiqueta = (function (_super) {
    __extends(RecogerPorEtiqueta, _super);
    function RecogerPorEtiqueta() {
        _super.apply(this, arguments);
    }
    RecogerPorEtiqueta.prototype.metodo = function (objetoColision) {
        objetoColision.eliminar();
    };
    return RecogerPorEtiqueta;
})(ComportamientoColision);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
var SaltarHablando = (function (_super) {
    __extends(SaltarHablando, _super);
    function SaltarHablando() {
        _super.apply(this, arguments);
    }
    SaltarHablando.prototype.actualizar = function () {
        if (_super.prototype.actualizar.call(this)) {
            this.receptor.decir(this.receptor.fraseAlSaltar());
            return true;
        }
    };
    return SaltarHablando;
})(Saltar);
var avanzarFilaEnCuadriculaMultiple = (function (_super) {
    __extends(avanzarFilaEnCuadriculaMultiple, _super);
    function avanzarFilaEnCuadriculaMultiple() {
        _super.apply(this, arguments);
    }
    avanzarFilaEnCuadriculaMultiple.prototype.alTerminarAnimacion = function () {
        try {
            this.argumentos['cuadriculaMultiple'].avanzarFila(this.receptor);
        }
        catch (err) {
            this.receptor.decir(err);
        }
    };
    return avanzarFilaEnCuadriculaMultiple;
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
    ContarPorEtiqueta.prototype.metodo = function (objetoColision) {
        this.argumentos['dondeReflejarValor'].aumentar(1);
    };
    return ContarPorEtiqueta;
})(ComportamientoColision);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/********** POR FAVOR NO MIRAR ESTA CLASE. NO SIRVE DE EJEMPLO *************/
/********** POR FAVOR NO MIRAR ESTA CLASE. NO SIRVE DE EJEMPLO *************/
/********** POR FAVOR NO MIRAR ESTA CLASE. NO SIRVE DE EJEMPLO *************/
/********** POR FAVOR NO MIRAR ESTA CLASE. NO SIRVE DE EJEMPLO *************/
function convertir_posicion_a_coordenada(fila, columna) {
    /*

                   columnas
                      1            2       3       4       5       6
          filas

            1    [- 175,  140]     []      []      []       []      []
            2    [- 175,   60]
            3    [- 175,  -20]
            4    [- 175, -100]
            5    [- 175, -180]

     */
    var columnas = [-175, -105, -35, 35, 105, 175];
    var filas = [140, 60, -20, -100, -180];
    return { x: columnas[columna - 1], y: filas[fila - 1] };
}
var AlienLevantaTuercas = (function (_super) {
    __extends(AlienLevantaTuercas, _super);
    function AlienLevantaTuercas() {
        _super.apply(this, arguments);
    }
    AlienLevantaTuercas.prototype.iniciar = function () {
        var fondo = new pilas.fondos.Laberinto1();
        var alien = new pilas.actores.Alien(-175, -180);
        alien.cuando_busca_recoger = function () {
            var actores = pilas.obtener_actores_en(alien.x, alien.y + 20, 'Tuerca');
            if (actores.length > 0) {
                var mensaje = "";
                actores[0].eliminar();
                var restantes = pilas.obtener_actores_con_etiqueta("Tuerca").length;
                if (restantes > 0)
                    mensaje = "genial, aún quedan: " + restantes;
                else
                    mensaje = "¡Nivel completado!";
                alien.decir(mensaje);
                console.log(mensaje);
            }
        };
        var posicion = convertir_posicion_a_coordenada(1, 1);
        var tuerca = new pilas.actores.Tuerca(posicion.x, posicion.y);
        var posicion = convertir_posicion_a_coordenada(3, 2);
        var tuerca = new pilas.actores.Tuerca(posicion.x, posicion.y);
        var posicion = convertir_posicion_a_coordenada(5, 3);
        var tuerca = new pilas.actores.Tuerca(posicion.x, posicion.y);
        var posicion = convertir_posicion_a_coordenada(3, 6);
        var tuerca = new pilas.actores.Tuerca(posicion.x, posicion.y);
        //window.tuerca = tuerca;
    };
    return AlienLevantaTuercas;
})(Base);
var AlimentandoALosPeces = (function (_super) {
    __extends(AlimentandoALosPeces, _super);
    function AlimentandoALosPeces() {
        _super.apply(this, arguments);
    }
    AlimentandoALosPeces.prototype.iniciar = function () {
        this.cantidadFilas = 4;
        this.cantidadColumnas = 5;
        this.cuadricula = new Cuadricula(0, 0, this.cantidadFilas, this.cantidadColumnas, { lalto: 300, ancho: 300 }, { grilla: 'casillaLightbot.png',
            cantColumnas: 5 });
        this.buzo = new BuzoAnimado(0, 0);
        this.cuadricula.agregarActor(this.buzo, this.cantidadFilas - 1, 0);
        this.alimento = new AlimentoAnimado(0, 0);
        this.cuadricula.agregarActor(this.alimento, 1, this.cantidadColumnas - 1);
        this.colocarPeces();
        this.estado = this.generarEstadoInicial();
    };
    AlimentandoALosPeces.prototype.generarEstadoInicial = function () {
        var builder = new BuilderStatePattern('inicial');
        builder.agregarEstado('tengoLaComida');
        builder.agregarTransicion('inicial', 'tengoLaComida', 'recogerComida');
        builder.agregarTransicion('tengoLaComida', 'tengoLaComida', 'alimentarPez');
        builder.agregarError('inicial', 'alimentarPez', 'Debés recolectar primero el alimento');
        return builder.estadoInicial();
    };
    AlimentandoALosPeces.prototype.personajePrincipal = function () {
        return this.buzo;
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
        this.buzo.hacer_luego(RecogerPorEtiqueta, { 'etiqueta': 'PezAnimado', 'mensajeError': 'No hay un pez aqui', 'idComportamiento': 'alimentarPez' });
    };
    AlimentandoALosPeces.prototype.agarrarComida = function () {
        this.buzo.hacer_luego(RecogerPorEtiqueta, { 'etiqueta': 'AlimentoAnimado', 'mensajeError': 'No hay una alimento aqui', 'idComportamiento': 'recogerComida' });
    };
    AlimentandoALosPeces.prototype.moverDerecha = function () {
        this.buzo.hacer_luego(MoverACasillaDerecha);
    };
    AlimentandoALosPeces.prototype.moverIzquierda = function () {
        this.buzo.hacer_luego(MoverACasillaIzquierda);
    };
    AlimentandoALosPeces.prototype.moverAbajo = function () {
        this.buzo.hacer_luego(MoverACasillaAbajo);
    };
    AlimentandoALosPeces.prototype.moverArriba = function () {
        this.buzo.hacer_luego(MoverACasillaArriba);
    };
    return AlimentandoALosPeces;
})(Base);
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
    Camino.prototype.dameCamino = function () {
        var a = new CuadriculaEsparsa(this.x, this.y, this.cantidadFilas, this.cantidadColumnas, this.opcionesCuadricula, { grilla: 'casillaLightbot.png', cantColumnas: 5 }, this.matriz);
        this.cambiarImagenesCasillasCamino(this.direcciones, a, this.opcionesCasilla);
        return a;
    };
    Camino.prototype.cambiarImagenesCasillasCamino = function (direcciones, cuadricula, opcionesCasilla) {
        for (var index = 0; index < cuadricula.casillas.length; index++) {
            cuadricula.casillas[index].imagen = opcionesCasilla[this.direcciones[index]];
        }
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
        this.cuadricula = new CuadriculaEsparsa(0, 0, this.cantidadFilas, this.cantidadColumnas, { alto: 100 }, { grilla: 'casillaLightbot.png', cantColumnas: 5 }, matriz);
        this.completarConGlobos();
        this.cangrejo = new CangrejoAnimado(0, 0);
        this.cuadricula.agregarActor(this.cangrejo, 0, 0);
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
        this.cangrejo.hacer_luego(MoverACasillaDerechaEsparsa);
    };
    ElCangrejoAguafiestas.prototype.moverIzquierda = function () {
        this.cangrejo.hacer_luego(MoverACasillaIzquierdaEsparsa);
    };
    ElCangrejoAguafiestas.prototype.moverArriba = function () {
        this.cangrejo.hacer_luego(MoverACasillaArribaEsparsa);
    };
    ElCangrejoAguafiestas.prototype.moverAbajo = function () {
        this.cangrejo.hacer_luego(MoverACasillaAbajoEsparsa);
    };
    ElCangrejoAguafiestas.prototype.explotarGlobo = function () {
        this.cangrejo.hacer_luego(RecogerPorEtiqueta, { 'etiqueta': 'GloboAnimado', 'mensajeError': 'No hay un globo aqui' });
    };
    return ElCangrejoAguafiestas;
})(Base);
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
        this.estado = undefined;
        this.fondo = new Fondo('fondos.nubes.png', 0, 0);
        var cantidadFilas = 4;
        var cantidadColumnas = 5;
        this.cuadricula = new Cuadricula(0, 0, cantidadFilas, cantidadColumnas, {}, { grilla: 'casillaLightbot.png',
            cantColumnas: 5,
            ancho: 60,
            alto: 60 });
        this.manzanas = [];
        var objeto = new ManzanaAnimada(0, 0);
        this.cuadricula.agregarActor(objeto, 0, 0);
        this.manzanas.push(objeto);
        var objeto = new ManzanaAnimada(0, 0);
        this.cuadricula.agregarActor(objeto, 0, 2);
        this.manzanas.push(objeto);
        var objeto = new ManzanaAnimada(0, 0);
        this.cuadricula.agregarActor(objeto, 0, 4);
        this.manzanas.push(objeto);
        var objeto = new ManzanaAnimada(0, 0);
        this.cuadricula.agregarActor(objeto, 1, 4);
        this.manzanas.push(objeto);
        var objeto = new ManzanaAnimada(0, 0);
        this.cuadricula.agregarActor(objeto, 2, 4);
        this.manzanas.push(objeto);
        var objeto = new ManzanaAnimada(0, 0);
        this.cuadricula.agregarActor(objeto, 3, 2);
        this.manzanas.push(objeto);
        var objeto = new ManzanaAnimada(0, 0);
        this.cuadricula.agregarActor(objeto, 3, 1);
        this.manzanas.push(objeto);
        this.personaje = new MarcianoAnimado(0, 0);
        this.cuadricula.agregarActor(this.personaje, cantidadFilas - 1, 0);
    };
    /*************** Métodos para que se cuelgue blockly ****************/
    /****** Deben tener sólo una línea, que sea un "hacer_luego" ********/
    /****** El nombre debe ser el que tendrá el bloque en blockly *******/
    ElMarcianoEnElDesierto.prototype.irDerecha = function () {
        this.personaje.hacer_luego(MoverACasillaDerecha);
    };
    ElMarcianoEnElDesierto.prototype.irIzquierda = function () {
        this.personaje.hacer_luego(MoverACasillaIzquierda);
    };
    ElMarcianoEnElDesierto.prototype.irArriba = function () {
        this.personaje.hacer_luego(MoverACasillaArriba);
    };
    ElMarcianoEnElDesierto.prototype.irAbajo = function () {
        this.personaje.hacer_luego(MoverACasillaAbajo);
    };
    ElMarcianoEnElDesierto.prototype.comerManzana = function () {
        this.personaje.hacer_luego(RecogerPorEtiqueta, { 'etiqueta': 'ManzanaAnimada', 'mensajeError': 'No hay una manzana aqui' });
    };
    return ElMarcianoEnElDesierto;
})(Base);
var ElMonoQueSabeContar = (function (_super) {
    __extends(ElMonoQueSabeContar, _super);
    function ElMonoQueSabeContar() {
        _super.apply(this, arguments);
        this.etiquetasDeObjetosAColocar = [ManzanaAnimada, BananaAnimada];
    }
    ElMonoQueSabeContar.prototype.iniciar = function () {
        this.estado = undefined;
        this.fondo = new Fondo('fondos.nubes.png', 0, 0);
        this.cantMaxColumnas = 10;
        this.definidor = new DefinidorColumnasRandom(5, 10);
        this.cuadricula = new CuadriculaMultiple(this.definidor);
        this.cuadricula.completarConObjetosRandom(this.etiquetasDeObjetosAColocar);
        this.mono = new MonoAnimado(0, 0);
        this.cuadricula.posicionarObjeto(this.mono, 0, 0);
        /*
                this.conta
        
                dorDeEtiquetas= new ContadorDeEtiquetas();
                this.contadorDeEtiquetas.agregarEtiqueta('ManzanaAnimada');
                this.contadorDeEtiquetas.agregarEtiqueta('BananaAnimada');
        */
        this.tableroBananas = new Tablero(150, 220, "Bananas");
        this.tableroManzanas = new Tablero(150, 230, "Manzanas");
        this.cantidadManzanas = new ObservadoConAumentar(0);
        this.cantidadBananas = new ObservadoConAumentar(0);
        this.cantidadManzanas.registrarObservador(this.tableroManzanas, 0);
        this.cantidadBananas.registrarObservador(this.tableroBananas, 0);
    };
    ElMonoQueSabeContar.prototype.personajePrincipal = function () {
        return this.mono;
    };
    ElMonoQueSabeContar.prototype.atras = function () {
        this.mono.hacer_luego(MoverACasillaIzquierda);
    };
    ElMonoQueSabeContar.prototype.avanzar = function () {
        this.mono.hacer_luego(MoverACasillaDerecha);
    };
    ElMonoQueSabeContar.prototype.siguienteFila = function () {
        this.mono.hacer_luego(avanzarFilaEnCuadriculaMultiple, { 'cuadriculaMultiple': this.cuadricula });
    };
    ElMonoQueSabeContar.prototype.contarBanana = function () {
        this.mono.hacer_luego(ContarPorEtiqueta, { 'etiqueta': 'BananaAnimada', 'mensajeError': 'No hay una banana aquí', 'dondeReflejarValor': this.cantidadBananas });
    };
    ElMonoQueSabeContar.prototype.contarManzana = function () {
        this.mono.hacer_luego(ContarPorEtiqueta, { 'etiqueta': 'ManzanaAnimada', 'mensajeError': 'No hay una manzana aquí', 'dondeReflejarValor': this.cantidadManzanas });
    };
    return ElMonoQueSabeContar;
})(Base);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
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
})(Habilidad);
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
})(Base);
var ElRecolectorDeEstrellas = (function (_super) {
    __extends(ElRecolectorDeEstrellas, _super);
    function ElRecolectorDeEstrellas() {
        _super.apply(this, arguments);
    }
    ElRecolectorDeEstrellas.prototype.iniciar = function () {
        this.fondo = new Fondo('fondos/nubes.png', 0, 0);
        //this.recolector.izquierda = pilas.izquierda();
        var cantidadFilas = 4;
        var cantidadColumnas = 5;
        this.cuadricula = new Cuadricula(0, 0, cantidadFilas, cantidadColumnas, { alto: 500 }, { grilla: 'casillaLightbot.png',
            cantColumnas: 5 });
        this.recolector = new RecolectorEstrellas(0, 0);
        this.cuadricula.agregarActor(this.recolector, cantidadFilas - 1, 0);
        // La posición inicial pretende respectar el ejemplo
        this.objetos = [];
        for (var fila = 0; fila < cantidadFilas; fila++) {
            for (var columna = 1; columna < cantidadColumnas; columna++) {
                var objeto = new Hueso(0, 0);
                this.cuadricula.agregarActor(objeto, fila, columna);
                this.objetos.push(objeto);
            }
        }
    };
    ElRecolectorDeEstrellas.prototype.volverAlBordeIzquierdo = function () {
        this.recolector.hacer_luego(MoverTodoAIzquierda);
    };
    ElRecolectorDeEstrellas.prototype.irArriba = function () {
        this.recolector.hacer_luego(MoverACasillaArriba);
    };
    ElRecolectorDeEstrellas.prototype.irDerecha = function () {
        this.recolector.hacer_luego(MoverACasillaDerecha);
    };
    ElRecolectorDeEstrellas.prototype.recogerEstrella = function () {
        this.recolector.hacer_luego(Recoger);
    };
    /*A partir de aqui no deberian ser bloques*/
    ElRecolectorDeEstrellas.prototype.intentaronRecoger = function () {
        var _this = this;
        if (this.tocandoEstrella()) {
            var objetos2 = this.objetos.filter(function (objeto) { return objeto.colisiona_con(_this.recolector); });
            var index = this.objetos.indexOf(objetos2[0]);
            var objeto = this.objetos.splice(index, 1);
            objeto[0].eliminar();
        }
        else {
            this.recolector.decir("¡No hay estrella!");
        }
    };
    ElRecolectorDeEstrellas.prototype.tocandoEstrella = function () {
        var _this = this;
        return this.objetos.some(function (objeto) { return objeto.colisiona_con(_this.recolector); });
        this.recolector.decir("Estoy toanco");
    };
    return ElRecolectorDeEstrellas;
})(Base);
var FutbolRobots = (function (_super) {
    __extends(FutbolRobots, _super);
    function FutbolRobots() {
        _super.apply(this, arguments);
    }
    FutbolRobots.prototype.iniciar = function () {
        this.estado = undefined;
        this.fondo = new Fondo('fondos.nubes.png', 0, 0);
        var cantidadFilas = 8;
        this.definidor = new DefinidorColumnasRandom(cantidadFilas, 10);
        this.cuadricula = new CuadriculaMultiple(this.definidor);
        this.robot = new RobotAnimado(0, 0);
        this.cuadricula.posicionarObjeto(this.robot, 0, 0);
        for (var fila = 0; fila < cantidadFilas; ++fila) {
            this.cuadricula.posicionarObjeto(new PelotaAnimada(0, 0), fila, this.cuadricula.filas[fila].cantidadColumnas - 1);
        }
    };
    FutbolRobots.prototype.atras = function () {
        this.robot.hacer_luego(MoverACasillaIzquierda);
    };
    FutbolRobots.prototype.avanzar = function () {
        this.robot.hacer_luego(MoverACasillaDerecha);
    };
    FutbolRobots.prototype.siguienteFila = function () {
        this.robot.hacer_luego(avanzarFilaEnCuadriculaMultiple, { 'cuadriculaMultiple': this.cuadricula });
    };
    FutbolRobots.prototype.patearPelota = function () {
    };
    return FutbolRobots;
})(Base);
var InstalandoJuegos = (function (_super) {
    __extends(InstalandoJuegos, _super);
    function InstalandoJuegos() {
        _super.apply(this, arguments);
    }
    InstalandoJuegos.prototype.iniciar = function () {
        this.fondo = new Fondo('fondos.biblioteca.png', 0, 0);
        var cantidadFilas = 1;
        var cantidadColumnas = 4;
        this.cuadricula = new Cuadricula(0, 0, cantidadFilas, cantidadColumnas, { alto: 100 }, { grilla: 'invisible.png',
            cantColumnas: 5 });
        this.instalador = new InstaladorAnimado(0, 0);
        this.cuadricula.agregarActor(this.instalador, 0, 0);
        for (var i = 1; i <= 3; ++i) {
            this.cuadricula.agregarActor(new CompuAnimada(0, 0), 0, i);
        }
        var builder = new BuilderStatePattern('inicial');
        builder.agregarEstadosPrefijados('prendido', 1, 3);
        builder.agregarEstadosPrefijados('escritoA', 1, 3);
        builder.agregarEstadosPrefijados('escritoB', 1, 3);
        builder.agregarEstadosPrefijados('escritoC', 1, 3);
        builder.agregarEstadosPrefijados('juegoInstalado', 1, 3);
        builder.agregarEstadosPrefijados('maquinaApagada', 1, 3);
        builder.agregarTransicionesIteradas('maquinaApagada', 'prendido', 'prender', 1, 3, 1, 3);
        builder.agregarTransicionesIteradas('prendido', 'escritoA', 'escribirA', 1, 3, 1, 3);
        builder.agregarTransicionesIteradas('escritoA', 'escritoB', 'escribirB', 1, 3, 1, 3);
        builder.agregarTransicionesIteradas('escritoB', 'escritoC', 'escribirC', 1, 3, 1, 3);
        builder.agregarTransicionesIteradas('escritoC', 'juegoInstalado', 'instalar', 1, 3, 1, 3);
        builder.agregarTransicionesIteradas('juegoInstalado', 'maquinaApagada', 'apagar', 1, 3, 1, 3);
        builder.agregarTransicion('inicial', 'prendido1', 'prender');
        builder.agregarTransicion('maquinaApagada1', 'prendido2', 'prender');
        builder.agregarTransicion('maquinaApagada2', 'prendido3', 'prender');
        //builder.agregarError('inicial','prender','Para prender una compu, hay que estar frente a ella')
        //No es necesario modelarlo, porque se encarga el comportamiento colision
        builder.agregarError('inicial', 'instalar', 'Primero hay que prender la computadora');
        builder.agregarError('inicial', 'escribirA', 'Primero hay que prender la computadora');
        builder.agregarError('inicial', 'escribirB', 'Primero hay que prender la computadora');
        builder.agregarError('inicial', 'escribirC', 'Primero hay que prender la computadora');
        builder.agregarErrorAVariosEstadosDeSalida('maquinaApagada', 'instalar', 'Primero hay que prender la computadora', 1, 3);
        builder.agregarErrorAVariosEstadosDeSalida('maquinaApagada', 'escribirC', 'Primero hay que prender la computadora', 1, 3);
        builder.agregarErrorAVariosEstadosDeSalida('maquinaApagada', 'escribirA', 'Primero hay que prender la computadora', 1, 3);
        builder.agregarErrorAVariosEstadosDeSalida('maquinaApagada', 'escribirB', 'Primero hay que prender la computadora', 1, 3);
        builder.agregarErrorAVariosEstadosDeSalida('prendido', 'escribirC', 'Esa no es la clave correcta', 1, 3);
        builder.agregarErrorAVariosEstadosDeSalida('prendido', 'escribirB', 'Esa no es la clave correcta', 1, 3);
        builder.agregarErrorAVariosEstadosDeSalida('escritoA', 'escribirC', 'Esa no es la clave correcta', 1, 3);
        builder.agregarErrorAVariosEstadosDeSalida('escritoA', 'escribirA', 'Esa no es la clave correcta', 1, 3);
        builder.agregarErrorAVariosEstadosDeSalida('escritoB', 'escribirB', 'Esa no es la clave correcta', 1, 3);
        builder.agregarErrorAVariosEstadosDeSalida('escritoB', 'escribirA', 'Esa no es la clave correcta', 1, 3);
        this.estado = builder.estadoInicial();
    };
    InstalandoJuegos.prototype.personajePrincipal = function () {
        return this.instalador;
    };
    InstalandoJuegos.prototype.siguienteCompu = function () {
        this.instalador.hacer_luego(MoverACasillaDerecha);
    };
    InstalandoJuegos.prototype.prenderCompu = function () {
        this.instalador.hacer_luego(PrenderPorEtiqueta, { 'etiqueta': 'CompuAnimada', 'mensajeError': 'No hay una compu aqui', 'idComportamiento': 'prender' });
    };
    InstalandoJuegos.prototype.apagarCompu = function () {
        this.instalador.hacer_luego(ApagarPorEtiqueta, { 'etiqueta': 'CompuAnimada', 'mensajeError': 'No hay una compu aqui', 'idComportamiento': 'apagar' });
    };
    InstalandoJuegos.prototype.instalarJuego = function () {
        this.instalador.hacer_luego(InstalarPorEtiqueta, { 'etiqueta': 'CompuAnimada', 'mensajeError': 'No hay una compu aqui', 'idComportamiento': 'instalar' });
    };
    InstalandoJuegos.prototype.escribirC = function () {
        this.instalador.hacer_luego(EscribirEnCompuAnimada, { 'etiqueta': 'CompuAnimada', 'mensajeError': 'No hay una compu aqui', 'idComportamiento': 'escribirC' });
    };
    InstalandoJuegos.prototype.escribirB = function () {
        this.instalador.hacer_luego(EscribirEnCompuAnimada, { 'etiqueta': 'CompuAnimada', 'mensajeError': 'No hay una compu aqui', 'idComportamiento': 'escribirB' });
    };
    InstalandoJuegos.prototype.escribirA = function () {
        this.instalador.hacer_luego(EscribirEnCompuAnimada, { 'etiqueta': 'CompuAnimada', 'mensajeError': 'No hay una compu aqui', 'idComportamiento': 'escribirA' });
    };
    return InstalandoJuegos;
})(Base);
var ApagarPorEtiqueta = (function (_super) {
    __extends(ApagarPorEtiqueta, _super);
    function ApagarPorEtiqueta() {
        _super.apply(this, arguments);
    }
    ApagarPorEtiqueta.prototype.metodo = function (objetoColision) {
        objetoColision.cargarAnimacion("apagada");
    };
    return ApagarPorEtiqueta;
})(ComportamientoColision);
var InstalarPorEtiqueta = (function (_super) {
    __extends(InstalarPorEtiqueta, _super);
    function InstalarPorEtiqueta() {
        _super.apply(this, arguments);
    }
    InstalarPorEtiqueta.prototype.metodo = function (objetoColision) {
        objetoColision.cargarAnimacion("instalado");
    };
    return InstalarPorEtiqueta;
})(ComportamientoColision);
var PrenderPorEtiqueta = (function (_super) {
    __extends(PrenderPorEtiqueta, _super);
    function PrenderPorEtiqueta() {
        _super.apply(this, arguments);
    }
    PrenderPorEtiqueta.prototype.metodo = function (objetoColision) {
        objetoColision.cargarAnimacion("prendida");
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
            objetoColision.cargarAnimacion("claveok");
        }
    };
    return EscribirEnCompuAnimada;
})(ComportamientoColision);
/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/BananaAnimada.ts" />
/// <reference path = "../actores/ManzanaAnimada.ts" />
/// <reference path = "../actores/MonoAnimado.ts" />}
/// <reference path = "../comportamientos/RecogerPorEtiqueta.ts" />}
/// <reference path = "../comportamientos/movimientosEnCuadricula.ts" />}
var LaEleccionDelMono = (function (_super) {
    __extends(LaEleccionDelMono, _super);
    function LaEleccionDelMono() {
        _super.apply(this, arguments);
    }
    LaEleccionDelMono.prototype.iniciar = function () {
        this.estado = undefined;
        this.fondo = new Fondo('fondos.nubes.png', 0, 0);
        var cantidadFilas = 1;
        var cantidadColumnas = 2;
        this.cuadricula = new Cuadricula(0, 0, cantidadFilas, cantidadColumnas, { alto: 100 }, { grilla: 'casillaLightbot.png',
            cantColumnas: 5 });
        this.mono = new MonoAnimado(0, 0);
        this.cuadricula.agregarActor(this.mono, 0, 0);
        if (Math.random() < .5) {
            this.agregar(ManzanaAnimada);
        }
        else {
            this.agregar(BananaAnimada);
        }
    };
    LaEleccionDelMono.prototype.agregar = function (objeto) {
        this.cuadricula.agregarActor(new objeto(0, 0), 0, 1);
    };
    LaEleccionDelMono.prototype.comerManzana = function () {
        this.mono.hacer_luego(RecogerPorEtiqueta, { 'etiqueta': 'ManzanaAnimada', 'mensajeError': 'No hay una manzana aqui' });
    };
    LaEleccionDelMono.prototype.comerBanana = function () {
        this.mono.hacer_luego(RecogerPorEtiqueta, { 'etiqueta': 'BananaAnimada', 'mensajeError': 'No hay una banana aqui' });
    };
    LaEleccionDelMono.prototype.avanzar = function () {
        this.mono.hacer_luego(MoverACasillaDerecha);
    };
    return LaEleccionDelMono;
})(Base);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Cuadricula.ts"/>
/// <reference path = "../actores/HeroeAnimado.ts"/>
/// <reference path = "../actores/CofreAnimado.ts"/>
/// <reference path = "../actores/LlaveAnimado.ts"/>
/// <reference path = "../actores/MagoAnimado.ts"/>
/// <reference path = "../actores/CaballeroAnimado.ts"/>
/// <reference path = "../actores/UnicornioAnimado.ts"/>
/// <reference path = "../habilidades/AvisaAlSalirDePantalla.ts"/>
/// <reference path = "../comportamientos/movimientosEnCuadricula.ts"/>
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
        this.cuadricula = new Cuadricula(0, 0, 4, 5, { alto: 300 }, { grilla: 'casillaLightbot.png',
            cantColumnas: 5 });
        // se ubican los actores
        this.llave = new LlaveAnimado(0, 0);
        this.cuadricula.agregarActor(this.llave, 1, 4);
        this.cofre = new CofreAnimado(0, 0);
        this.cuadricula.agregarActor(this.cofre, 0, 0);
        this.caballero = new CaballeroAnimado(0, 0);
        this.cuadricula.agregarActor(this.caballero, 1, 2);
        this.mago = new MagoAnimado(0, 0);
        this.cuadricula.agregarActor(this.mago, 3, 1);
        this.unicornio = new UnicornioAnimado(0, 0);
        this.cuadricula.agregarActor(this.unicornio, 3, 4);
        this.heroe = new HeroeAnimado(0, 0);
        this.cuadricula.agregarActor(this.heroe, 3, 0);
        this.heroe.aprender(AvisaAlSalirDePantalla, {});
        // se carga el estado inicial
        this.estado = new BuscandoLLaveState(this);
    };
    LaGranAventuraDelMarEncantado.prototype.moverArriba = function () {
        this.heroe.hacer_luego(MoverACasillaArriba);
    };
    LaGranAventuraDelMarEncantado.prototype.moverIzquierda = function () {
        this.heroe.hacer_luego(MoverACasillaIzquierda);
    };
    LaGranAventuraDelMarEncantado.prototype.moverDerecha = function () {
        this.heroe.hacer_luego(MoverACasillaDerecha);
    };
    LaGranAventuraDelMarEncantado.prototype.moverAbajo = function () {
        this.heroe.hacer_luego(MoverACasillaAbajo);
    };
    LaGranAventuraDelMarEncantado.prototype.agarrarLlave = function () {
        this.heroe.hacer_luego(ComportamientoDeAltoOrden, { 'receptor': this, 'metodo': this.doAgarrarLlave, 'nombreAnimacion': 'recoger' });
    };
    LaGranAventuraDelMarEncantado.prototype.abrirCofre = function () {
        this.heroe.hacer_luego(ComportamientoDeAltoOrden, { 'receptor': this, 'metodo': this.doAbrirCofre, 'nombreAnimacion': 'recoger' });
    };
    LaGranAventuraDelMarEncantado.prototype.darSombrero = function () {
        this.heroe.hacer_luego(ComportamientoDeAltoOrden, { 'receptor': this, 'metodo': this.doDarSombrero, 'nombreAnimacion': 'recoger' });
    };
    LaGranAventuraDelMarEncantado.prototype.atacarConEspada = function () {
        this.heroe.hacer_luego(ComportamientoDeAltoOrden, { 'receptor': this, 'metodo': this.doAtacarConEspada, 'nombreAnimacion': 'recoger' });
    };
    LaGranAventuraDelMarEncantado.prototype.escaparEnUnicornio = function () {
        this.heroe.hacer_luego(ComportamientoDeAltoOrden, { 'receptor': this, 'metodo': this.doEscaparEnUnicornio, 'nombreAnimacion': 'recoger' });
    };
    LaGranAventuraDelMarEncantado.prototype.doAgarrarLlave = function () {
        this.estado.agarrarLlave();
    };
    LaGranAventuraDelMarEncantado.prototype.doAbrirCofre = function () {
        this.estado.abrirCofre();
    };
    LaGranAventuraDelMarEncantado.prototype.doDarSombrero = function () {
        this.estado.darSombrero();
    };
    LaGranAventuraDelMarEncantado.prototype.doAtacarConEspada = function () {
        this.estado.atacarConEspada();
    };
    LaGranAventuraDelMarEncantado.prototype.doEscaparEnUnicornio = function () {
        this.estado.escaparEnUnicornio();
    };
    return LaGranAventuraDelMarEncantado;
})(Base);
var MarEncantadoState = (function () {
    function MarEncantadoState(escena) {
        this.escena = escena;
    }
    MarEncantadoState.prototype.agarrarLlave = function () {
        this.escena.heroe.decir("¡Aquí no está la llave!");
    };
    MarEncantadoState.prototype.abrirCofre = function () {
        this.escena.heroe.decir("¡Tengo que ir al cofre con la llave!");
    };
    MarEncantadoState.prototype.darSombrero = function () {
        this.escena.heroe.decir("¡Tengo que darle el sombrero al mago!");
    };
    MarEncantadoState.prototype.atacarConEspada = function () {
        this.escena.heroe.decir("¡Tengo que atacar con espada al cabellero!");
    };
    MarEncantadoState.prototype.escaparEnUnicornio = function () {
        this.escena.heroe.decir("¡Tengo que salvar a la princesa y escapar!");
    };
    return MarEncantadoState;
})();
var BuscandoLLaveState = (function (_super) {
    __extends(BuscandoLLaveState, _super);
    function BuscandoLLaveState(escena) {
        _super.call(this, escena);
    }
    BuscandoLLaveState.prototype.agarrarLlave = function () {
        if (this.escena.heroe.colisiona_con(this.escena.llave)) {
            this.escena.llave.eliminar();
            this.escena.estado = new BuscandoSombreroState(this.escena);
        }
        else {
            _super.prototype.agarrarLlave.call(this);
        }
    };
    return BuscandoLLaveState;
})(MarEncantadoState);
var BuscandoSombreroState = (function (_super) {
    __extends(BuscandoSombreroState, _super);
    function BuscandoSombreroState(escena) {
        _super.call(this, escena);
    }
    BuscandoSombreroState.prototype.abrirCofre = function () {
        if (this.escena.heroe.colisiona_con(this.escena.cofre)) {
            this.escena.cofre.eliminar();
            this.escena.estado = new BuscandoEspadaState(this.escena);
        }
        else {
            _super.prototype.abrirCofre.call(this);
        }
    };
    return BuscandoSombreroState;
})(MarEncantadoState);
var BuscandoEspadaState = (function (_super) {
    __extends(BuscandoEspadaState, _super);
    function BuscandoEspadaState(escena) {
        _super.call(this, escena);
    }
    BuscandoEspadaState.prototype.darSombrero = function () {
        if (this.escena.heroe.colisiona_con(this.escena.mago)) {
            this.escena.mago.eliminar();
            this.escena.estado = new IrALucharConCaballeroState(this.escena);
        }
        else {
            _super.prototype.darSombrero.call(this);
        }
    };
    return BuscandoEspadaState;
})(MarEncantadoState);
var IrALucharConCaballeroState = (function (_super) {
    __extends(IrALucharConCaballeroState, _super);
    function IrALucharConCaballeroState(escena) {
        _super.call(this, escena);
    }
    IrALucharConCaballeroState.prototype.atacarConEspada = function () {
        if (this.escena.heroe.colisiona_con(this.escena.caballero)) {
            this.escena.caballero.eliminar();
            this.escena.estado = new RescatandoPrincesaState(this.escena);
        }
        else {
            _super.prototype.atacarConEspada.call(this);
        }
    };
    return IrALucharConCaballeroState;
})(MarEncantadoState);
var RescatandoPrincesaState = (function (_super) {
    __extends(RescatandoPrincesaState, _super);
    function RescatandoPrincesaState(escena) {
        _super.call(this, escena);
    }
    RescatandoPrincesaState.prototype.escaparEnUnicornio = function () {
        if (this.escena.heroe.colisiona_con(this.escena.unicornio)) {
            this.escena.unicornio.eliminar();
            this.escena.estado = new MarEncantadoState(this.escena);
        }
        else {
            _super.prototype.escaparEnUnicornio.call(this);
        }
    };
    return RescatandoPrincesaState;
})(MarEncantadoState);
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
        this.personaje = new RatonAnimado(0, 0);
        this.cuadricula = new CuadriculaParaRaton(0, 0, 10, 10, { alto: 100 }, { '->': 'casillaDerecha.png', '<-': 'casillaIzquierda.png', 'v': 'casillaAbajo.png', '^': 'casillaArriba.png' }).dameCamino();
        this.cuadricula.agregarActor(this.personaje, 0, 0);
        this.cuadricula.completarConObjetosRandom(new conjuntoClases([QuesoAnimado]));
    };
    LaberintoConQueso.prototype.personajePrincipal = function () {
        return this.personaje;
    };
    LaberintoConQueso.prototype.moverDerecha = function () {
        this.personaje.hacer_luego(MoverACasillaDerechaEsparsa);
    };
    LaberintoConQueso.prototype.moverAbajo = function () {
        this.personaje.hacer_luego(MoverACasillaAbajoEsparsa);
    };
    LaberintoConQueso.prototype.ComerQueso = function () {
        //  this.personaje.hacer_luego(RecogerPorEtiqueta,{'etiqueta' : 'GloboAnimado',  'mensajeError' : 'No hay un globo aqui' });
    };
    return LaberintoConQueso;
})(Base);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Camino.ts"/>
/// <reference path = "../actores/PerroCohete.ts"/>
/// <reference path = "../comportamientos/movimientosEnCuadricula.ts"/>
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
        this.cuadricula2 = new Camino(0, 0, ['->', 'v', '->', '->'], 2, 4, { alto: 70 }, { grilla: 'casillaLightbot.png',
            cantColumnas: 5 });
        this.cuadricula = this.cuadricula2.dameCamino();
        this.perro = new PerroCohete(0, 0);
        this.cuadricula.agregarActor(this.perro, 0, 0);
        //this.robot.aprender(AvisaAlSalirDePantalla,{});
    };
    LaberintoCorto.prototype.irArriba = function () {
        this.perro.hacer_luego(MoverACasillaArriba);
    };
    LaberintoCorto.prototype.irAbajo = function () {
        this.perro.hacer_luego(MoverACasillaAbajo);
    };
    LaberintoCorto.prototype.irDerecha = function () {
        this.perro.hacer_luego(MoverACasillaDerecha);
    };
    LaberintoCorto.prototype.irIzquierda = function () {
        this.perro.hacer_luego(MoverACasillaIzquierda);
    };
    return LaberintoCorto;
})(Base);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Obrero.ts"/>
/// <reference path = "../actores/Cuadricula.ts"/>
/// <reference path = "../comportamientos/movimientosEnCuadricula.ts"/>
/**
 * @class LightBot
 *
 */
var LightBot = (function (_super) {
    __extends(LightBot, _super);
    function LightBot() {
        _super.apply(this, arguments);
    }
    LightBot.prototype.iniciar = function () {
        this.fondo = new Fondo('fondos.nubes.png', 0, 0);
        //this.robot.izquierda = pilas.izquierda();
        this.cuadricula = new Cuadricula(0, 0, 1, 7, { alto: 70 }, { grilla: 'casillaLightbot.png',
            cantColumnas: 5 });
        this.robot = new Obrero(0, 0);
        this.cuadricula.agregarActor(this.robot, 0, 0);
        //this.robot.aprender(AvisaAlSalirDePantalla,{});
    };
    LightBot.prototype.irArriba = function () {
        this.robot.hacer_luego(MoverACasillaArriba);
    };
    LightBot.prototype.irAbajo = function () {
        this.robot.hacer_luego(MoverACasillaAbajo);
    };
    LightBot.prototype.irDerecha = function () {
        this.robot.hacer_luego(MoverACasillaDerecha);
    };
    LightBot.prototype.irIzquierda = function () {
        this.robot.hacer_luego(MoverACasillaIzquierda);
    };
    return LightBot;
})(Base);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Cuadricula.ts"/>
/// <reference path = "../actores/Robot.ts"/>
/// <reference path = "../actores/CasillaConLuz.ts"/>
/// <reference path = "../comportamientos/movimientosEnCuadricula.ts"/>
/**
 * @class LightBotRecargado
 *
 */
var LightBotRecargado = (function (_super) {
    __extends(LightBotRecargado, _super);
    function LightBotRecargado() {
        _super.apply(this, arguments);
        this.objetos = [];
    }
    LightBotRecargado.prototype.iniciar = function () {
        this.fondo = new Fondo('fondos.estrellas.png', 0, 0);
        //this.robot.izquierda = pilas.izquierda();
        this.cuadricula = new Cuadricula(0, 0, 1, 11, {}, { grilla: 'casilla_base.png',
            cantColumnas: 1, alto: 38 });
        //se cargan las luces
        for (var i = 0; i < 11; i++) {
            if (Math.random() < .5) {
                this.agregarLuz(i);
            }
        }
        // se crea el personaje
        this.personaje = new Robot(0, 0);
        this.cuadricula.agregarActor(this.personaje, 0, 0);
    };
    LightBotRecargado.prototype.agregarLuz = function (columna) {
        var casillaLuminosa = new CasillaConLuz(0, 0);
        this.cuadricula.agregarActor(casillaLuminosa, 0, columna);
        casillaLuminosa.escala_x = .50;
        casillaLuminosa.escala_y = .50;
        this.objetos.push(casillaLuminosa);
    };
    LightBotRecargado.prototype.avanzar = function () {
        this.personaje.hacer_luego(MoverACasillaDerecha);
    };
    LightBotRecargado.prototype.prenderLuz = function () {
        this.personaje.hacer_luego(EncenderLuz);
    };
    return LightBotRecargado;
})(Base);
var ErrorEnEstados = (function () {
    function ErrorEnEstados(estado, mensaje) {
        this.estadoAlQueVuelve = estado;
        this.mensajeError = mensaje;
    }
    ErrorEnEstados.prototype.realizarAccion = function (comportamiento, estadoAnterior) {
        pilas.escena_actual().personajePrincipal().decir(this.mensajeError);
        console.log(estadoAnterior.identifier);
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
            pilas.escena_actual().estado = this.transiciones[idComportamiento].realizarAccion(comportamiento, this);
        }
        else {
            pilas.escena_actual().personajePrincipal().decir("¡Ups, ésa no era la opción correcta!");
        }
    };
    Estado.prototype.realizarAccion = function (comportamiento, estadoAnterior) {
        if (comportamiento.elEstadoEsValido()) {
            return this;
        }
        else {
            return estadoAnterior;
        }
    };
    return Estado;
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
            console.log("Agregando estados");
            console.log(prefix + i);
            this.estados[prefix + i] = new Estado(prefix + i);
        }
    };
    BuilderStatePattern.prototype.agregarTransicionesIteradas = function (estadoSalidaPrefix, estadoEntradaPrefix, transicion, inicialSalida, finSalida, inicialEntrada, finEntrada) {
        //pre: |estadosSalida|=|estadosEntrada|
        //implica finSalida-inicialSalida=finEntrada-InicialEntrada
        console.log("Agregando transiciones");
        var tamano = finSalida - inicialSalida;
        for (var index = 0; index <= tamano; ++index) {
            console.log(estadoSalidaPrefix + (inicialSalida + index));
            console.log(estadoEntradaPrefix + (inicialEntrada + index));
            this.estados[estadoSalidaPrefix + (inicialSalida + index)].agregarTransicion(this.estados[estadoEntradaPrefix + (inicialEntrada + index)], transicion);
        }
    };
    return BuilderStatePattern;
})();
var MariaLaComeSandias = (function (_super) {
    __extends(MariaLaComeSandias, _super);
    function MariaLaComeSandias() {
        _super.apply(this, arguments);
    }
    MariaLaComeSandias.prototype.iniciar = function () {
        this.estado = undefined;
        //this.recolector.izquierda = pilas.izquierda();
        var cantidadFilas = 5;
        this.cantidadColumnas = 6;
        this.cuadricula = new Cuadricula(0, 0, cantidadFilas, this.cantidadColumnas, { alto: 300, ancho: 300 }, { grilla: 'casillaLightbot.png',
            cantColumnas: 5 });
        this.maria = new MariaAnimada(0, 0);
        this.cuadricula.agregarActor(this.maria, cantidadFilas - 1, 0);
        this.maria.escala = 0.1;
        this.completarConSandias();
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
    MariaLaComeSandias.prototype.moverDerecha = function () {
        this.maria.hacer_luego(MoverACasillaDerecha);
    };
    MariaLaComeSandias.prototype.moverIzquierda = function () {
        this.maria.hacer_luego(MoverACasillaIzquierda);
    };
    MariaLaComeSandias.prototype.moverAbajo = function () {
        this.maria.hacer_luego(MoverACasillaAbajo);
    };
    MariaLaComeSandias.prototype.moverArriba = function () {
        this.maria.hacer_luego(MoverACasillaArriba);
    };
    MariaLaComeSandias.prototype.morderSandia = function () {
        this.maria.hacer_luego(MorderPorEtiqueta, { 'etiqueta': 'SandiaAnimada', 'mensajeError': 'Acá no hay una sandía' });
    };
    MariaLaComeSandias.prototype.personajePrincipal = function () {
        return this.maria;
    };
    return MariaLaComeSandias;
})(Base);
/// <reference path = "../../dependencias/pilasweb.d.ts" />
/// <reference path = "../comportamientos/SaltarHablando.ts" />
/// <reference path = "../escenas/ElObreroCopado.ts" />
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
        this.fondo = new Fondo('fondos.obrero.png', 0, 0);
        this.obrero = new Obrero(160, -100);
        this.obrero.aprender(AvisaAlSalirDePantalla, {});
        this.saltosRestantes = 30;
    };
    NoMeCansoDeSaltar.prototype.saltarHablando = function () {
        this.obrero.hacer_luego(SaltarHablando);
    };
    NoMeCansoDeSaltar.prototype.fraseAlSaltar = function () {
        this.saltosRestantes--;
        return this.saltosRestantes.toString();
    };
    return NoMeCansoDeSaltar;
})(ElObreroCopado);
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
        this.cuadricula = new Cuadricula(0, 0, this.cantidadFilas, this.cantidadColumnas, { alto: 300, ancho: 300 }, { grilla: 'casillaLightbot.png',
            cantColumnas: 5 });
        this.buzo = new Robot(0, 0);
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
})(Base);
var ReparandoLaNave = (function (_super) {
    __extends(ReparandoLaNave, _super);
    function ReparandoLaNave() {
        _super.apply(this, arguments);
    }
    ReparandoLaNave.prototype.iniciar = function () {
        this.fondo = new Fondo('fondos.reparandoLaNave.png', 0, 0);
        var cantidadFilas = 4;
        var cantidadColumnas = 5;
        this.cuadricula = new Cuadricula(0, 0, cantidadFilas, cantidadColumnas, { alto: 100 }, { grilla: 'casilla.reparandoNave.png',
            cantColumnas: 5 });
        this.personaje = new MarcianoVerdeAnimado(0, 0);
        this.nave = new NaveAnimada(0, 0);
        this.cuadricula.agregarActor(this.nave, cantidadFilas - 1, 0);
        this.cuadricula.agregarActor(this.personaje, cantidadFilas - 1, 0);
        this.cuadricula.agregarActor(new HierroAnimado(0, 0), 0, 0);
        this.cuadricula.agregarActor(new CarbonAnimado(0, 0), 0, cantidadColumnas - 1);
        this.tableroHierro = new Tablero(150, 220, "Hierro");
        this.tableroCarbon = new Tablero(150, 230, "Carbon");
        this.cantidadCarbon = new ObservadoConDisminuir(3);
        this.cantidadHierro = new ObservadoConDisminuir(3);
        this.cantidadCarbon.registrarObservador(this.tableroCarbon);
        this.cantidadHierro.registrarObservador(this.tableroHierro);
        var builder = new BuilderStatePattern('estoy00');
        this.definirTransiciones(builder);
        this.estado = builder.estadoInicial();
    };
    ReparandoLaNave.prototype.personajePrincipal = function () {
        return this.personaje;
    };
    ReparandoLaNave.prototype.definirTransiciones = function (builder) {
        //modelo estoyCH como cantidad de carbon y de hierro ya depositados,
        //CestoyCH como tengo carbon en mano
        // y HestoyCH como tengo hierro en mano.
        //Estados donde no tengo nada en la mano.
        for (var hierro = 0; hierro <= 3; hierro++) {
            for (var carbon = 0; carbon <= 3; carbon++) {
                console.log("Agregando estados");
                console.log(('estoy' + hierro) + carbon);
                console.log((('estoy' + hierro) + carbon) + 'carbon');
                console.log((('estoy' + hierro) + carbon) + 'hierro');
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
                    console.log("Transición");
                    console.log((('estoy' + hierro) + carbon) + 'hierro');
                    console.log((('estoy' + (hierro + 1)) + carbon));
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
    ReparandoLaNave.prototype.moverDerecha = function () {
        this.personaje.hacer_luego(MoverACasillaDerecha);
    };
    ReparandoLaNave.prototype.moverIzquierda = function () {
        this.personaje.hacer_luego(MoverACasillaIzquierda);
    };
    ReparandoLaNave.prototype.moverArriba = function () {
        this.personaje.hacer_luego(MoverACasillaArriba);
    };
    ReparandoLaNave.prototype.moverAbajo = function () {
        this.personaje.hacer_luego(MoverACasillaAbajo);
    };
    ReparandoLaNave.prototype.tomarHierro = function () {
        this.personaje.hacer_luego(TomarYContarPorEtiqueta, { 'etiqueta': 'HierroAnimado', 'mensajeError': 'No hay hierro aquí', 'dondeReflejarValor': this.cantidadHierro, 'idComportamiento': 'tomarHierro' });
    };
    ReparandoLaNave.prototype.tomarCarbon = function () {
        this.personaje.hacer_luego(TomarYContarPorEtiqueta, { 'etiqueta': 'CarbonAnimado', 'mensajeError': 'No hay Carbon aquí', 'dondeReflejarValor': this.cantidadCarbon, 'idComportamiento': 'tomarCarbon' });
    };
    ReparandoLaNave.prototype.depositar = function () {
        this.personaje.hacer_luego(Depositar, { 'etiqueta': 'NaveAnimada', 'mensajeError': 'La nave no está aquí', 'idComportamiento': 'depositar' });
    };
    ReparandoLaNave.prototype.escapar = function () {
    };
    return ReparandoLaNave;
})(Base);
var Depositar = (function (_super) {
    __extends(Depositar, _super);
    function Depositar() {
        _super.apply(this, arguments);
    }
    Depositar.prototype.metodo = function (objetoColision) {
        pilas.escena_actual().personajePrincipal().cargarAnimacion("parado");
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
        this.argumentos['dondeReflejarValor'].disminuir(1);
        if (this.argumentos['dondeReflejarValor'].dameAtributo() == 0) {
            objetoColision.eliminar();
        }
        pilas.escena_actual().personajePrincipal().cargarAnimacion("con" + this.argumentos['etiqueta'] + "EnMano");
    };
    return TomarYContarPorEtiqueta;
})(ComportamientoColision);
var SuperLightBot1 = (function (_super) {
    __extends(SuperLightBot1, _super);
    function SuperLightBot1() {
        _super.apply(this, arguments);
        this.cantidadMaxColumnas = 9;
        this.altoCasilla = 30;
    }
    SuperLightBot1.prototype.iniciar = function () {
        this.inicializarEscenaAleatoriamente();
        this.encenderTodasLasCasillas();
    };
    SuperLightBot1.prototype.inicializarEscenaAleatoriamente = function () {
        this.fondo = new Fondo('fondos.estrellas.png', 0, 0);
        this.cantidadColumnas = Math.floor((Math.random() * this.cantidadMaxColumnas) + 3);
        this.cuadricula = new Cuadricula(-200 + (this.cantidadColumnas / 2) * this.altoCasilla, 0, 1, this.cantidadColumnas, { alto: this.altoCasilla, ancho: this.altoCasilla * this.cantidadColumnas }, { grilla: 'casilla_base.png', cantColumnas: 1, alto: 38 });
        this.personaje = new Robot(0, 0);
        this.cuadricula.agregarActor(this.personaje, 0, 0);
    };
    SuperLightBot1.prototype.encenderTodasLasCasillas = function () {
        //la primera y la ultima nunca se encienden
        for (var i = 1; i < this.cantidadColumnas - 1; i++) {
            this.agregarLuz(i);
        }
    };
    return SuperLightBot1;
})(LightBotRecargado);
var SuperLightBot2 = (function (_super) {
    __extends(SuperLightBot2, _super);
    function SuperLightBot2() {
        _super.apply(this, arguments);
    }
    /*
       cantidadMaxColumnas = 9;
       cuadricula;
       fondo;
       personaje;
       altoCasilla = 30;
       cantidadColumnas;
       */
    SuperLightBot2.prototype.iniciar = function () {
        this.inicializarEscenaAleatoriamente();
        this.encenderAlgunasCasillasAleatoriamente();
    };
    SuperLightBot2.prototype.encenderAlgunasCasillasAleatoriamente = function () {
        //la primera y la ultima nunca se encienden
        for (var i = 1; i < this.cantidadColumnas - 1; i++) {
            if (Math.random() < .6) {
                this.agregarLuz(i);
            }
        }
    };
    return SuperLightBot2;
})(SuperLightBot1);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Cuadricula.ts"/>
/// <reference path = "../actores/PerroCohete.ts"/>
/// <reference path = "../actores/Hueso.ts"/>
/// <reference path = "../comportamientos/movimientosEnCuadricula.ts"/>
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
        this.personaje = new PerroCohete(0, 0);
        this.restantesKM = this.totalKM;
    };
    SuperViaje.prototype.volarUnKM = function () {
        if (this.restantesKM == 0) {
            this.personaje.decir("¡Llegué!");
            return;
        }
        if (this.restantesKM == 1) {
            this.personaje.decir("¡Faltan 1 kilometro!");
        }
        else {
            this.personaje.decir("¡Faltan " + (this.restantesKM - 1) + " kilometros!");
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
})(Base);
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Cuadricula.ts"/>
/// <reference path = "../actores/PerroCohete.ts"/>
/// <reference path = "../actores/Hueso.ts"/>
/// <reference path = "../comportamientos/movimientosEnCuadricula.ts"/>
/**
 * @class TresHuesos
 *
 */
var TresHuesos = (function (_super) {
    __extends(TresHuesos, _super);
    function TresHuesos() {
        _super.apply(this, arguments);
        this.objetos = [];
    }
    TresHuesos.prototype.iniciar = function () {
        this.estado = undefined;
        this.fondo = new Fondo('fondos.nubes.png', 0, 0);
        this.cuadricula = new Cuadricula(0, 0, 1, 4, { alto: 70 }, { grilla: 'casillaLightbot.png',
            cantColumnas: 5 });
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
        this.personaje = new PerroCohete(0, 0);
        this.cuadricula.agregarActor(this.personaje, 0, 0);
    };
    TresHuesos.prototype.agregarHueso = function (columna) {
        var objeto = new Hueso(0, 0);
        this.cuadricula.agregarActor(objeto, 0, columna);
        this.objetos.push(objeto);
    };
    TresHuesos.prototype.comerHueso = function () {
        this.personaje.hacer_luego(RecogerPorEtiqueta, { 'etiqueta': 'Hueso', 'mensajeError': 'No hay un hueso aqui' });
    };
    TresHuesos.prototype.avanzar = function () {
        this.personaje.hacer_luego(MoverACasillaDerecha);
    };
    return TresHuesos;
})(Base);
