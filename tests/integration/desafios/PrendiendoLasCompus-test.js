import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = 'PrendiendoLasCompus';

moduloActividad(nombre, () => {

	actividadTest(nombre, {
		solucion: `<?xml version="1.0" encoding="UTF-8"?>
	<xml xmlns="http://www.w3.org/1999/xhtml">
	   <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0">
		  <statement name="program">
			 <block type="procedures_callnoreturn" id="114">
				<mutation name="Prender hacia derecha" />
				<next>
				   <block type="procedures_callnoreturn" id="120">
					  <mutation name="Prender hacia abajo" />
					  <next>
						 <block type="procedures_callnoreturn" id="132">
							<mutation name="prender hacia izquierda" />
							<next>
							   <block type="procedures_callnoreturn" id="126">
								  <mutation name="prender hacia arriba" />
							   </block>
							</next>
						 </block>
					  </next>
				   </block>
				</next>
			 </block>
		  </statement>
	   </block>
	   <block type="procedures_defnoreturn" id="32" x="263" y="32">
		  <mutation />
		  <field name="NAME">Prender hacia derecha</field>
		  <statement name="STACK">
			 <block type="MoverACasillaDerecha" id="202">
				<next>
				   <block type="hasta" id="60" inline="true">
					  <value name="condition">
						 <block type="EstoyEnEsquina" id="62" />
					  </value>
					  <statement name="block">
						 <block type="PrenderComputadora" id="68">
							<next>
							   <block type="MoverACasillaDerecha" id="79" />
							</next>
						 </block>
					  </statement>
				   </block>
				</next>
			 </block>
		  </statement>
	   </block>
	   <block type="procedures_defnoreturn" id="44" x="10" y="172">
		  <mutation />
		  <field name="NAME">prender hacia arriba</field>
		  <statement name="STACK">
			 <block type="MoverACasillaArriba" id="208">
				<next>
				   <block type="hasta" id="147" inline="true">
					  <value name="condition">
						 <block type="EstoyEnEsquina" id="149" />
					  </value>
					  <statement name="block">
						 <block type="PrenderComputadora" id="178">
							<next>
							   <block type="MoverACasillaArriba" id="172" />
							</next>
						 </block>
					  </statement>
				   </block>
				</next>
			 </block>
		  </statement>
	   </block>
	   <block type="procedures_defnoreturn" id="35" x="260" y="265">
		  <mutation />
		  <field name="NAME">Prender hacia abajo</field>
		  <statement name="STACK">
			 <block type="MoverACasillaAbajo" id="214">
				<next>
				   <block type="hasta" id="85" inline="true">
					  <value name="condition">
						 <block type="EstoyEnEsquina" id="91" />
					  </value>
					  <statement name="block">
						 <block type="PrenderComputadora" id="108">
							<next>
							   <block type="MoverACasillaAbajo" id="97" />
							</next>
						 </block>
					  </statement>
				   </block>
				</next>
			 </block>
		  </statement>
	   </block>
	   <block type="procedures_defnoreturn" id="39" x="128" y="355">
		  <mutation />
		  <field name="NAME">prender hacia izquierda</field>
		  <statement name="STACK">
			 <block type="MoverACasillaIzquierda" id="221">
				<next>
				   <block type="hasta" id="154" inline="true">
					  <value name="condition">
						 <block type="EstoyEnEsquina" id="156" />
					  </value>
					  <statement name="block">
						 <block type="PrenderComputadora" id="184">
							<next>
							   <block type="MoverACasillaIzquierda" id="195" />
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

	actividadTest(nombre, {
		descripcionAdicional: 'Da error si se intenta prender una computadora donde no hay',
		errorEsperado: 'No hay una computadora aquí',
		solucion: `<?xml version="1.0" encoding="UTF-8"?>
				<xml xmlns="http://www.w3.org/1999/xhtml">
   					<variables />
   					<block type="al_empezar_a_ejecutar" id="f??M^^OalsGN9_LMY{!8" deletable="false" movable="false" editable="false" x="15" y="15">
      					<statement name="program">
         					<block type="PrenderComputadora" id="0h,Qgm8I1;Z5CLtd[U(4" />
      					</statement>
					   </block>
				</xml>`,
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Da error si se intenta prender una computadora que ya esta prendida',
		errorEsperado: 'Esta computadora ya fue prendida',
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="al_empezar_a_ejecutar" id="m]4qN#uBu1{*2RN{P7b/" deletable="false" movable="false" editable="false" x="15" y="15"><statement name="program"><block type="MoverACasillaAbajo" id="Vcm9$Ds4ZHA8.%cgUoL3"><next><block type="PrenderComputadora" id="G(LhjH54n`MKDK:OMZ=A"><next><block type="PrenderComputadora" id="ob^9-_ZqX[Jc)c#+jt}F"></block></next></block></next></block></statement></block></xml>',
	});

});