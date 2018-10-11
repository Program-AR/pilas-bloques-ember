/// <reference path="../ActorAnimado.ts"/>

class Ensaladera extends ActorAnimado {
    static _grilla = 'actor.ensaladera.png'

    constructor() {
        super(0, 0, {cantColumnas: 3 });
        this.definirAnimacion("parado", [0], 12, true);
        this.definirAnimacion("preparando", [0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2], 12);
        this.definirAnimacion("llena", [1], 12);
    }
}

class Tomate extends ActorAnimado {
    static _grilla = 'actor.tomate.png'

    constructor() {
        super(0, 0, { cantColumnas: 2 });
        this.definirAnimacion("parado", [0], 12, true);
        this.definirAnimacion("desaparecer", [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 12);
    }
}

class Lechuga extends ActorAnimado {
    static _grilla = 'actor.lechuga.png'

    constructor() {
        super(0, 0, { cantColumnas: 2 });
        this.definirAnimacion("parado", [0], 12, true);
        this.definirAnimacion("desaparecer", [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 12);
    }
}
