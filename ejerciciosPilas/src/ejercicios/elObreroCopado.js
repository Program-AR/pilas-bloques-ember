function armarEscena(){
    var escenaObrero = new Base();
    escenaObrero.iniciar = function(){
        new pilas.fondos.Pasto();
        new pilas.actores.Mono();
    }
    
    return escenaObrero;
}