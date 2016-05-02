import {moduleForComponent} from 'ember-qunit';
import {actividadTest} from '../../helpers/actividadTest';
import actConColumnas from 'pilas-engine-bloques/actividades/actividadElMonoQueSabeContar';
import actConFilas from 'pilas-engine-bloques/actividades/actividadFutbolRobots';

moduleForComponent('pilas-editor','bloques:SiguienteFilayColumna',  {  integration: true, });

actividadTest(actConFilas, {
  descripcionAdicional: 'Da error al querer avanzar a la siguiente fila',
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="MoverACasillaDerecha" id="54"><next><block type="SiguienteFila" id="120"></block></next></block></statement></block></xml>',
  expectedErrorMsg: 'No puedo ir desde acá, tengo que estar al inicio de la fila',
});

actividadTest(actConColumnas, {
  descripcionAdicional: 'Da error al querer avanzar a la siguiente columna',
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="3" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="MoverACasillaAbajo" id="49"><next><block type="SiguienteColumna" id="43"></block></next></block></statement></block></xml>',
  expectedErrorMsg: 'No puedo ir desde acá, tengo que estar al inicio de la columna',
});
