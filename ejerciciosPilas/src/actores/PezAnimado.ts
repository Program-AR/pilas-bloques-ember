/// <reference path="ActorAnimado.ts"/>

class PezAnimado extends ActorAnimado {
    constructor(x, y) {
      if(Math.random()<0.5){
        super(x, y, {grilla: 'pez1.png', cantColumnas:1, cantFilas: 1});
      }else{
        if(Math.random()<0.5){
          super(x, y, {grilla: 'pez2.png', cantColumnas:1, cantFilas: 1});
        }else{
          super(x, y, {grilla: 'pez2.png', cantColumnas:1, cantFilas: 1});
        }
      }

    }
}
