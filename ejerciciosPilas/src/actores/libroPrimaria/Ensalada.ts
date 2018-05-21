/// <reference path="../ActorAnimado.ts"/>

class Ensaladera extends ActorAnimado {
    constructor() {
        super(0, 0, { grilla: 'actor.ensaladera.png', cantColumnas: 3 });
        this.definirAnimacion("parado", [0], 12, true);
        this.definirAnimacion("preparando", [0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2], 12);
        this.definirAnimacion("llena", [1], 12);
    }
}

class Tomate extends ActorAnimado {
    constructor() {
        super(0, 0, { grilla: 'actor.tomate.png', cantColumnas: 2 });
        this.definirAnimacion("parado", [0], 12, true);
        this.definirAnimacion("desaparecer", [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 12);
    }
}

class Lechuga extends ActorAnimado {
    constructor() {
        super(0, 0, { grilla: 'actor.lechuga.png', cantColumnas: 2 });
        this.definirAnimacion("parado", [0], 12, true);
        this.definirAnimacion("desaparecer", [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 12);
    }
}
