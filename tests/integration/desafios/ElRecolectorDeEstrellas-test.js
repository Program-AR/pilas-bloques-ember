import {moduloActividad, actividadTest} from '../../helpers/actividadTest';

const nombre = 'ElRecolectorDeEstrellas';

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="115" inline="true"><value name="count"><block type="math_number" id="116"><field name="NUM">3</field></block></value><statement name="block"><block type="procedures_callnoreturn" id="107"><mutation name="tomar estellas de la fila completa"></mutation><next><block type="VolverABordeIzquierdo" id="121"><next><block type="MoverACasillaArriba" id="126"></block></next></block></next></block></statement><next><block type="procedures_callnoreturn" id="129"><mutation name="tomar estellas de la fila completa"></mutation></block></next></block></statement></block><block type="procedures_defnoreturn" id="92" x="14" y="268"><mutation></mutation><field name="NAME">tomar estellas de la fila completa</field><statement name="STACK"><block type="repetir" id="89" inline="true"><value name="count"><block type="math_number" id="90"><field name="NUM">4</field></block></value><statement name="block"><block type="MoverACasillaDerecha" id="97"><next><block type="TomarEstrella" id="102"></block></next></block></statement></block></statement></block></xml>',
  cantidadDeActoresAlComenzar: {
    "EstrellaAnimada": 4 * 4
  },
  cantidadDeActoresAlTerminar: {
    "EstrellaAnimada": 0
  }
});
