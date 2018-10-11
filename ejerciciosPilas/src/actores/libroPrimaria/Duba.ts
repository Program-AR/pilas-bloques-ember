/// <reference path="../ActorAnimado.ts"/>
/// <reference path="../../comportamientos/ComportamientoAnimado.ts"/>

class Duba extends ActorAnimado {
	static _grilla = 'actor.duba.png'

    constructor() {
		super(0,0,{cantColumnas: 10, cantFilas: 15});
		this.definirAnimacion("parado",
				new Cuadros(0).repetirVeces(16)
				.concat([33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52])
				.concat(new Cuadros(0).repetirVeces(30))
				.concat([33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52])
				.concat(new Cuadros(0).repetirVeces(30))
				.concat([33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52])
				.concat(new Cuadros(0).repetirVeces(16))
				.concat([0,1,2,3,4,5,6,7,8,9,10,11,11,12,12,13,14,15,16,17,18,19,19,20,21,22,23,23,23,24,25,26,27,27,28,29,30,31,31,31,31,31,32])
				.concat(new Cuadros(0).repetirVeces(5)),
			12, true);
		this.definirAnimacion("correr", [0,53,54,55,56,57,58,59,60,0], 36);
		this.definirAnimacion("correrChocando", [0,53,54,55,56,57,58,59,60,76,77,78,79,80,81,82,83,84,85,86,87,88,88,89,90,90], 12)
		this.definirAnimacion("comerChurrasco",[0,0,61,62,63,64,65,65,65,65,66,67,68,69,70,71,72,73,74,75], 12);
		this.definirAnimacion("obstaculo", [91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,128,128,128,128], 12)
		this.definirAnimacion("error",[129,130,131,132,133,134,135,136,137,138,139,140,141,142,142,142,142], 12)
	}
}
