import bloques from 'pilas-engine-bloques/actividades/bloques';
var {AccionBuilder,  Repetir, Procedimiento} = bloques;

var SiguienteCompu = AccionBuilder.build({
  descripcion: 'Pasar a la siguiente compu',
  id: 'SiguienteCompu',
  icono: '../../iconos/derecha.png',
  comportamiento: 'MoverACasillaDerecha',
  argumentos: '{}',
});

var PrenderCompu = AccionBuilder.build({
  descripcion: 'Prender compu',
  id: 'PrenderCompu',
  icono: 'icono.computadora.png',
  comportamiento: 'PrenderCompuParaInstalar',
  argumentos: '{\'etiqueta\' : \'CompuAnimada\',  \'mensajeError\' : \'No hay una compu aqui\', \'idTransicion\' : \'prender\',\'animacionColisionado\' : \'prendida\',\'nombreAnimacion\' : \'escribir\'  }',
});

var ApagarCompu = AccionBuilder.build({
  descripcion: 'Apagar compu',
  id: 'ApagarCompu',
  icono: 'icono.computadora.png',
  comportamiento: 'DesencadenarAnimacionSiColisiona',
  argumentos: '{\'etiqueta\' : \'CompuAnimada\',  \'mensajeError\' : \'No hay una compu aqui\', \'idTransicion\' : \'apagar\',\'animacionColisionado\' : \'parado\',\'nombreAnimacion\' : \'escribir\'  }',
});

var InstalarJuego = AccionBuilder.build({
  descripcion: 'Instalar juego',
  id: 'InstalarJuego',
  comportamiento: 'DesencadenarAnimacionSiColisiona',
  argumentos: '{\'etiqueta\' : \'CompuAnimada\',  \'mensajeError\' : \'No hay una compu aqui\', \'idTransicion\' : \'instalar\',\'animacionColisionado\' : \'instalado\',\'nombreAnimacion\' : \'escribir\'  }',
});

var EscribirC = AccionBuilder.build({
  descripcion: 'Escribir "C"',
  id: 'EscribirC',
  comportamiento: 'EscribirEnCompuAnimada',
  argumentos: '{\'etiqueta\' : \'CompuAnimada\',  \'mensajeError\' : \'No hay una compu aqui\', \'idTransicion\' : \'escribirC\'}',
});

var EscribirB = AccionBuilder.build({
  descripcion: 'Escribir "B"',
  id: 'EscribirB',
  comportamiento: 'EscribirEnCompuAnimada',
  argumentos: '{\'etiqueta\' : \'CompuAnimada\',  \'mensajeError\' : \'No hay una compu aqui\', \'idTransicion\' : \'escribirB\'}',
});

var EscribirA = AccionBuilder.build({
  descripcion: 'Escribir "A"',
  id: 'EscribirA',
  comportamiento: 'EscribirEnCompuAnimada',
  argumentos: '{\'etiqueta\' : \'CompuAnimada\',  \'mensajeError\' : \'No hay una compu aqui\', \'idTransicion\' : \'escribirA\'}',
});

var actividadInstalandoJuegos = {
  // DEPRECATED: nombre: 'Instalando juegos',
  id: 'InstalandoJuegos',
  // DEPRECATED: enunciado: 'Ramiro tiene que instalar un juego en 3 compus para divertirse con sus amigos. Los pasos para instalarlo en cada una son: encenderla, ingresar la contraseña ("ABC"), instalar el juego y apagar la máquina. Pista: aprovechá que en cada compu hay que hacer el mismo trabajo.',

  // la escena proviene de ejerciciosPilas
  // DEPRECATED: escena: InstalandoJuegos, // jshint ignore:line
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, Repetir, SiguienteCompu,PrenderCompu,ApagarCompu,EscribirC,EscribirB,EscribirA,InstalarJuego],
};

export default actividadInstalandoJuegos;
