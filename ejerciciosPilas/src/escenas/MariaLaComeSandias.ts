/// <reference path = "EscenaActividad.ts" />

class MariaLaComeSandias extends EscenaActividad {
    cuadricula;
    automata;
    cantidadColumnas;
    estado;
    fondo;

    iniciar() {
        this.estado=undefined;
        this.fondo = new Fondo('fondo.mariaSandia.png',0,0);
        var cantidadFilas=5
        this.cantidadColumnas=6
        this.cuadricula = new Cuadricula(0,0,cantidadFilas,this.cantidadColumnas,
            {alto: 300,ancho:300,separacionEntreCasillas: 5},
            {grilla: 'casilla.mariaSandia.png',
            cantColumnas: 5})
        this.automata = new MariaAnimada(0, 0);
        this.completarConSandias();
        this.cuadricula.agregarActor(this.automata,cantidadFilas-1, 0);
    }

    private completarConSandias(){
        this.completarFila(0);
        this.completarFila(2);
        this.completarFila(4);
        this.cuadricula.agregarActor(new SandiaAnimada(0, 0), 1, 0);
        this.cuadricula.agregarActor(new SandiaAnimada(0, 0), 3, 0);
    }

    private completarFila(numeroFila){
        for (var x = 0; x < this.cantidadColumnas;x++){
            this.cuadricula.agregarActor(new SandiaAnimada(0, 0), numeroFila, x);
        }
    }

    

    personajePrincipal(){
      return this.automata;
    }

}
