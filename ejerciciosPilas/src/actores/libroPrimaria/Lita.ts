/// <reference path="../ActorAnimado.ts"/>

class Lita extends ActorAnimado {
	static _grilla = 'actor.lita.png'

    constructor() {
		super(0,0,{cantColumnas: 10, cantFilas: 17});
		this.definirAnimacion("parado",
				new Cuadros(0).repetirVeces(16)
				.concat([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])
				.concat(new Cuadros(0).repetirVeces(28))
				.concat([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])
				.concat(new Cuadros(0).repetirVeces(28))
				.concat([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])
				.concat(new Cuadros(0).repetirVeces(28))
				.concat([0,21,22,23,24,25,26,27,28,29,30,31,32,33,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,35,36,37,38])
				.concat(new Cuadros(0).repetirVeces(5)),
			12, true);
		this.definirAnimacion("correr", [39,40,41,42,43,44,45,46,47,48,39,40,41,42,43,44,45,49,50,51,52,53], 20);
		this.definirAnimacion("desenrrollar", [53,53,53,53], 12);
		this.definirAnimacion("agarrarLechuga", [0,0,54,54,55,56,57,58,58,59,59,60,60,61,61,62,62,62], 12);
		this.definirAnimacion("agarrarTomate", [0,0,63,63,64,65,66,67,68,69,69,70,70,71,71,72,72,72], 12);
		this.definirAnimacion("prepararEnsalada", [0,0,0,0,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97], 12);
		this.definirAnimacion("correrChocando", [39,40,41,42,43,44,45,46,47,48,0,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122], 12)
		this.definirAnimacion("obstaculo", [123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,159,159,159,159], 12)
		this.definirAnimacion("error", (<Number[]>[160,161,162,163]).concat(new Cuadros(164).repetirVeces(30)).concat([163,162,161,160]), 12)
	}
}
