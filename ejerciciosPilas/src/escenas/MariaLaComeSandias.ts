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

        //this.recolector.izquierda = pilas.izquierda();
        var cantidadFilas=5
        this.cantidadColumnas=6

        this.cuadricula = new Cuadricula(0,0,cantidadFilas,this.cantidadColumnas,
            {alto: 300,ancho:300,separacionEntreCasillas: 5},
            {grilla: 'casilla.mariaSandia.png',
            cantColumnas: 5})
        this.automata = new MariaAnimada(0, 0);
        this.cuadricula.agregarActor(this.automata,cantidadFilas-1, 0);
        this.automata.escala=0.1;
        this.completarConSandias();
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

    moverDerecha(){
           this.automata.hacer_luego(MoverACasillaDerecha);
    }
    moverIzquierda(){
           this.automata.hacer_luego(MoverACasillaIzquierda);
    }
    moverAbajo(){
           this.automata.hacer_luego(MoverACasillaAbajo);
    }
    moverArriba(){
           this.automata.hacer_luego(MoverACasillaArriba);
    }
    morderSandia(){
        this.automata.hacer_luego(MorderPorEtiqueta,{'etiqueta':'SandiaAnimada', 'mensajeError': 'Acá no hay una sandía'})
    }

    personajePrincipal(){
      return this.automata;
    }

}
