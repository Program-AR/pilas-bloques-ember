class LaEleccionDelMono extends Base {
    fondo;
    cuadricula;
    mono;
    objetos=[];
    esManzana;
    iniciar() {
    	this.fondo = new Fondo('fondos/nubes.png',0,0);
        var cantidadFilas=1
        var cantidadColumnas=2
        this.cuadricula = new Cuadricula(0,0,cantidadFilas,cantidadColumnas,
            {alto: 100},
            {grilla: 'casillaLightbot.png', 
            cantColumnas: 5})

        this.mono = new MonoAnimado(0,0);
        this.mono.setCuadricula(this.cuadricula,0,0);
        
		
		if (Math.random()< .5)  {
            this.agregarManzana();
        }else{
        	this.agregarBanana();

        }	    
    }

    agregarManzana(){
    	this.objetos[0] = new ManzanaAnimada(0,0);
            this.objetos[0].setCuadricula(this.cuadricula,0,1);
    }

    agregarBanana(){
    	this.objetos[0] = new BananaAnimada(0,0);
    	this.objetos[0].setCuadricula(this.cuadricula,0,1);

    }

    comerManzana(){
        this.mono.hacer_luego(RecogerTipoEspecifico,{tipoEspecifico : ManzanaAnimada});
	}

	comerBanana(){
        this.mono.hacer_luego(RecogerTipoEspecifico,{tipoEspecifico : BananaAnimada});
	}

	avanzar(){
        this.mono.hacer_luego(MoverACasillaDerecha);
	}


}