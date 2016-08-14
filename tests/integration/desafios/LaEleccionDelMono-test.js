import {moduloActividad, actividadTest} from '../../helpers/actividadTest';


const nombre ='LaEleccionDelMono';

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="16" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Avanzar" id="20"><next><block type="sino" id="22" inline="true"><value name="condition"><block type="tocandoManzana" id="30"></block></value><statement name="block1"><block type="ComerManzana" id="26"></block></statement><statement name="block2"><block type="ComerBanana" id="34"></block></statement></block></next></block></statement></block></xml>',
	descripcionAdicional: 'por Banana',
  cantidadDeActoresAlTerminar: {
    "MonoAnimado": 1
  }
});
