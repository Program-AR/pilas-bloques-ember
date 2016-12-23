import {AccionBuilder} from 'pilas-engine-bloques/actividades/bloques';

var PrenderCompu = AccionBuilder.build({
  descripcion: 'Prender compu',
  icono: 'iconos/icono.Computadora.png',
  comportamiento: 'DesencadenarAnimacionSiColisiona',
  argumentos: '{etiqueta:"CompuAnimada", animacionColisionado:"prendida", nombreAnimacion: "escribir" }',
});

var EstoyEnEsquina = AccionBuilder.buildSensor({
  descripcion: 'Estoy en una esquina',
  icono: 'iconos/icono.PrendiendoLasCompus.png',
  funcionSensor: 'casillaActual().esEsquina()',
});

export {PrenderCompu, EstoyEnEsquina};
