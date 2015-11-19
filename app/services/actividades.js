/*jshint unused:false*/

import Ember from 'ember';

import actividadAlien from 'pilas-engine-bloques/actividades/actividadAlien';
import actividadLaEleccionDelMono from 'pilas-engine-bloques/actividades/actividadLaEleccionDelMono';
import actividadElMonoYLasBananas from 'pilas-engine-bloques/actividades/actividadElMonoYLasBananas';
import actividadLightbotEnScratch from 'pilas-engine-bloques/actividades/actividadLightbotEnScratch';
import actividadFutbolRobots from 'pilas-engine-bloques/actividades/actividadFutbolRobots';
import actividadElPlanetaDeNano from 'pilas-engine-bloques/actividades/actividadElPlanetaDeNano';
import actividadAlienTocaBoton from 'pilas-engine-bloques/actividades/actividadAlienTocaBoton';
import actividadLightbotRecargado from 'pilas-engine-bloques/actividades/actividadLightbotRecargado';
import actividadSuperTito1 from 'pilas-engine-bloques/actividades/actividadSuperTito1';
import actividadSuperTito2 from 'pilas-engine-bloques/actividades/actividadSuperTito2';
import actividadElRecolectorDeEstrellas from 'pilas-engine-bloques/actividades/actividadElRecolectorDeEstrellas';

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

//import actividadLaGranAventuraDelMarEncantado from 'pilas-engine-bloques/actividades/actividadLaGranAventuraDelMarEncantado ;

//import actividadElDetectiveChaparro from  'pilas-engine-bloques/actividades/actividadElDetectiveChaparro';
//import actividadPrendiendoLasCompus from 'pilas-engine-bloques/actividades/actividadPrendiendoLasCompus';
//import actividadElDetectiveChaparro from 'pilas-engine-bloques/actividades/actividadElDetectiveChaparro';
//import actividadElMonoCuentaDeNuevo from 'pilas-engine-bloques/actividades/actividadElDetectiveChaparro';
//import actividadElDetectiveChaparro from 'pilas-engine-bloques/actividades/actividadElDetectiveChaparro';






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
  obtenerPorNombre(nombreActividad) {

    let actividades = {
      alien: actividadAlien,
      AlienTocaBoton: actividadAlienTocaBoton,
      LaEleccionDelMono: actividadLaEleccionDelMono,
      ElMonoYLasBananas: actividadElMonoYLasBananas,
      LightbotEnScratch: actividadLightbotEnScratch,
      FutbolRobots: actividadFutbolRobots,
      //ElPlanetaDeNano: actividadElPlanetaDeNano
      LightbotRecargado : actividadLightbotRecargado,
      SuperTito1: actividadSuperTito1,
      SuperTito2: actividadSuperTito2,
      ElRecolectorDeEstrellas: actividadElRecolectorDeEstrellas,

      MariaLaComeSandias: actividadMariaLaComeSandias,
      ElMarcianoEnElDesierto: actividadElMarcianoEnElDesierto,
      AlimentandoALosPeces: actividadAlimentandoALosPeces,
      InstalandoJuegos: actividadInstalandoJuegos,
      NoMeCansoDeSaltar: actividadNoMeCansoDeSaltar,
      ElGatoEnLaCalle: actividadElGatoEnLaCalle,
      ElMonoQueSabeContar:actividadElMonoQueSabeContar,
      ReparandoLaNave: actividadReparandoLaNave,
      TresNaranjas: actividadTresNaranjas,
      LaberintoCorto: actividadLaberintoCorto,
      LaberintoLargo: actividadLaberintoLargo,
      LaberintoConQueso: actividadLaberintoConQueso,
      ElCangrejoAguafiestas: actividadElCangrejoAguafiestas
      /*LaGranAventuraDelMarEncantado: actividadLaGranAventuraDelMarEncantado
      */
    };

    var actividad = actividades[nombreActividad];

    if (!actividad) {
      return null;
    }

    return Actividad.create({actividad});
  }
});
