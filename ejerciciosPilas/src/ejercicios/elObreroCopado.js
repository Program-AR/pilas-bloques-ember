function armarEscena(){
    var escenaObrero = new Base();
    escenaObrero.iniciar = function(){
        var fondillo = new pilas.fondos.Fondo();
        fondillo.imagen = 'fondos/fondoObrero.png';
        new pilas.actores.Mono();
    }
    
    return escenaObrero;
}