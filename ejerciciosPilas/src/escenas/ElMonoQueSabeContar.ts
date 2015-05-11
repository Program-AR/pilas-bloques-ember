class ElMonoQueSabeContar extends Base {
    fondo;
    cuadricula;
    mono;
    cantMaxColumnas;
    etiquetasDeObjetosAColocar=[ManzanaAnimada,BananaAnimada]
    definidor;
    texto;
    contador;
    contadorDeEtiquetas;
    tableroBananas;
    tableroManzanas;
    cantidadManzanas;
    cantidadBananas;

    puntaje;
    iniciar() {
        this.fondo = new Fondo('fondos/nubes.png',0,0);
        this.cantMaxColumnas=10;

        this.definidor = new DefinidorColumnasRandom(5,10)

        this.cuadricula = new CuadriculaMultiple(this.definidor)
        /*.setCuadricula(this.cuadricula,0,0)*/
        this.cuadricula.completarConObjetosRandom(this.etiquetasDeObjetosAColocar);
        this.mono = new MonoAnimado(0,0);
        this.cuadricula.posicionarObjeto(this.mono,0,0);
/*
        this.conta

        dorDeEtiquetas= new ContadorDeEtiquetas();
        this.contadorDeEtiquetas.agregarEtiqueta('ManzanaAnimada');
        this.contadorDeEtiquetas.agregarEtiqueta('BananaAnimada');
*/

        this.tableroBananas = new Tablero(150,220,"Bananas",undefined);
        this.tableroManzanas = new Tablero(150,230,"Manzanas",undefined);
        this.cantidadManzanas= new ObservadoConAumentar(0);
        this.cantidadBananas= new ObservadoConAumentar(0);
        this.cantidadManzanas.registrarObservador(this.tableroManzanas,0);
        this.cantidadBananas.registrarObservador(this.tableroBananas,0);


    }

    personajePrincipal(){
      return this.mono;
    }
    atras() {
        this.mono.hacer_luego(MoverACasillaIzquierda);
    }

    avanzar(){
        this.mono.hacer_luego(MoverACasillaDerecha);
    }

    siguienteFila(){
        this.mono.hacer_luego(avanzarFilaEnCuadriculaMultiple,{'cuadriculaMultiple':this.cuadricula})
    }

    contarBanana(){
        this.mono.hacer_luego(ContarPorEtiqueta,{'etiqueta':'BananaAnimada','mensajeError':'No hay una banana aquí','dondeReflejarValor': this.cantidadBananas})

    }

    contarManzana(){
        this.mono.hacer_luego(ContarPorEtiqueta,{'etiqueta':'ManzanaAnimada','mensajeError':'No hay una manzana aquí','dondeReflejarValor': this.cantidadManzanas})
    }

}
