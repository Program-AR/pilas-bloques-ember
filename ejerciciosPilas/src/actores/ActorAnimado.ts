/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts" />
/// <reference path = "../habilidades/Animar.ts" />
/// <reference path = "../escenas/Errores.ts" />

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
    pilaAnimaciones;


    constructor(x, y, opciones) {
        this.desPausar();
        this.sanitizarOpciones(opciones);
        super(this.animacionPara(this.opciones.grilla), x, y);
        this.z = this.escena.minZ() - 1;

        this.setupAnimacion();

        this.objetosRecogidos = [];
        this.habilidadesSuspendidas = [];
        this.pilaAnimaciones = [];
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
        this.opciones.cuadrosError = ops.cuadrosError || this.opciones.cuadrosParado;
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

    tocando(etiqueta) : boolean {
      return pilas.obtener_actores_con_etiqueta(etiqueta).some(objeto => objeto.colisiona_con(this));
    }

		objetoTocado(etiqueta) {
			return pilas.obtener_actores_con_etiqueta(etiqueta).filter(objeto => objeto.colisiona_con(this))[0];
		}

    hayAbajo():boolean{
      return this.cuadricula.hayAbajo(this.casillaActual());
    }
    hayArriba():boolean{
      return this.cuadricula.hayArriba(this.casillaActual());
    }
    hayDerecha():boolean{
      return this.cuadricula.hayDerecha(this.casillaActual());
    }
    hayIzquierda():boolean{
      return this.cuadricula.hayIzquierda(this.casillaActual());
    }

    tieneEnLaCasillaDeArriba(etiqueta : string) : boolean {
        if (this.hayArriba()) {
            return this.casillaActual().casillaDeArriba().tieneActorConEtiqueta(etiqueta);
        }
        else {
            throw new ActividadError("¡No hay nada para ver arriba!")
        }
    }
    tieneEnLaCasillaDeAbajo(etiqueta: string): boolean {
        if (this.hayAbajo()) {
            return this.casillaActual().casillaDeAbajo().tieneActorConEtiqueta(etiqueta);
        }
        else {
            throw new ActividadError("¡No hay nada para ver abajo!")
        }
    }
    tieneEnLaCasillaASuIzquierda(etiqueta : string) : boolean {
        if (this.hayIzquierda()) {
            return this.casillaActual().casillaASuIzquierda().tieneActorConEtiqueta(etiqueta);
        }
        else {
            throw new ActividadError("¡No hay nada para ver a la izquierda!")
        }
    }
    tieneEnLaCasillaASuDerecha(etiqueta : string) : boolean {
        if (this.hayDerecha()) {
            return this.casillaActual().casillaASuDerecha().tieneActorConEtiqueta(etiqueta);
        }
        else {
            throw new ActividadError("¡No hay nada para ver a la derecha!")
        }
    }

    hayEnEscena(etiqueta: string) : boolean {
        return this.escena.contarActoresConEtiqueta(etiqueta) > 0;
    }

    tocandoFlechaAbajo():boolean {
      if (this.alFinalDelCamino()) throw new ActividadError("No se puede preguntar más, ya estoy al final del camino");
      return this.hayAbajo();
    }
    tocandoFlechaDerecha():boolean {
      if (this.alFinalDelCamino()) throw new ActividadError("No se puede preguntar más, ya estoy al final del camino");
      return this.hayDerecha();
    }

    alFinalDelCamino():boolean{
        return ! this.casillaActual().hayAbajo() && ! this.casillaActual().hayDerecha();
    }

    estoyUltimaFila() : boolean {
      return this.cuadricula.cantFilas-1==this.casillaActual().nroFila;
    }

    cambiarImagen(nombre){
        this.imagen = this.animacionPara(nombre);
    }

    animacionPara(nombre) {
        return pilas.imagenes.cargar_animacion(nombre, this.opciones.cantColumnas, this.opciones.cantFilas);
    }

    tocandoFin() : boolean {
      return this.casillaActual().casillaASuDerecha()==undefined
    // return  pilas.escena_actual().cuadricula.tocandoFin(this)
    // cada cuadricula (multiple,esparsa,etc) implementa su tocandoFin de manera diferente
    }

    tocandoInicio() : boolean {
      return this.casillaActual().nroColumna==0;
    }

    setupAnimacion(){
        this.definirAnimacion("correr", this.opciones.cuadrosCorrer, 5);
        this.definirAnimacion("parado", this.opciones.cuadrosParado, 5);
        this.definirAnimacion("error", this.opciones.cuadrosError, 5);
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

    /**
     * Permite cargar una animación recordando el nombre de la animación en curso.
     * Luego, se puede volver a la animación anterior mediante .restaurarAnimacionAnterior().
     */
    cargarAnimacionTemporalmente(nombre : string) {
        this.pilaAnimaciones.push(this._imagen.animacion_en_curso.nombre);
        this.cargarAnimacion(nombre);
    }

    /**
     * Vuelve a cargar la animación que estaba en curso la última vez que se ejecutó
     * .cargarAnimacionTemporalmente().
     */
    restaurarAnimacionAnterior() {
        if (this.pilaAnimaciones.length > 0) {
            this.cargarAnimacion(this.pilaAnimaciones.pop());
        }
    }

    avanzarAnimacion() : boolean {
    	return !this._imagen.avanzar();
    }

    cantidadDeSprites() : Number {
        return this._imagen.animacion_en_curso.cuadros.length;
    }

    nombreAnimacionActual() : string {
        return this._imagen.animacion_en_curso.nombre;
    }

    ponerMaximaVelocidad(){
      for (var nombre in this._imagen.animaciones){
        this._imagen.animaciones[nombre].velocidad = 60;
      }
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

    get escena() {
        // Se asume que todos los actores animados están en la escena actual
        return pilas.escena_actual();
    }

    //TODO poner en otra clase lo q tenga q ver con casillas
    casillaActual(){
        return this._casillaActual;
    }
    setCasillaActual(casillaNueva, moverseAhi=false){
        if(this._casillaActual) this._casillaActual.eliminarActor(this);
        this._casillaActual = casillaNueva;
        casillaNueva.agregarActor(this);
        if (moverseAhi){
            this.x = casillaNueva.x;
            this.y = casillaNueva.y;
        }
    }
    estaEnCasilla(nroFila,nroColumna){
      return this.casillaActual().sos(nroFila,nroColumna);
    }

    largoColumnaActual(){
      return this.cuadricula.largoColumna(this.casillaActual().nroColumna);
    }

    cuando_busca_recoger() {
        this.escena.intentaronRecoger();
    }
    recoger(a) {
        this.escena.intentaronRecoger(a);
    }

    informarError(error: ActividadError){
        this.hacer(Decir, {mensaje: error.message, nombreAnimacion: error.nombreAnimacion, autoEliminarGlobo: false});
    }

    // TODO: Esto debería estar en Estudiante, en pilasweb.
    eliminar_comportamientos(){
        this.comportamiento_actual = undefined;
        this.comportamientos = [];
    }
    
    colisiona_con(objeto) : boolean {
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
    enviarAlFrente(){
        this.setZ(Math.min.apply(Math,this.escena.actores.map(act => act.getZ()))-1);
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
