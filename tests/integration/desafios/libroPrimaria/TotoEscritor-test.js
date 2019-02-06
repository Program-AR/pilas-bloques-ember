import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

moduloActividad("Toto escritor");

actividadTest("5.I1d", {
  descripcionAdicional: 'Se brinda un mensaje de error al intentar escribir un carácter inválido',
  solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <variables></variables>
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="378" y="15">
      <statement name="program">
        <block type="EscribirTextoDadoEnOtraCuadricula">
          <field name="texto">¡HOLA!</field>
        </block>
      </statement>
    </block>
  </xml>`,
  errorEsperado: 'No sé escribir ese símbolo'
});
