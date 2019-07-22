import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = 'ElSuperviaje';

moduloActividad(nombre, () => {

	actividadTest(nombre, {
		solucion: `<?xml version="1.0" encoding="UTF-8"?>
				<xml xmlns="http://www.w3.org/1999/xhtml">
   					<block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0">
      					<statement name="program">
         					<block type="Repetir" id="26" inline="true">
            					<value name="count">
               						<block type="KmsTotales" id="29" />
            					</value>
           					 	<statement name="block">
               						<block type="Avanzar1km" id="12" />
            					</statement>
         					</block>
      					</statement>
   					</block>
				</xml>`,
	});
	
});