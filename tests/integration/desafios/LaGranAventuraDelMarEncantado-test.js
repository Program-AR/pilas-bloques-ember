import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = 'LaGranAventuraDelMarEncantado';

moduloActividad(nombre, () => {

	actividadTest(nombre, {
		descripcionAdicional: 'Da error al dar sombrero sin tenerlo',
		solucion: `<?xml version="1.0" encoding="UTF-8"?>
	<xml xmlns="http://www.w3.org/1999/xhtml">
		 <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0">
				<statement name="program">
					 <block type="MoverACasillaDerecha" id="11">
							<next>
								 <block type="DarSombrero" id="24" />
							</next>
					 </block>
				</statement>
		 </block>
	</xml>`,

		errorEsperado: 'Para darle el sombrero al mago necesitás sacarlo del cofre.',
	});


	actividadTest(nombre, {
		solucion: `
	<xml xmlns="http://www.w3.org/1999/xhtml">
	  <block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0">
	    <statement name="program">
	      <block type="procedures_callnoreturn" id="3">
	        <mutation name="Buscar llave"></mutation>
	        <next>
	          <block type="procedures_callnoreturn" id="4">
	            <mutation name="Buscar Sombrero"></mutation>
	            <next>
	              <block type="procedures_callnoreturn" id="5">
	                <mutation name="Buscar espada"></mutation>
	                <next>
	                  <block type="procedures_callnoreturn" id="6">
	                    <mutation name="Luchar con el caballero"></mutation>
	                    <next>
	                      <block type="procedures_callnoreturn" id="7">
	                        <mutation name="Rescatar princesa"></mutation>
	                      </block>
	                    </next>
	                  </block>
	                </next>
	              </block>
	            </next>
	          </block>
	        </next>
	      </block>
	    </statement>
	  </block>
	  <block type="procedures_defnoreturn" id="8" x="500" y="-5">
	    <field name="NAME">Buscar Sombrero</field>
	    <comment pinned="false" h="80" w="160">Describe esta función...</comment>
	    <statement name="STACK">
	      <block type="MoverACasillaArriba" id="9">
	        <next>
	          <block type="repetir" id="10">
	            <value name="count">
	              <block type="math_number" id="11">
	                <field name="NUM">4</field>
	              </block>
	            </value>
	            <statement name="block">
	              <block type="MoverACasillaIzquierda" id="12"></block>
	            </statement>
	            <next>
	              <block type="AbrirCofre" id="49"></block>
	            </next>
	          </block>
	        </next>
	      </block>
	    </statement>
	  </block>
	  <block type="procedures_defnoreturn" id="13" x="249" y="14">
	    <field name="NAME">Rescatar princesa</field>
	    <comment pinned="false" h="80" w="160">Describe esta función...</comment>
	    <statement name="STACK">
	      <block type="repetir" id="14">
	        <value name="count">
	          <block type="math_number" id="15">
	            <field name="NUM">2</field>
	          </block>
	        </value>
	        <statement name="block">
	          <block type="MoverACasillaAbajo" id="16">
	            <next>
	              <block type="MoverACasillaDerecha" id="17"></block>
	            </next>
	          </block>
	        </statement>
	        <next>
	          <block type="EscaparEnUnicornio" id="18"></block>
	        </next>
	      </block>
	    </statement>
	  </block>
	  <block type="procedures_defnoreturn" id="19" x="552" y="138">
	    <field name="NAME">Luchar con el caballero</field>
	    <comment pinned="false" h="80" w="160">Describe esta función...</comment>
	    <statement name="STACK">
	      <block type="repetir" id="20">
	        <value name="count">
	          <block type="math_number" id="21">
	            <field name="NUM">2</field>
	          </block>
	        </value>
	        <statement name="block">
	          <block type="MoverACasillaArriba" id="22"></block>
	        </statement>
	        <next>
	          <block type="MoverACasillaDerecha" id="23">
	            <next>
	              <block type="AtacarConEspada" id="24"></block>
	            </next>
	          </block>
	        </next>
	      </block>
	    </statement>
	  </block>
	  <block type="procedures_defnoreturn" id="25" x="10" y="274">
	    <field name="NAME">Buscar llave</field>
	    <comment pinned="false" h="80" w="160">Describe esta función...</comment>
	    <statement name="STACK">
	      <block type="repetir" id="26">
	        <value name="count">
	          <block type="math_number" id="27">
	            <field name="NUM">2</field>
	          </block>
	        </value>
	        <statement name="block">
	          <block type="MoverACasillaArriba" id="28"></block>
	        </statement>
	        <next>
	          <block type="repetir" id="29">
	            <value name="count">
	              <block type="math_number" id="30">
	                <field name="NUM">4</field>
	              </block>
	            </value>
	            <statement name="block">
	              <block type="MoverACasillaDerecha" id="31"></block>
	            </statement>
	            <next>
	              <block type="AgarrarLlave" id="73"></block>
	            </next>
	          </block>
	        </next>
	      </block>
	    </statement>
	  </block>
	  <block type="procedures_defnoreturn" id="32" x="309" y="270">
	    <field name="NAME">Buscar espada</field>
	    <comment pinned="false" h="80" w="160">Describe esta función...</comment>
	    <statement name="STACK">
	      <block type="repetir" id="33">
	        <value name="count">
	          <block type="math_number" id="34">
	            <field name="NUM">3</field>
	          </block>
	        </value>
	        <statement name="block">
	          <block type="MoverACasillaAbajo" id="35"></block>
	        </statement>
	        <next>
	          <block type="MoverACasillaDerecha" id="36">
	            <next>
	              <block type="DarSombrero" id="37"></block>
	            </next>
	          </block>
	        </next>
	      </block>
	    </statement>
	  </block>
	</xml>
	`
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Solo puede escapar sobre el unicornio',
		solucion: `<?xml version="1.0" encoding="UTF-8"?>
<xml xmlns="http://www.w3.org/1999/xhtml">
   <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0">
      <statement name="program">
         <block type="procedures_callnoreturn" id="58">
            <mutation name="Ir a buscar la llave" />
            <next>
               <block type="procedures_callnoreturn" id="306">
                  <mutation name="Ir al Cofre" />
                  <next>
                     <block type="procedures_callnoreturn" id="328">
                        <mutation name="Ir al mago" />
                        <next>
                           <block type="procedures_callnoreturn" id="299">
                              <mutation name="Ir a pelear" />
                              <next>
                                 <block type="procedures_callnoreturn" id="292">
                                    <mutation name="Ir a Escapar" />
                                 </block>
                              </next>
                           </block>
                        </next>
                     </block>
                  </next>
               </block>
            </next>
         </block>
      </statement>
   </block>
   <block type="procedures_defnoreturn" id="78" x="233" y="26">
      <mutation />
      <field name="NAME">Ir al Cofre</field>
      <statement name="STACK">
         <block type="repetir" id="120" inline="true">
            <value name="count">
               <block type="math_number" id="121">
                  <field name="NUM">4</field>
               </block>
            </value>
            <statement name="block">
               <block type="MoverACasillaIzquierda" id="137" />
            </statement>
            <next>
               <block type="MoverACasillaArriba" id="147">
                  <next>
                     <block type="AbrirCofre" id="267" />
                  </next>
               </block>
            </next>
         </block>
      </statement>
   </block>
   <block type="procedures_defnoreturn" id="3" x="-30" y="191">
      <mutation />
      <field name="NAME">Ir a buscar la llave</field>
      <statement name="STACK">
         <block type="repetir" id="17" inline="true">
            <value name="count">
               <block type="math_number" id="18">
                  <field name="NUM">4</field>
               </block>
            </value>
            <statement name="block">
               <block type="MoverACasillaDerecha" id="34" />
            </statement>
            <next>
               <block type="repetir" id="23" inline="true">
                  <value name="count">
                     <block type="math_number" id="24">
                        <field name="NUM">2</field>
                     </block>
                  </value>
                  <statement name="block">
                     <block type="MoverACasillaArriba" id="46" />
                  </statement>
                  <next>
                     <block type="AgarrarLlave" id="257" />
                  </next>
               </block>
            </next>
         </block>
      </statement>
   </block>
   <block type="procedures_defnoreturn" id="96" x="252" y="216">
      <mutation />
      <field name="NAME">Ir a pelear</field>
      <statement name="STACK">
         <block type="MoverACasillaArriba" id="422">
            <next>
               <block type="MoverACasillaArriba" id="392">
                  <next>
                     <block type="MoverACasillaDerecha" id="402">
                        <next>
                           <block type="AtacarConEspada" id="237" />
                        </next>
                     </block>
                  </next>
               </block>
            </next>
         </block>
      </statement>
   </block>
   <block type="procedures_defnoreturn" id="102" x="223" y="404">
      <mutation />
      <field name="NAME">Ir a Escapar</field>
      <statement name="STACK">
         <block type="repetir" id="444" inline="true">
            <value name="count">
               <block type="math_number" id="445">
                  <field name="NUM">2</field>
               </block>
            </value>
            <statement name="block">
               <block type="MoverACasillaAbajo" id="465" />
            </statement>
            <next>
               <block type="EscaparEnUnicornio" id="163" />
            </next>
         </block>
      </statement>
   </block>
   <block type="procedures_defnoreturn" id="82" x="-29" y="448">
      <mutation />
      <field name="NAME">Ir al mago</field>
      <statement name="STACK">
         <block type="repetir" id="340" inline="true">
            <value name="count">
               <block type="math_number" id="341">
                  <field name="NUM">3</field>
               </block>
            </value>
            <statement name="block">
               <block type="MoverACasillaAbajo" id="357" />
            </statement>
            <next>
               <block type="MoverACasillaDerecha" id="367">
                  <next>
                     <block type="DarSombrero" id="217" />
                  </next>
               </block>
            </next>
         </block>
      </statement>
   </block>
</xml>`,
		errorEsperado: 'Para escapar hace falta un transporte',
	});

});