/// <reference path="ActorAnimado.ts"/>

class PezAnimado extends ActorAnimado {
    constructor(x, y) {

        super(x, y, {grilla: 'pez1.png', cantColumnas:4, cantFilas: 1});


      /*}else{
        if(Math.random()<0.5){
          super(x, y, {grilla: 'pez2.png', cantColumnas:4, cantFilas: 1});
        }else{
          super(x, y, {grilla: 'pez2.png', cantColumnas:4, cantFilas: 1});
        }
      }*/
      
      this.definirAnimacion("parado",[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,3,2,1],6,true);
      this.definirAnimacion("recoger",[0,1,2,3,2,1],6);


    }
}
