function armarEscena(objetoPilas) {
	    var fondo = new pilas.fondos.Tarde();
	    var rodri = new pilas.actores.Maton();
	    
	    rodri.x = -150;
	    rodri.y = -100;
	
	    rodri.caminar_derecha();
	    rodri.hacer(pilas.comportamientos.Saltando);
	    rodri.caminar_derecha();
	
	};
