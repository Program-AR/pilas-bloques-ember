/// <reference path = "../../dependencias/pilasweb.d.ts"/>

class Casilla extends Actor {
    constructor(x,y,opciones){
        super("sin_imagen.png",x,y,opciones);
        
        this.sprite = new createjs.Graphics();
        this.sprite 
            .beginStroke("red")
            .beginFill("blue")
            .drawRect(30, 30, 100, 50);
    }
}