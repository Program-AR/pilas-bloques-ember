import { moduloActividad, actividadTest } from '../../../helpers/actividadTest';

moduloActividad("Duba - Alternativa condicional", () => {

  actividadTest("5.1.3a", {
    descripcionAdicional: "5.1.3a: Se puede resolver",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaDerecha">
      <next>
      <block type="si">
        <value name="condition">
          <block type="HayChurrasco"></block>
        </value>
        <statement name="block">
          <block type="ComerChurrasco">
          </block>
        </statement>
      </block>
      </next>
      </block>
    </statement>
    </block>
  </xml>`
  });

  actividadTest("5.1.3b", {
    descripcionAdicional: "5.1.3b: Se puede resolver",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaDerecha">
      <next>
      <block type="si">
        <value name="condition">
          <block type="HayChurrasco"></block>
        </value>
        <statement name="block">
          <block type="ComerChurrasco">
          </block>
        </statement>
      <next>
      <block type="MoverACasillaDerecha">
      <next>
      <block type="si">
        <value name="condition">
          <block type="HayChurrasco"></block>
        </value>
        <statement name="block">
          <block type="ComerChurrasco">
          </block>
        </statement>
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
    </statement>
    </block>
  </xml>`
  });

  actividadTest("5.1.4b", {
    descripcionAdicional: "5.1.4b: Se puede resolver (solución 1)",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="SiNo">
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

  actividadTest("5.1.4b", {
    descripcionAdicional: "5.1.4b: Se puede resolver (solución 2)",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="SiNo">
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

  actividadTest("5.1.4c", {
    descripcionAdicional: "5.1.4c: Se puede resolver",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaDerecha">
      <next>
      <block type="SiNo">
        <value name="condition">
          <block type="HayObstaculoDerecha"></block>
        </value>
        <statement name="block1">
          <block type="MoverACasillaArriba">
          <next>
          <block type="MoverACasillaDerecha">
          <next>
          <block type="MoverACasillaDerecha">
          <next>
          <block type="MoverACasillaAbajo">
          </block>
          </next>
          </block>
          </next>
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
      <block type="MoverACasillaDerecha">
      <next>
      <block type="ComerChurrasco">
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
    </statement>
    </block>
  </xml>`
  });

  actividadTest("5.2.1a", {
    descripcionAdicional: "5.2.1a: Se puede resolver",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="Repetir">
        <value name="count">
          <block type="math_number">
            <field name="NUM">7</field>
          </block>
        </value>
        <statement name="block">
          <block type="MoverACasillaDerecha">
          </block>
        </statement>
      <next>
      <block type="si">
        <value name="condition">
          <block type="HayChurrasco"></block>
        </value>
        <statement name="block">
          <block type="ComerChurrasco">
          </block>
        </statement>
      </block>
      </next>
      </block>
    </statement>
    </block>
  </xml>`
  });

  actividadTest("5.2.1b", {
    descripcionAdicional: "5.2.1b: Se puede resolver",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="Repetir">
        <value name="count">
          <block type="math_number">
            <field name="NUM">7</field>
          </block>
        </value>
        <statement name="block">
          <block type="MoverACasillaDerecha">
          <next>
          <block type="si">
            <value name="condition">
              <block type="HayChurrasco"></block>
            </value>
            <statement name="block">
              <block type="ComerChurrasco">
              </block>
            </statement>
          </block>
          </next>
          </block>
        </statement>
      </block>
    </statement>
    </block>
  </xml>`
  });

});
