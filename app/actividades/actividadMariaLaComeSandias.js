import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var {AccionBuilder, Repetir,Procedimiento} = bloques;
var {IrDerecha,IrIzquierda, IrArriba,IrAbajo} = direcciones;

var MorderSandia = AccionBuilder.build({
  descripcion: 'Morder sandía',
  id: 'MorderSandia',
  icono: 'icono.sandia.png',
  comportamiento: 'RecogerPorEtiqueta',
  argumentos: '{\'etiqueta\':\'SandiaAnimada\', \'mensajeError\': \'Acá no hay una sandia\'}',
});

var actividadMariaLaComeSandias = {
  // DEPRECATED: nombre: 'María la come sandías',
  id: 'MariaLaComeSandias',
  // DEPRECATED: enunciado: 'María necesita comer todas las sandías de la cuadrícula. Pensá de qué manera puede hacerlo creando los bloques necesarios. Pista: la forma en que las sandías están distribuidas en la cuadrícula, es clave para crear la menor cantidad de procedimientos.',

  // DEPRECATED: escena: MariaLaComeSandias,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,

  bloques: [Procedimiento, Repetir, IrDerecha,IrIzquierda, IrArriba,IrAbajo,MorderSandia],
};

export default actividadMariaLaComeSandias;
