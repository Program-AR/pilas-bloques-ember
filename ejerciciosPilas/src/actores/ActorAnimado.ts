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
class ActorAnimado extends Actor {
    opciones;
    _casillaActual;
    cuadricula;
    objetosRecogidos;
    pausado;
    habilidadesSuspendidas;


    constructor(x, y, opciones) {
        this.desPausar();
        this.sanitizarOpciones(opciones);
        super(this.animacionPara(this.opciones.grilla), x, y);
        this.z = pilas.escena_actual().minZ() - 1;

        this.setupAnimacion();

        this.objetosRecogidos = [];
        this.habilidadesSuspendidas = [];
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

    definirAnimacion(nombre, cuadros, velocidad, cargarla = false){
        this._imagen.definir_animacion(nombre, cuadros, velocidad);
        if (cargarla) this.cargarAnimacion(nombre);
    }

    pasito_correr() {
        this.cargarAnimacion("correr");
        this._imagen.avanzar();
    }

    tocando(etiqueta) : Boolean {
      return pilas.obtener_actores_con_etiqueta(etiqueta).some(objeto => objeto.colisiona_con(this))
      //var actores = pilas.obtener_actores_en(this.x, this.y + 20, etiqueta);
      //return actores.length > 0;
    };

    hayAbajo():Boolean{
      return this.cuadricula.hayAbajo(this.casillaActual());
    }
    hayArriba():Boolean{
      return this.cuadricula.hayArriba(this.casillaActual());
    }
    hayDerecha():Boolean{
      return this.cuadricula.hayDerecha(this.casillaActual());
    }
    hayIzquierda():Boolean{
      return this.cuadricula.hayIzquierda(this.casillaActual());
    }

    alFinalDelCamino():Boolean{
      return this.casillaActual()==this.cuadricula.casillas[this.cuadricula.casillas.length-1];
    }

    estoyUltimaFila() : Boolean {
      return this.cuadricula.cantFilas-1==this.casillaActual().nroFila;
    }

    cambiarImagen(nombre){
        this.imagen = this.animacionPara(nombre);
    }

    animacionPara(nombre) {
        return pilas.imagenes.cargar_animacion(nombre, this.opciones.cantColumnas, this.opciones.cantFilas);
    }

    tocandoFin() : Boolean {
      return this.casillaActual().casillaASuDerecha()==undefined
    // return  pilas.escena_actual().cuadricula.tocandoFin(this)
    // cada cuadricula (multiple,esparsa,etc) implementa su tocandoFin de manera diferente
    }

    tocandoInicio() : Boolean {
      return this.casillaActual().nroColumna==0;
    }

    setupAnimacion(){
        this.definirAnimacion("correr", this.opciones.cuadrosCorrer, 5);
        this.definirAnimacion("parado", this.opciones.cuadrosParado, 5);
        this.animar();
        this.cargarAnimacion("parado");
    }

    detenerAnimacion(){
        this.olvidar(Animar);
    }

    animar(){
        this.aprender(Animar, {}); //Hace la magia de animar constantemente.
    }

    cargarAnimacion(nombre){
    	this._imagen.cargar_animacion(nombre);
    }

    avanzarAnimacion() : Boolean {
    	return !this._imagen.avanzar();
    }

    cantidadDeSprites() : Number {
        return this._imagen.animacion_en_curso.cuadros.length;
    }

    nombreAnimacionActual() : String {
        return this._imagen.animacion_en_curso.nombre;
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

    clonar(){
        /*var clon =*/ return new (<any>this).constructor(this.x, this.y, this.opciones);
        /*for (var attr in this){
            if(typeof this[attr] != "function"){
                clon[attr] = this[attr];
            }
        }
        return clon;*/
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

    largoColumnaActual(){
      return this.cuadricula.largoColumna(this.casillaActual().nroColumna);
    }

    cuando_busca_recoger() {
        pilas.escena_actual().intentaronRecoger();
    }
    recoger(a) {
        pilas.escena_actual().intentaronRecoger(a);
    }

    colisiona_con(objeto) : Boolean {
      if(this.cuadricula){
        return this.cuadricula.colisionan(this,objeto);
      }else{
        return super.colisiona_con(objeto)
      }

    }

    suspenderHabilidadesConMovimiento(){
        this.habilidadesSuspendidas = this.habilidadesSuspendidas.concat(
            this.habilidades.filter( hab => hab.implicaMovimiento() ));
        this.habilidadesSuspendidas.forEach( hab => this.olvidar(hab));
    }
    activarHabilidadesConMovimiento(){
        this.habilidadesSuspendidas.forEach(function(hab) {
            hab.actualizarPosicion();
            this.aprender(hab);
        }.bind(this));
        this.habilidadesSuspendidas = [];
    }

}

// Helper para construir las animaciones:
class Cuadros {
    _lista :Array<Number>;
    constructor(nroOLista){
        this._lista = (typeof (nroOLista) === "number") ? [nroOLista] : nroOLista;
    }
    repetirVeces(veces){
        var lOrig = this._lista;
        for (var i = 0; i < veces-1; i++) {
            this._lista = this._lista.concat(lOrig);
        }
        return this._lista;
    }
    repetirRandom(veces){
        return this.repetirVeces(Math.round(Math.random() * veces));
    }
    lista(){
        return this._lista;
    }
}
