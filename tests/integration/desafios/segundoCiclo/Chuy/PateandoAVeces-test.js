import { moduloActividad, actividadTest } from '../../../../helpers/actividadTest';

const nombre = "1013";

moduloActividad(nombre, () => {

  actividadTest(nombre, {
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="25" deletable="false" movable="false" editable="false" x="0" y="0">
    <statement name="program">
      <block type="MoverACasillaDerecha" id="26">
        <next>
          <block type="procedures_callnoreturn" id="40">
            <mutation name="Patear pelota si hay"></mutation>
          </block>
        </next>
      </block>
    </statement>
  </block>

  <block type="procedures_defnoreturn" id="32" x="-11" y="110">
    <mutation></mutation>
    <field name="NAME">Patear pelota si hay</field>
    <statement name="STACK">
      <block type="si" id="27" inline="true">
        <value name="condition"><block type="TocandoPelotaChuy" id="28"></block></value>
        <statement name="block"><block type="PatearPelotaChuy" id="29"></block></statement>
      </block>
    </statement>
  </block>
  </xml>`,
  });

  
  actividadTest(nombre, {
    descripcionAdicional: 'Debe moverse a la posición final para que esté resuelto',
    resuelveDesafio: false,
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <variables></variables>
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="0" y="0">
      <statement name="program">
        <shadow type="required_statement"></shadow>
        <block type="procedures_callnoreturn">
          <mutation name="Patear pelota si hay"></mutation>
        </block>
      </statement>
    </block>
    <block type="procedures_defnoreturn" x="18" y="178">
      <field name="NAME">Patear pelota si hay</field>
      <statement name="STACK">
        <block type="si">
          <value name="condition">
            <shadow type="required_value"></shadow>
            <block type="TocandoPelotaChuy"></block>
          </value>
          <statement name="block">
            <shadow type="required_statement"></shadow>
            <block type="PatearPelotaChuy"></block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`
  })
});