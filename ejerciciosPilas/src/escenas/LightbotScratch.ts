class LightbotScratch extends Base {
    fondo;
    automata;
    cuadricula;
    objetos = [];

    iniciar() {
        this.fondo = new Fondo('fondos.estrellas.png',0,0);
        //this.robot.izquierda = pilas.izquierda();

        this.cuadricula = new Cuadricula(0,0,5,6,
            {},
            {grilla: 'casilla_base.png',
            cantColumnas: 1, alto: 38});


        //se cargan las luces
        var cant=0;
        var fila=3
        var col=0;
        while(cant <4){
          this.agregarLuz(fila,col);
          fila-=1
          col+=1
          cant+=1
        }
        cant=0;
        fila=4;
        col=2
        while(cant<4){
          this.agregarLuz(fila,col);
          fila-=1
          col+=1;
          cant+=1;
        }




        // se crea el automata
        this.automata = new Robot(0,0);
        this.cuadricula.agregarActor(this.automata,4,0);
    }

    agregarLuz(fila,columna) {
        var casillaLuminosa = new CasillaConLuz(0,0);
        this.cuadricula.agregarActor(casillaLuminosa,fila,columna);
        casillaLuminosa.escala_x = .50;
        casillaLuminosa.escala_y = .50;
        this.objetos.push(casillaLuminosa);
    }


    prenderLuz() {
        this.automata.hacer_luego(EncenderLuz);
    }
    irArriba(){
        this.automata.hacer_luego(MoverACasillaArriba);
    }
    irAbajo(){
        this.automata.hacer_luego(MoverACasillaAbajo);
    }
    irDerecha(){
        this.automata.hacer_luego(MoverACasillaDerecha);
    }
    irIzquierda(){
        this.automata.hacer_luego(MoverACasillaIzquierda);
    }

}
