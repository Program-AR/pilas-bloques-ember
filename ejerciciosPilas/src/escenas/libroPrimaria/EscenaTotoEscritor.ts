/// <reference path = "EscenaToto.ts" />
/// <reference path = "../../comportamientos/EscribirTexto.ts" />

class EscenaTotoEscritor extends EscenaToto {
    manoQueEscribe : Actor;
    
	static clasesDeActoresExtrasToto() : typeof ActorAnimado[] {
		return [LetraManuscrita]
    }

	static imagenesAdicionalesToto() : string[]{
		return ['manoToto.png', 'libretaToto.png']
    }
    
    constructor(estilo: EstiloTotoEscritor){
        super(estilo.mapa(), estilo.textoEsperado(), estilo.topeDeLetras());
    }

    iniciar(){
        super.iniciar();
        this.manoQueEscribe = new ActorAnimado(0,0,{grilla: "manoToto.png"});
        this.cuadriculaSecundaria.agregarActor(this.manoQueEscribe,0,0,false);
        this.manoQueEscribe.escalarAAncho(190);
        this.manoQueEscribe.setY(this.manoQueEscribe.getY()-25);
        this.manoQueEscribe.setX(this.manoQueEscribe.getX()+85);
    }

    obtenerAutomata() : TotoEscritor {
        return new TotoEscritor();
    }

    opsCuadricula() {
        return { ancho: 400, alto: 280 };
    }

    construirCuadriculaSecundaria(): Cuadricula {
        new ActorAnimado(-30, -170, { grilla: "libretaToto.png" })
        return new Cuadricula(
            30, -140, 1, this.topeDeLetras,
            { alto: 160, ancho: 300, imagen: 'invisible.png', separacionEntreCasillas: -20 }, { grilla: 'invisible.png', relAspecto: 1 }
        );
    }

    estaResueltoElProblema() : boolean {
        return super.estaResueltoElProblema() && this.automata.tocandoFin();
    }
}

abstract class EscribirTextoEnOtraCuadricula extends EscribirTexto {
    iniciar(receptor){
        this.argumentos.texto = this.obtenerTexto();
        this.argumentos.receptor = pilas.escena_actual().manoQueEscribe;
        super.iniciar(this.argumentos.receptor);
    }

    abstract obtenerTexto(): string;
}

class EscribirLetraActualEnOtraCuadricula extends EscribirTextoEnOtraCuadricula {
    obtenerTexto(): string { return pilas.escena_actual().automata.caracterActual(); }
}

class EscribirTextoDadoEnOtraCuadricula extends EscribirTextoEnOtraCuadricula {
    obtenerTexto(): string { return this.argumentos.texto; }
}


abstract class EstiloTotoEscritor {
    palabraElegida: string;
    
    constructor(){
        this.palabraElegida = this.palabras()[Math.floor(Math.random() * this.palabras().length)]
    }
    
    /** Elige una palabra de una lista, y arma el mapa para la escena a partir de esa palabra */
    mapa(): MapaEscena {
        return [["A"].concat(this.palabraElegida.split(""))];
    }
    
    topeDeLetras(): number {
        return this.textoEsperado().length + 1;
    }
    
    palabras(): string[] {
        return ["después", "trabajo", "partido", "público", "todavía", "espacio", "difícil", "pública", "popular", "gracias", "palabra", "jóvenes", "escuela", "corazón", "actitud", "octubre", "ciencia", "razones", "perdido", "destino", "tercera", "viernes", "febrero", "pueblos", "treinta", "pintura", "plantas", "abierto", "colegio", "estatal", "cerebro", "actores", "dientes", "piedras", "fiestas", "círculo", "clásico", "canción", "alfredo", "córdoba", "ochenta", "botella", "rodrigo", "sonidos", "jugando", "incluir", "dibujos", "oxígeno", "lenguas", "pájaros", "vegetal", "teórico", "rurales", "pilotos", "rodilla", "enseñar", "balanza", "ingenio", "vinagre", "celeste", "abuelos", "espejos", "orillas", "sendero", "fósiles", "nativos", "oficios", "vocales", "diseñar", "cautela", "aceites", "saludar", "engañar", "abuelas", "nativas", "teórica", "clásica", "perdida", "abierta", "tercero", "primera", "sistema", "mujeres", "familia", "minutos", "estamos", "mundial", "tenemos", "domingo", "américa", "mayores", "humanos", "llamado", "hermano", "semanas", "maestro", "médicos", "mensaje", "volumen", "musical", "caminos", "montaña", "moderno", "remedio", "cámaras", "premios", "emoción", "caminar", "mendoza", "humedad", "músicos", "comedor", "manteca", "miradas", "formato", "armando", "inmenso", "monedas", "maestra", "emisora", "amantes", "miranda", "famosos", "manzana", "minoría", "motores", "mezclar", "semilla", "cemento", "mineral", "mañanas", "tomates", "mediano", "perfume", "milenio", "almacén", "melodía", "molesto", "mineros", "amorosa", "manzano", "anónimo", "dormida", "vómitos", "inmensa", "famosas", "humanas", "llamada", "hermana", "moderna", "maestra", "médicas", "músicas", "mediana", "molesta", "mineras", "amoroso", "anónima", "dormido", "primero", "momento", "memoria", "mínimos", "mínimas", "máximos", "máximas", "tomamos", "murmuro"];
    }
    
    textoEsperado(): string {
        return this.palabraElegida.split("").map(letra => this.transformacionEsperadaPorLetra(letra)).join("");
    }
    
    abstract transformacionEsperadaPorLetra(letra: string): string;
}

class ObjetivoCopiar extends EstiloTotoEscritor {
    transformacionEsperadaPorLetra(letra: string): string {
        return letra
    }
}

class ObjetivoX extends EstiloTotoEscritor {
    transformacionEsperadaPorLetra(letra: string): string {
        return "x"
    }
}

class ObjetivoJeringozo extends EstiloTotoEscritor {
    palabras(): string[] {
        return super.palabras().filter(palabra => this.todasLetrasSimples(palabra) && this.pocasVocales(palabra));
    }

    transformacionEsperadaPorLetra(letra: string): string {
        return letra + (this.esVocal(letra) ? "p" + letra : "");
    }
    
    esVocal(letra: string): boolean {
        return letra === "a" || letra === "e" || letra === "i" || letra === "o" || letra === "u";
    }

    todasLetrasSimples(palabra: string): boolean {
        return palabra.split("").every(letra => "abcdefghijklmnñopqrstuvwxyz".indexOf(letra)>=0);
    }

    pocasVocales(palabra: string): boolean {
        return palabra.split("").filter(letra => this.esVocal(letra)).length <= 3;
    }
}

class ObjetivoMicha extends EstiloTotoEscritor {
    palabras(): string[] { // duplico las mismas palabras para aumentar probabilidad de palabras con muchas emes.
        return ["momento", "memoria", "mínimos", "mínimas", "máximos", "máximas", "tomamos", "murmuro", 
        "momento", "memoria", "mínimos", "mínimas", "máximos", "máximas", "tomamos", "murmuro", 
        "vómitos", "médicas", "amoroso", "manzano", "cemento", "mineral", "mañanas", "humanas", "llamada" ];
    }

    transformacionEsperadaPorLetra(letra: string): string {
        return letra + (letra === "m" ? "ich" : "");
    }
}