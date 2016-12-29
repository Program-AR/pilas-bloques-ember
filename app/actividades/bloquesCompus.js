import {AccionBuilder} from 'pilas-engine-bloques/actividades/bloques';

var PrenderCompu = AccionBuilder.build({
  descripcion: 'Prender compu',
  icono: 'icono.computadora.png',
  comportamiento: 'DesencadenarAnimacionSiColisiona',
  argumentos: '{etiqueta:"CompuAnimada", animacionColisionado:"prendida", nombreAnimacion: "escribir" }',
});

var EstoyEnEsquina = AccionBuilder.buildSensor({
  descripcion: 'Estoy en una esquina',
  icono: 'casilla.prendiendoLasCompus2.png',
  funcionSensor: 'casillaActual().esEsquina()',
});

export {PrenderCompu, EstoyEnEsquina};
