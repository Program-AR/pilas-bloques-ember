class MariaLaComeSandias extends Base {
    cuadricula;
    maria;
    cantidadColumnas;

    iniciar() {

        //this.recolector.izquierda = pilas.izquierda();
        var cantidadFilas=5
        this.cantidadColumnas=6

        this.cuadricula = new Cuadricula(0,0,cantidadFilas,this.cantidadColumnas,
            {alto: 300,ancho:300},
            {grilla: 'casillaLightbot.png',
            cantColumnas: 5})
        this.maria = new MariaAnimada(0, 0);
        this.maria.setCuadricula(this.cuadricula,cantidadFilas-1, 0);
        this.maria.escala=0.1;
        this.completarConSandias();
    }

    private completarConSandias(){
        this.completarFila(0);
        this.completarFila(2);
        this.completarFila(4);
        new SandiaAnimada(0, 0).setCuadricula(this.cuadricula, 1, 0);
        new SandiaAnimada(0, 0).setCuadricula(this.cuadricula, 3, 0);
    }

    private completarFila(numeroFila){
        for (var x = 0; x < this.cantidadColumnas;x++){
            new SandiaAnimada(0, 0).setCuadricula(this.cuadricula, numeroFila, x);
        }
    }

    moverDerecha(){
           this.maria.hacer_luego(MoverACasillaDerecha);
    }
    moverIzquierda(){
           this.maria.hacer_luego(MoverACasillaIzquierda);
    }
    moverAbajo(){
           this.maria.hacer_luego(MoverACasillaAbajo);
    }
    moverArriba(){
           this.maria.hacer_luego(MoverACasillaArriba);
    }
    morderSandia(){
        this.maria.hacer_luego(MorderPorEtiqueta,{'etiqueta':'SandiaAnimada', 'mensajeError': 'Acá no hay una sandía'})
    }

    personajePrincipal(){
      return this.maria;
    }

}
