pilas = new Pilas();
pilas.iniciar({ancho: 320, alto: 240, data_path: 'data'});

pilas.onready = function() {
  var fondo = new pilas.fondos.Tarde();
  //  new pilas.actores.Aceituna();
//  new pilas.actores.new pilas.actores.Actor()();
//  new pilas.actores.Bomba();
//  new pilas.actores.Explosion();
//  new pilas.actores.Nave();
//  new pilas.actores.Proyectil();
//  new pilas.actores.Piedra();
//  new pilas.actores.Eje();
  var rodri = new pilas.actores.Maton();
//  new pilas.actores.Globo();
//  new pilas.actores.Texto();
//  new pilas.actores.Bloque();
//  new pilas.actores.Manzana();
//  new pilas.actores.Cofre();
//  new pilas.actores.Llave();
//  new pilas.actores.Caja();
//  new pilas.actores.Cesto();
//  new pilas.actores.Pelota();
//  new pilas.actores.Zanahoria();
//  new pilas.actores.Boton();
//  new pilas.actores.Puntaje();
//  new pilas.actores.Mono();
//  new pilas.actores.Banana();
//  new pilas.actores.Tortuga();
//  new pilas.actores.Pizarra();
//  new pilas.actores.Pingu();
//  new pilas.actores.Alien();
//  new pilas.actores.AlienMarron();
//  new pilas.actores.Tuerca();
//  new pilas.actores.Sombra();
   rodri.x = -150;
   rodri.y = -100;
   rodri.caminar_derecha();
}

pilas.ejecutar();