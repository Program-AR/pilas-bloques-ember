import {moduloActividad, actividadTest} from '../../helpers/actividadTest';

const nombre = 'LaberintoCorto';

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="23" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="sino" id="24" inline="true"><value name="condition"><block type="TocandoAbajo" id="25"></block></value><statement name="block1"><block type="MoverACasillaAbajo" id="26"></block></statement><statement name="block2"><block type="MoverACasillaDerecha" id="27"></block></statement></block></statement></block></xml>',
});
