import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

let nombre = "4.1.4b";

moduloActividad(nombre);

actividadTest(nombre, {
    descripcionAdicional: "La solución 1 funciona",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="sino">
        <value name="condition">
          <block type="HayObstaculoDerecha"></block>
        </value>
        <statement name="block1">
          <block type="MoverACasillaAbajo">
          <next>
          <block type="MoverACasillaAbajo">
          </block>
          </next>
          </block>
        </statement>
        <statement name="block2">
          <block type="MoverACasillaDerecha">
          <next>
          <block type="MoverACasillaDerecha">
          </block>
          </next>
          </block>
        </statement>
      <next>
      <block type="ComerChurrasco">
      </block>
      </next>
      </block>
    </statement>
    </block>
  </xml>`
});

actividadTest(nombre, {
  descripcionAdicional: "La solución 2 funciona",
  solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="sino">
        <value name="condition">
          <block type="HayObstaculoAbajo"></block>
        </value>
        <statement name="block1">
          <block type="MoverACasillaDerecha">
          <next>
          <block type="MoverACasillaDerecha">
          </block>
          </next>
          </block>
        </statement>
        <statement name="block2">
          <block type="MoverACasillaAbajo">
          <next>
          <block type="MoverACasillaAbajo">
          </block>
          </next>
          </block>
        </statement>
      <next>
      <block type="ComerChurrasco">
      </block>
      </next>
      </block>
    </statement>
    </block>
  </xml>`
});
