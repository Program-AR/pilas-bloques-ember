/// <reference path = "../../dependencias/pilasweb.d.ts" />


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
class ActorAnimado extends Actor {
    opciones;
    _casillaActual;
    cuadricula;
    objetosRecogidos;
    pausado;


    constructor(x, y, opciones) {
        this.desPausar();
        this.sanitizarOpciones(opciones);
        super(this.animacionPara(this.opciones.grilla), x, y);

        this.definirAnimacion("correr", this.opciones.cuadrosCorrer, 5);
        this.definirAnimacion("parado", this.opciones.cuadrosParado, 5);
        //this.aprender(SerAnimado,{})

        this.detener_animacion();
        this.objetosRecogidos = [];
    }

    pre_actualizar(){
        if (!this.pausado) super.pre_actualizar();
    }

    pausar(){
        this.pausado = true;
    }

    desPausar(){
        this.pausado = false;
    }

    sanitizarOpciones(ops){
        this.opciones = ops;
        this.opciones.cuadrosCorrer = ops.cuadrosCorrer || this.seguidillaHasta(ops.cantColumnas) || [0];
        this.opciones.cuadrosParado = ops.cuadrosParado || [0];
        this.opciones.cantColumnas = ops.cantColumnas || this.opciones.cuadrosCorrer.length;
        this.opciones.cantFilas = ops.cantFilas || 1;
    }

    mover(x,y) {
        this.x += x;
        this.y += y;
        this.pasito_correr();
    }

    definirAnimacion(nombre, cuadros, velocidad){
        this._imagen.definir_animacion(nombre, cuadros, velocidad);
    }

    pasito_correr() {
        this.cargarAnimacion("correr");
        this._imagen.avanzar();
    }

    tocando(etiqueta){
      return pilas.obtener_actores_con_etiqueta(etiqueta).some(objeto => objeto.colisiona_con(this))
      //var actores = pilas.obtener_actores_en(this.x, this.y + 20, etiqueta);
      //return actores.length > 0;
    };

    estoyUltimaFila(){
      return this.cuadricula.cantFilas-1==this.casillaActual().nroFila;
    }

    cambiarImagen(nombre){
        this.imagen = this.animacionPara(nombre);
    }

    animacionPara(nombre){
        return pilas.imagenes.cargar_animacion(nombre, this.opciones.cantColumnas, this.opciones.cantFilas);
    }

    tocandoFin(){
    return this.casillaActual().casillaASuDerecha()==undefined
    // return  pilas.escena_actual().cuadricula.tocandoFin(this)
    // cada cuadricula (multiple,esparsa,etc) implementa su tocandoFin de manera diferente
    }

    tocandoInicio(){
      return this.casillaActual().nroColumna==0;
    }

    detener_animacion() {
        this.cargarAnimacion("parado");
    }

    cargarAnimacion(nombre){
    	this._imagen.cargar_animacion(nombre);
    }

    avanzarAnimacion(){
    	return !this._imagen.avanzar();
    }

    cantidadDeSprites(){
        return this._imagen.animacion_en_curso.cuadros.length;
    }

    seguidillaHasta(nro){
        var seguidilla = [];
        if(nro !== undefined) {
            for(var i = 0; i < nro; i++){
                seguidilla.push(i);
            }
        } else {
            seguidilla.push(0);
        }
        return seguidilla;
    }

    //TODO poner en otra clase lo q tenga q ver con casillas
    casillaActual(){
        return this._casillaActual;
    }
    setCasillaActual(c, moverseAhi=false){
        this._casillaActual = c;
        if (moverseAhi){
            this.x = c.x;
            this.y = c.y;
        }
    }

    cuando_busca_recoger() {
        pilas.escena_actual().intentaronRecoger();
    }
    recoger(a) {
        pilas.escena_actual().intentaronRecoger(a);
    }

    colisiona_con(objeto){
      if(this.cuadricula){
        return this.cuadricula.colisionan(this,objeto);
      }else{
        return super.colisiona_con(objeto)
      }

    }

}
