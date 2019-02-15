import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

moduloActividad("Lita - Alternativa condicional");

actividadTest("5.1.4a", {
  descripcionAdicional: '5.1.4a: Se puede resolver (solución 1)',
  solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverACasillaDerecha">
          <next>
            <block type="MoverACasillaDerecha">
              <next>
                <block type="sino">
                  <value name="condition">
                    <block type="HayTomate"></block>
                  </value>
                  <statement name="block1">
                    <block type="AgarrarTomate"></block>
                  </statement>
                  <statement name="block2">
                    <block type="AgarrarLechuga"></block>
                  </statement>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
});

actividadTest("5.1.4a", {
  descripcionAdicional: '5.1.4a: Se puede resolver (solución 2)',
  solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverACasillaDerecha">
          <next>
            <block type="MoverACasillaDerecha">
              <next>
                <block type="sino">
                  <value name="condition">
                    <block type="HayLechuga"></block>
                  </value>
                  <statement name="block1">
                    <block type="AgarrarLechuga"></block>
                  </statement>
                  <statement name="block2">
                    <block type="AgarrarTomate"></block>
                  </statement>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
});

actividadTest("5.1.4a", {
  descripcionAdicional: '5.1.4a: Se puede resolver (solución 3)',
  solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverACasillaDerecha">
          <next>
            <block type="MoverACasillaDerecha">
              <next>
                <block type="si">
                  <value name="condition">
                    <block type="HayLechuga"></block>
                  </value>
                  <statement name="block">
                    <block type="AgarrarLechuga"></block>
                  </statement>
                  <next>
                    <block type="si">
                      <value name="condition">
                        <block type="HayTomate"></block>
                      </value>
                      <statement name="block">
                        <block type="AgarrarTomate"></block>
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
  </xml>`,
});


actividadTest("5.2.1c", {
  descripcionAdicional: "5.2.1c: Se puede resolver",
  solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="repetir">
          <value name="count">
            <block type="math_number">
              <field name="NUM">6</field>
            </block>
          </value>
          <statement name="block">
            <block type="MoverACasillaAbajo">
              <next>
                <block type="si">
                  <value name="condition">
                    <block type="HayTomate"></block>
                  </value>
                  <statement name="block">
                    <block type="AgarrarTomate"></block>
                  </statement>
                  <next>
                    <block type="si">
                      <value name="condition">
                        <block type="HayLechuga"></block>
                      </value>
                      <statement name="block">
                        <block type="AgarrarLechuga"></block>
                      </statement>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </statement>
          <next>
            <block type="MoverACasillaAbajo">
              <next>
                <block type="PrepararEnsalada"></block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`
});

actividadTest('5.2.1c',{
  descripcionAdicional: '5.2.1c: al obtener todas las frutas y verduras menos una, no deberia resolver el problema',
  solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="al_empezar_a_ejecutar" id="Tkv6e`TEkvoPN4rv%#;c" deletable="false" movable="false" editable="false" x="271" y="15"><statement name="program"><block type="repetir" id="c~+OWAe{|HH8|Nzy:mg)"><value name="count"><block type="math_number" id=";{bTiDxulj,_XkUZs}dF"><field name="NUM">5</field></block></value><statement name="block"><block type="MoverACasillaAbajo" id="|8}Gm3#j$t^+=Q?*8`G;"><next><block type="si" id="(aJ{4;YPZfEPR#z)l-}i"><value name="condition"><block type="HayTomate" id="Wc:fOtKy(cz_`!XgC})G"></block></value><statement name="block"><block type="AgarrarTomate" id="[J*!yQY]hg9XHXs%h1jI"></block></statement><next><block type="si" id="el;YB$p}ta54$Ksg5@2]"><value name="condition"><block type="HayLechuga" id="+3Z^oyb9D}^TXLLY?o9E"></block></value><statement name="block"><block type="AgarrarLechuga" id="BrSqx]_}_n-2dj@3}*RO"></block></statement></block></next></block></next></block></statement><next><block type="MoverACasillaAbajo" id="Vk8|soLV.jaj1AL#?VhX"><next><block type="MoverACasillaAbajo" id="nKfT_6dYtx]uSTCd`C$A"><next><block type="PrepararEnsalada" id="U#pEpfSr0`MRitQ7$zBk"></block></next></block></next></block></next></block></statement></block></xml>',
  resuelveDesafio: false,
  errorEsperado: "Necesito todos los ingredientes"
});