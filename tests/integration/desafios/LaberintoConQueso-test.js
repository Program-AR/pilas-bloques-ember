import {moduloActividad, actividadTest} from '../../helpers/actividadTest';

const nombre = 'LaberintoConQueso';

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="hasta" id="51" inline="true"><value name="condition"><block type="TocandoFinCamino" id="61"></block></value><statement name="block"><block type="si" id="74" inline="true"><value name="condition"><block type="tocandoQueso" id="79"></block></value><statement name="block"><block type="ComerQueso" id="92"></block></statement><next><block type="sino" id="14" inline="true"><value name="condition"><block type="TocandoAbajo" id="26"></block></value><statement name="block1"><block type="MoverACasillaAbajo" id="30"></block></statement><statement name="block2"><block type="MoverACasillaDerecha" id="38"></block></statement></block></next></block></statement></block></statement></block></xml>',
});
