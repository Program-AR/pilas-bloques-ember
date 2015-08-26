

class avanzarFilaEnCuadriculaMultiple extends MoverACasillaAbajo {
	proximaCasilla(casillaActual){ //debe retornar undefined si no hay casilla donde ir
		var casAbajo = super.proximaCasilla(casillaActual);
		if( casAbajo && casAbajo.nroColumna == 0 ){
			return casAbajo;
		}
	}
}