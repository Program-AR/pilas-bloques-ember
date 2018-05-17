/// <reference path="../ActorAnimado.ts"/>

class Ensaladera extends ActorAnimado {
    constructor() {
        super(0, 0, { grilla: 'actor.ensaladera.png', cantColumnas: 2 });
        this.definirAnimacion("parado", [0], 6, true);
        this.definirAnimacion("llena", [1], 6);
    }
}

class Tomate extends ActorAnimado {
    constructor() {
        super(0, 0, { grilla: 'actor.tomate.png', cantColumnas: 2 });
        this.definirAnimacion("parado", [0], 6, true);
        this.definirAnimacion("desaparecer", [1,0], 12);
    }
}

class Lechuga extends ActorAnimado {
    constructor() {
        super(0, 0, { grilla: 'actor.lechuga.png', cantColumnas: 2 });
        this.definirAnimacion("parado", [0], 6, true);
        this.definirAnimacion("desaparecer", [1, 0], 12);
    }
}
