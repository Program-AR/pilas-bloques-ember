  class ElCangrejoAguafiestas extends Base {
    fondo;
    cuadricula;
    mono
    iniciar() {
        this.fondo = new Fondo('fondos.nubes.png',0,0);



        var matriz= [[true,true],[false,true]]
        this.cuadricula = new CuadriculaEsparsa(0,0,2,2,{alto: 100},{grilla:'casillaLightbot.png', cantColumnas: 5},matriz)
        this.mono = new BananaAnimada(0,0);

        this.cuadricula.agregarActor(this.mono,0,0);







    }

    moverDerecha(){
      this.mono.hacer_luego(MoverACasillaDerechaEsparsa);
    }
    


}
