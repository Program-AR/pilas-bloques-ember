/*jshint unused:false*/

import Ember from 'ember';


import actividadAlien from 'pilas-engine-bloques/actividades/actividadAlien';
import actividadLaEleccionDelMono from 'pilas-engine-bloques/actividades/actividadLaEleccionDelMono';
import actividadElMonoYLasBananas from 'pilas-engine-bloques/actividades/actividadElMonoYLasBananas';
import actividadLightbotEnScratch from 'pilas-engine-bloques/actividades/actividadLightbotEnScratch';
import actividadFutbolRobots from 'pilas-engine-bloques/actividades/actividadFutbolRobots';
import actividadElPlanetaDeNano from 'pilas-engine-bloques/actividades/actividadElPlanetaDeNano';
import actividadAlienTocaBoton from 'pilas-engine-bloques/actividades/actividadAlienTocaBoton';



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
      ElPlanetaDeNano: actividadElPlanetaDeNano
    };

    var actividad = actividades[nombreActividad];

    if (!actividad) {
      return null;
    }

    return Actividad.create({actividad});
  }
});
