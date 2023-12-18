import { moduloActividad, actividadTest } from '../../../../helpers/actividadTest';

const nombre = "1009";

moduloActividad(nombre, () => {

	actividadTest(nombre, {
		solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
	  <block type="al_empezar_a_ejecutar" id="141" deletable="false" movable="false" editable="false" x="0" y="0">
	    <statement name="program">
	      <block type="procedures_callnoreturn" id="142">
	        <mutation name="Buscar cargador"></mutation>
	        <next>
	          <block type="procedures_callnoreturn" id="143">
	            <mutation name="Cargar celus de arriba"></mutation>
	            <next>
	              <block type="procedures_callnoreturn" id="144">
	                <mutation name="Cargar celus de abajo"></mutation>
	              </block>
	            </next>
	          </block>
	        </next>
	      </block>
	    </statement>
	  </block>
	  <block type="procedures_defnoreturn" id="145" x="477" y="34">
	    <mutation></mutation>
	    <field name="NAME">Cargar celus de arriba</field>
	    <statement name="STACK">
	      <block type="MoverACasillaArriba" id="146">
	        <next>
	          <block type="Repetir" id="147" inline="true">
	            <value name="count">
	              <block type="math_number" id="148">
	                <field name="NUM">4</field>
	              </block>
	            </value>
	            <statement name="block">
	              <block type="MoverACasillaIzquierda" id="149">
	                <next>
	                  <block type="CargarCelular" id="150"></block>
	                </next>
	              </block>
	            </statement>
	          </block>
	        </next>
	      </block>
	    </statement>
	  </block>
	  <block type="procedures_defnoreturn" id="151" x="20" y="219">
	    <mutation></mutation>
	    <field name="NAME">Buscar cargador</field>
	    <statement name="STACK">
	      <block type="Repetir" id="152" inline="true">
	        <value name="count">
	          <block type="math_number" id="153">
	            <field name="NUM">2</field>
	          </block>
	        </value>
	        <statement name="block">
	          <block type="MoverACasillaArriba" id="154"></block>
	        </statement>
	        <next>
	          <block type="Repetir" id="155" inline="true">
	            <value name="count">
	              <block type="math_number" id="156">
	                <field name="NUM">4</field>
	              </block>
	            </value>
	            <statement name="block">
	              <block type="MoverACasillaDerecha" id="157"></block>
	            </statement>
	            <next>
	              <block type="AgarrarCargador" id="158"></block>
	            </next>
	          </block>
	        </next>
	      </block>
	    </statement>
	  </block>
	  <block type="procedures_defnoreturn" id="159" x="473" y="345">
	    <mutation></mutation>
	    <field name="NAME">Cargar celus de abajo</field>
	    <statement name="STACK">
	      <block type="Repetir" id="160" inline="true">
	        <value name="count">
	          <block type="math_number" id="161">
	            <field name="NUM">3</field>
	          </block>
	        </value>
	        <statement name="block">
	          <block type="MoverACasillaAbajo" id="162"></block>
	        </statement>
	        <next>
	          <block type="Repetir" id="163" inline="true">
	            <value name="count">
	              <block type="math_number" id="164">
	                <field name="NUM">3</field>
	              </block>
	            </value>
	            <statement name="block">
	              <block type="MoverACasillaDerecha" id="165">
	                <next>
	                  <block type="CargarCelular" id="166"></block>
	                </next>
	              </block>
	            </statement>
	          </block>
	        </next>
	      </block>
	    </statement>
	  </block>
	</xml>`,
	});

});
