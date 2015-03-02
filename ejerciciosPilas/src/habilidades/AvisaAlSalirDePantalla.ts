/// <reference path = "../../dependencias/pilasweb.d.ts"/>


//No sólo avisa al salir de la pantalla, sino que no lo deja irse.
//Usar en reemplazo de la habilidad SeMantieneEnPantalla
// TODO: Repite código con SeMantieneEnPantalla, modificar pilas para que deje de hacerlo.

class AvisaAlSalirDePantalla extends Habilidad {
    
    constructor(receptor) {
        super(receptor);
        this.receptor.evto_se_movio.conectar(this);
    }
    
    recibir(evento, tipo) {
      if (tipo == this.receptor.evto_se_movio && 
            this.seSalioDeLaPantalla()) {
         this.meterActorEnPantalla();
         this.accionLuegoDeMeterEnPantalla();
      }
    }
    
    accionLuegoDeMeterEnPantalla(){
        this.receptor.decir("¡Me salgo de la pantalla!");
    }
   
    meterActorEnPantalla(){
        if (this.meFuiDerecha())
            this.receptor.derecha = pilas.derecha();
        
        if (this.meFuiIzquierda())
            this.receptor.izquierda = pilas.izquierda();
        
        if (this.meFuiArriba())
            this.receptor.arriba = pilas.arriba();
        
        if (this.meFuiAbajo())
            this.receptor.abajo = pilas.abajo();
    }
    
    seSalioDeLaPantalla(){
        return  this.meFuiDerecha() ||
                this.meFuiIzquierda() ||
                this.meFuiArriba() ||
                this.meFuiAbajo();
    }
    
    meFuiIzquierda(){
        return this.receptor.izquierda < pilas.izquierda();
    }
    
    meFuiDerecha(){
        return this.receptor.derecha > pilas.derecha();
    }
    
    meFuiArriba(){
        return this.receptor.arriba > pilas.arriba();
    }
    
    meFuiAbajo(){
        return this.receptor.abajo < pilas.abajo(); 
    }
}