/* jshint unused:false */

import Ember from 'ember';
import actividadAlien from 'pilas-engine-bloques/actividades/actividadAlien';
import actividadLaEleccionDelMono from 'pilas-engine-bloques/actividades/actividadLaEleccionDelMono';
import actividadElMonoYLasBananas from 'pilas-engine-bloques/actividades/actividadElMonoYLasBananas';
import actividadTitoEnciendeLuces from 'pilas-engine-bloques/actividades/actividadTitoEnciendeLuces';
import actividadFutbolRobots from 'pilas-engine-bloques/actividades/actividadFutbolRobots';
import actividadElPlanetaDeNano from 'pilas-engine-bloques/actividades/actividadElPlanetaDeNano';
import actividadAlienTocaBoton from 'pilas-engine-bloques/actividades/actividadAlienTocaBoton';
import actividadTitoRecargado from 'pilas-engine-bloques/actividades/actividadTitoRecargado';
import actividadSuperTito1 from 'pilas-engine-bloques/actividades/actividadSuperTito1';
import actividadSuperTito2 from 'pilas-engine-bloques/actividades/actividadSuperTito2';
import actividadElRecolectorDeEstrellas from 'pilas-engine-bloques/actividades/actividadElRecolectorDeEstrellas';
import actividadLaGranAventuraDelMarEncantado from 'pilas-engine-bloques/actividades/actividadLaGranAventuraDelMarEncantado';
import actividadMariaLaComeSandias from 'pilas-engine-bloques/actividades/actividadMariaLaComeSandias';
import actividadElMarcianoEnElDesierto from 'pilas-engine-bloques/actividades/actividadElMarcianoEnElDesierto';
import actividadAlimentandoALosPeces from 'pilas-engine-bloques/actividades/actividadAlimentandoALosPeces';
import actividadInstalandoJuegos from 'pilas-engine-bloques/actividades/actividadInstalandoJuegos';
import actividadElGatoEnLaCalle from 'pilas-engine-bloques/actividades/actividadElGatoEnLaCalle';
import actividadNoMeCansoDeSaltar from 'pilas-engine-bloques/actividades/actividadNoMeCansoDeSaltar';
import actividadReparandoLaNave from 'pilas-engine-bloques/actividades/actividadReparandoLaNave';
import actividadElMonoQueSabeContar from 'pilas-engine-bloques/actividades/actividadElMonoQueSabeContar';
import actividadTresNaranjas from 'pilas-engine-bloques/actividades/actividadTresNaranjas';
import actividadLaberintoCorto from 'pilas-engine-bloques/actividades/actividadLaberintoCorto';
import actividadLaberintoLargo from 'pilas-engine-bloques/actividades/actividadLaberintoLargo';
import actividadLaberintoConQueso from 'pilas-engine-bloques/actividades/actividadLaberintoConQueso';
import actividadElCangrejoAguafiestas from 'pilas-engine-bloques/actividades/actividadElCangrejoAguafiestas';
import actividadElDetectiveChaparro from  'pilas-engine-bloques/actividades/actividadElDetectiveChaparro';
import actividadPrendiendoLasCompus from 'pilas-engine-bloques/actividades/actividadPrendiendoLasCompus';
import actividadPrendiendoLasCompusParametrizado from 'pilas-engine-bloques/actividades/actividadPrendiendoLasCompus-conParametros';
import actividadElMonoCuentaDeNuevo from 'pilas-engine-bloques/actividades/actividadElMonoCuentaDeNuevo';
import actividadElSuperviaje from 'pilas-engine-bloques/actividades/actividadElSuperviaje';
import actividadesDibujandoFiguras from 'pilas-engine-bloques/actividades/actividadesDibujandoFiguras';
import actividadSalvandoLaNavidad from 'pilas-engine-bloques/actividades/actividadSalvandoLaNavidad';
import actividadTitoCuadrado from 'pilas-engine-bloques/actividades/actividadTitoCuadrado';
import actividadLaFiestaDeDracula from 'pilas-engine-bloques/actividades/actividadLaFiestaDeDracula';
import actividadPrendiendoLasFogatas from 'pilas-engine-bloques/actividades/actividadPrendiendoLasFogatas';

/*
 * Representa un valor mas complejo
 * de un campo de un bloque
 */
var ParamValor = Ember.Object.extend({
   build() {
     var str_block = '';
     str_block += '<value name="NOMBRE">'.replace('NOMBRE', this.get('nombre_param'));

     str_block += '<block type="TIPO">'.replace('TIPO', this.get('tipo_bloque'));

     str_block += '<field name="TIPO">'.replace('TIPO', this.get('nombre_valor'));
     str_block += this.get('valor');
     str_block += '</field>';

     str_block += '</block>';

     str_block += '</value>';

     return str_block;
   }
});


import Actividad from 'pilas-engine-bloques/actividades/actividad';


export default Ember.Service.extend({

  obtenerPorNombre(nombre) {

    let actividades = [
      actividadAlien,
      actividadAlienTocaBoton,
      actividadLaEleccionDelMono,
      actividadElMonoYLasBananas,
      actividadTitoEnciendeLuces,
      actividadFutbolRobots,
      actividadElPlanetaDeNano,
      actividadTitoRecargado,
      actividadSuperTito1,
      actividadSuperTito2,
      actividadElRecolectorDeEstrellas,
      actividadMariaLaComeSandias,
      actividadElMarcianoEnElDesierto,
      actividadAlimentandoALosPeces,
      actividadInstalandoJuegos,
      actividadNoMeCansoDeSaltar,
      actividadElGatoEnLaCalle,
      actividadElMonoQueSabeContar,
      actividadReparandoLaNave,
      actividadTresNaranjas,
      actividadLaberintoCorto,
      actividadLaberintoLargo,
      actividadLaberintoConQueso,
      actividadElCangrejoAguafiestas,
      actividadLaGranAventuraDelMarEncantado,
      actividadElDetectiveChaparro,
      actividadPrendiendoLasCompus,
      actividadElMonoCuentaDeNuevo,
      actividadElSuperviaje,
      actividadSalvandoLaNavidad,
      actividadTitoCuadrado,
      actividadLaFiestaDeDracula,
      actividadPrendiendoLasCompusParametrizado,
      actividadPrendiendoLasFogatas
    ];

    actividades = actividades.concat(actividadesDibujandoFiguras);

    var actividad = actividades.findBy('id', nombre);

    if (!actividad) {
      throw new Error(`No se encuentra la actividad de nombre ${nombre}`);
    }

    return Actividad.create({actividad});
  }
});
