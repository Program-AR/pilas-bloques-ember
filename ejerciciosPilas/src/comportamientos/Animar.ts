/// <reference path = "../../dependencias/pilasweb.d.ts" />

class Animar extends Comportamiento{
    paso;
    imagenAnterior;
    
    iniciar(receptor) {
        super.iniciar(receptor);
        this.sanitizarArgumentos();
        this.imagenAnterior = this.receptor._imagen;
        this.receptor.imagen = pilas.imagenes.cargar_grilla(this.argumentos.grilla, this.argumentos.cantColumnas);
        this.receptor._imagen.definir_cuadro(this.argumentos.cuadroEstatico);
        this.paso = 0;
    }
    
    actualizar() {
        this.paso += 0.3;
        if (this.paso>this.argumentos.cantColumnas) {
            this.paso = 0;
            this.argumentos.cantEjecuciones -= 1;
            if (this.argumentos.cantEjecuciones === 0) {
                this.terminarrlo();
                return true;
            }
        }
        this.receptor._imagen.definir_cuadro(this.argumentos.cuadros[parseInt(this.paso)]);
    }
    
    terminarrlo(){
        this.receptor.imagen = this.imagenAnterior ;
    }
    
    seguidillaHastaCant(){
        var seguidilla = [];
        if(this.argumentos.cantColumnas !== undefined) {
            for(var i = 0; i < this.argumentos.cantColumnas; i++){
                seguidilla.push(i);
            }
        }
        return seguidilla;
    }
    
    sanitizarArgumentos(){
        this.argumentos.cantEjecuciones = this.argumentos.cantEjecuciones || 1 ;
        this.argumentos.velocidad = this.argumentos.velocidad || 2;
        this.argumentos.cuadros = this.argumentos.cuadros || this.seguidillaHastaCant() || [0];
        this.argumentos.cantColumnas = this.argumentos.cantColumnas || this.argumentos.cuadros.length;
        this.argumentos.cuadroEstatico = this.argumentos.cuadroEstatico || 0;
    }
}