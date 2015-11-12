/*jshint unused:false*/

import Ember from 'ember';

import actividadAlien from 'pilas-engine-bloques/actividades/actividadAlien';
import actividadLaEleccionDelMono from 'pilas-engine-bloques/actividades/actividadLaEleccionDelMono';
import actividadElMonoYLasBananas from 'pilas-engine-bloques/actividades/actividadElMonoYLasBananas';
import actividadLightbotEnScratch from 'pilas-engine-bloques/actividades/actividadLightbotEnScratch';
import actividadFutbolRobots from 'pilas-engine-bloques/actividades/actividadFutbolRobots';
import actividadElPlanetaDeNano from 'pilas-engine-bloques/actividades/actividadElPlanetaDeNano';
import actividadAlienTocaBoton from 'pilas-engine-bloques/actividades/actividadAlienTocaBoton';
//import actividadLightbotRecargado from 'pilas-engine-bloques/actividades/actividadLightbotRecargado';
import actividadSuperTito1 from 'pilas-engine-bloques/actividades/actividadSuperTito1';
import actividadSuperTito2 from 'pilas-engine-bloques/actividades/actividadSuperTito2';
import actividadElRecolectorDeEstrellas from 'pilas-engine-bloques/actividades/actividadElRecolectorDeEstrellas';
import actividadMariaLaComeSandias from 'pilas-engine-bloques/actividades/actividadMariaLaComeSandias';
import actividadElMarcianoEnElDesierto from 'pilas-engine-bloques/actividades/actividadElMarcianoEnElDesierto';
import actividadAlimentandoALosPeces from 'pilas-engine-bloques/actividades/actividadAlimentandoALosPeces';
import actividadInstalandoJuegos from 'pilas-engine-bloques/actividades/actividadInstalandoJuegos';
import actividadElGatoEnLaCalle from 'pilas-engine-bloques/actividades/actividadElGatoEnLaCalle';
import actividadNoMeCansoDeSaltar from 'pilas-engine-bloques/actividades/actividadNoMeCansoDeSaltar';

//import actividadLaGranAventuraDelMarEncantado from 'pilas-engine-bloques/actividades/actividadLaGranAventuraDelMarEncantado ;
//import actividadReparandoLaNave from 'pilas-engine-bloques/actividades/actividadReparandoLaNave';
//import actividadLaberintoCorto from 'pilas-engine-bloques/actividades/actividadLaberintoCorto';
//import actividadTresNaranjas 'pilas-engine-bloques/actividades/actividadTresNaranjas';

//import actividadLaberintoLargo 'pilas-engine-bloques/actividades/actividadLaberintoLargo';
//import actividadSuperLightbot2 'pilas-engine-bloques/actividades/actividadSuperLightbot2';
//import actividadLaberintoConQueso 'pilas-engine-bloques/actividades/actividadLaberintoConQueso';
//import actividadElDetectiveChaparro 'pilas-engine-bloques/actividades/actividadElDetectiveChaparro';
//import actividadPrendiendoLasCompus 'pilas-engine-bloques/actividades/actividadPrendiendoLasCompus';
//import actividadElDetectiveChaparro 'pilas-engine-bloques/actividades/actividadElDetectiveChaparro';
//import actividadElMonoQueSabeContar 'pilas-engine-bloques/actividades/actividadElMonoQueSabeContar';
//import actividadElMonoCuentaDeNuevo'pilas-engine-bloques/actividades/actividadElDetectiveChaparro';
//import actividadElDetectiveChaparro 'pilas-engine-bloques/actividades/actividadElDetectiveChaparro';






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
      //LightbotRecargado : actividadLightbotRecargado,
      SuperTito1: actividadSuperTito1,
      SuperTito2: actividadSuperTito2,
      ElRecolectorDeEstrellas: actividadElRecolectorDeEstrellas,
      MariaLaComeSandias: actividadMariaLaComeSandias,
      ElMarcianoEnElDesierto: actividadElMarcianoEnElDesierto,
      AlimentandoALosPeces: actividadAlimentandoALosPeces,
      InstalandoJuegos: actividadInstalandoJuegos,
      NoMeCansoDeSaltar: actividadNoMeCansoDeSaltar,
      ElGatoEnLaCalle: actividadElGatoEnLaCalle
      /*LaGranAventuraDelMarEncantado: actividadLaGranAventuraDelMarEncantado
      ReparandoLaNave: actividadReparandoLaNave
      LaberintoCorto: actividadLaberintoCorto
      TresNaranjas: actividadTresNaranjas*/
    };

    var actividad = actividades[nombreActividad];

    if (!actividad) {
      return null;
    }

    return Actividad.create({actividad});
  }
});
