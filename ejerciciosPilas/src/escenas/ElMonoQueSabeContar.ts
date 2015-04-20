class ElMonoQueSabeContar extends Base {
    fondo;
    cuadricula;
    mono;
    cantMaxColumnas;
    etiquetasDeObjetosAColocar=[ManzanaAnimada,BananaAnimada]
    definidor;
    texto;

    iniciar() {
        this.fondo = new Fondo('fondos/nubes.png',0,0);
        this.cantMaxColumnas=10;
     
        this.definidor = new DefinidorColumnasRandom(5,10)
        /*this.cuadricula= new Cuadricula(0, 0, 1,1,
            {alto: 50},
            {grilla: 'casillaLightbot.png', cantColumnas:5})
        */
        this.cuadricula = new CuadriculaMultiple(this.definidor)
        /*.setCuadricula(this.cuadricula,0,0)*/
        this.cuadricula.completarConObjetosRandom(this.etiquetasDeObjetosAColocar);
        this.mono = new MonoAnimado(0,0);
        this.cuadricula.posicionarObjeto(this.mono,0,0);
        
        //this.texto = new Texto(0,0,undefined,undefined)
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


}
