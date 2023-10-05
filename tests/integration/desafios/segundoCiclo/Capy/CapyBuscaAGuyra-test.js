import { moduloActividad, actividadTest } from '../../../../helpers/actividadTest';

const nombre = "CapyBuscaAGuyra";

moduloActividad(nombre, () => {

  actividadTest(nombre, {
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <variables></variables>
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <shadow type="required_statement"></shadow>
        <block type="VolverAlBordeIzquierdo">
          <next>
            <block type="Hasta">
              <value name="condition">
                <shadow type="required_value"></shadow>
                <block type="TocandoGuyra"></block>
              </value>
              <statement name="block">
                <shadow type="required_statement"></shadow>
                <block type="MoverACasillaDerecha"></block>
              </statement>
              <next>
                <block type="SubirPajarito"></block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`}
  )
}); 