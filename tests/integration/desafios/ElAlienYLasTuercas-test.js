import {moduloActividad, actividadTest} from '../../helpers/actividadTest';

const nombre = 'ElAlienYLasTuercas';

moduloActividad(nombre);

actividadTest(nombre, {
  solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="7" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="16" inline="true"><value name="count"><block type="math_number" id="17"><field name="NUM">4</field></block></value><statement name="block"><block type="MoverACasillaArriba" id="23"></block></statement><next><block type="repetir" id="45" inline="true"><value name="count"><block type="math_number" id="46"><field name="NUM">4</field></block></value><statement name="block"><block type="LevantaTuerca" id="29"><next><block type="MoverACasillaAbajo" id="35"><next><block type="MoverACasillaDerecha" id="41"></block></next></block></next></block></statement><next><block type="LevantaTuerca" id="53"></block></next></block></next></block></statement></block></xml>',
  cantidadDeActoresAlComenzar: {
    TuercaAnimada: 5,
    AlienAnimado: 1
  },
  cantidadDeActoresAlTerminar: {
    TuercaAnimada: 0,
    AlienAnimado: 1
  }
});
