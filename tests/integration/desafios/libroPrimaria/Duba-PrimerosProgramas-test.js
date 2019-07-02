import { moduloActividad, actividadTest } from '../../../helpers/actividadTest';

moduloActividad("Duba - Primeros programas", () => {

  actividadTest("3.1.2a", {
    descripcionAdicional: "3.1.2a: Se puede resolver",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
	<block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
	  <statement name="program">
		<block type="MoverACasillaDerecha" id="8[h9[(my?v_@jD)IcuKE">
		  <next>
			<block type="MoverACasillaDerecha" id="v+,Ok5cc3fDiIKwPAk/4">
			  <next>
				<block type="MoverACasillaDerecha" id="OARN?q)8N!G$yqD~ggLS">
				  <next>
					<block type="ComerChurrasco" id="@q@H9YgNq*KKMvwR1piM"></block>
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

  actividadTest("3.1.2a", {
    descripcionAdicional: '2.1.2a: Da error al querer ir hacia un obstáculo para arriba',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaArriba" id="[j1z:])m?Mh%?/XP?l[L">
        <next>
          <block type="MoverACasillaArriba" id="S-R^yFz^|+NIp(zQ%NQz"></block>
        </next>
      </block>
    </statement>
	</block>
	</xml>`,
    errorEsperado: '¡Hay un obstáculo!',
  });

  actividadTest("3.1.2a", {
    descripcionAdicional: '2.1.2a: Da error al querer ir hacia un obstáculo para abajo',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaAbajo" id="]1_W/tT]L@3Fen:kZ./o">
        <next>
          <block type="MoverACasillaAbajo" id="I=#YBk\`DIMK(HwFxND^: "></block>
        </next >
      </block >
    </statement >
  </block >
	<block type="MoverACasillaIzquierda" id="sUjx|1FMK-$Qk*M]r+v0" disabled="true" x="180" y="412"></block>
	</xml>`,
    errorEsperado: '¡Hay un obstáculo!',
  });

  actividadTest("3.1.2a", {
    descripcionAdicional: '2.1.2a: Da error al querer ir hacia un obstáculo para la izquierda',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaArriba" id="[j1z:])m?Mh%?/XP?l[L">
        <next>
          <block type="MoverACasillaIzquierda" id="sUjx|1FMK-$Qk*M]r+v0"></block>
        </next>
      </block>
    </statement>
  </block>
	</xml>`,
    errorEsperado: '¡Hay un obstáculo!',
  });

  actividadTest("3.1.2a", {
    descripcionAdicional: '2.1.2a: Da error al querer ir hacia un obstáculo para la derecha',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaAbajo" id="]1_W/tT]L@3Fen:kZ./o">
        <next>
          <block type="MoverACasillaDerecha" id="jl?^E$CNB+bTIr6s?Cm:">
            <next>
              <block type="MoverACasillaDerecha" id="A\`EX-GcDLDQ3: R3^)a1{
"></block>
            </next >
          </block >
        </next >
      </block >
    </statement >
  </block >
	</xml>`,
    errorEsperado: '¡Hay un obstáculo!',
  });

  actividadTest("3.1.2b", {
    descripcionAdicional: "3.1.2b: Se puede resolver",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
	<block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
	  <statement name="program">
		<block type="MoverACasillaDerecha" id="vWmE|Gys1c:mq}x1MZd\`">
		  <next>
			<block type="MoverACasillaArriba" id="blishcLMaS@!CJ/jN2*C">
			  <next>
				<block type="MoverACasillaDerecha" id="v4eE0P;G:4s^0_J)g;aZ">
				  <next>
					<block type="ComerChurrasco" id="1Ung=~(.u7.3|xb=rB}T"></block>
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

  actividadTest("3.1.2c", {
    descripcionAdicional: "3.1.2c: Se puede resolver",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
	<block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
	  <statement name="program">
		<block type="MoverACasillaAbajo" id="!qt\`8P39sG1c-Q]vH?_Y">
		  <next>
			<block type="MoverACasillaDerecha" id=",p].T7y2yKjPus:BWD{*">
			  <next>
				<block type="MoverACasillaDerecha" id="Y0f~w(|^hBZd#CDF[r.s">
				  <next>
					<block type="MoverACasillaDerecha" id="fo}s{cSKtXd[[}U_gIYV">
					  <next>
						<block type="ComerChurrasco" id="NUpdF^nWU:j|27,ujCJq"></block>
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
	</xml>`,
  });

  actividadTest("3.1.2d", {
    descripcionAdicional: "3.1.2d: Se puede resolver",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
	<block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
	  <statement name="program">
		<block type="MoverACasillaAbajo" id="4d^RFl:3Hm3l4}%72ACw">
		  <next>
			<block type="MoverACasillaAbajo" id="Gn0fSd*\`m}f@zd]Oc{/w">
			  <next>
				<block type="MoverACasillaDerecha" id="n0+i)4+X,f9Jq1EtY[_y">
				  <next>
					<block type="MoverACasillaAbajo" id="!pg3lRSOp_a|CFYEi3Vc">
					  <next>
						<block type="ComerChurrasco" id="?+W)lEebw*)\`.V^6bg$~"></block>
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
	</xml>`,
  });

  actividadTest("3.1.2e", {
    descripcionAdicional: "3.1.2e: Se puede resolver (solución 1)",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
	<block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
	  <statement name="program">
		<block type="MoverACasillaAbajo" id="[R9.}A16EZ4|v*+kAx81">
		  <next>
			<block type="MoverACasillaAbajo" id="Unq{?$;[gC-|U$*V7ljp">
			  <next>
				<block type="MoverACasillaDerecha" id="bIhb6Dg~ath3ms_.BA(M">
				  <next>
					<block type="MoverACasillaDerecha" id="[3K3sg;Nx(A^z#,K(^9m">
					  <next>
						<block type="ComerChurrasco" id="8\`.V6vsJ)0TG}o$m|CFo"></block>
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
	</xml>`,
  });

  actividadTest("3.1.2e", {
    descripcionAdicional: "3.1.2e: Se puede resolver (solución 2)",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
	<block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
	  <statement name="program">
		<block type="MoverACasillaDerecha" id="bIhb6Dg~ath3ms_.BA(M">
		  <next>
			<block type="MoverACasillaDerecha" id="[3K3sg;Nx(A^z#,K(^9m">
			  <next>
				<block type="MoverACasillaAbajo" id="[R9.}A16EZ4|v*+kAx81">
				  <next>
					<block type="MoverACasillaAbajo" id="Unq{?$;[gC-|U$*V7ljp">
					  <next>
						<block type="ComerChurrasco" id="8\`.V6vsJ)0TG}o$m|CFo"></block>
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
	</xml>`,
  });

  actividadTest("3.1.2f", {
    descripcionAdicional: "3.1.2f: Se puede resolver",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
	<block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
	  <statement name="program">
		<block type="MoverACasillaArriba" id="c/ns5YzzTOu52ksu\`$fA">
		  <next>
			<block type="MoverACasillaArriba" id="X!=;kUH]p$;}@N%Ze-c2">
			  <next>
				<block type="MoverACasillaDerecha" id="T0E[i5GoG_?*d$V!=hXv">
				  <next>
					<block type="MoverACasillaDerecha" id="^HU+kGMwLLAyseYZEp]1">
					  <next>
						<block type="MoverACasillaAbajo" id=";|msv)0jl+P(/01!Z(hk">
						  <next>
							<block type="ComerChurrasco" id="+1DMZb!Q2.O?L:NZj{K("></block>
						  </next>
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
	</xml>`,
  });


  actividadTest("3.2.3a", {
    descripcionAdicional: "3.2.3a: La solución provista no resuelve el problema",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
  <statement name="program">
    <block type="MoverACasillaArriba">
    <next>
    <block type="MoverACasillaIzquierda">
    <next>
    <block type="MoverACasillaIzquierda">
    <next>
    <block type="MoverACasillaAbajo">
    <next>
    <block type="MoverACasillaIzquierda">
    <next>
    <block type="MoverACasillaArriba">
    <next>
    <block type="MoverACasillaArriba">
    <next>
    <block type="ComerChurrasco">
    </block>
    </next>
    </block>
    </next>
    </block>
    </next>
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
</xml>`,
    errorEsperado: "¡Hay un obstáculo!",
  });

  actividadTest("3.2.3a", {
    descripcionAdicional: "3.2.3a: La solución corregida resuelve el problema",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaArriba">
      <next>
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaAbajo">
      <next>
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaArriba">
      <next>
      <block type="MoverACasillaArriba">
      <next>
      <block type="ComerChurrasco">
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
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
  </xml>`,
  });

  actividadTest("3.2.3b", {
    descripcionAdicional: "3.2.3b: La solución provista no resuelve el problema",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
  <statement name="program">
    <block type="MoverACasillaIzquierda">
    <next>
    <block type="MoverACasillaArriba">
    <next>
    <block type="MoverACasillaArriba">
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
</xml>`,
    errorEsperado: "¡Hay un obstáculo!",
  });

  actividadTest("3.2.3b", {
    descripcionAdicional: "3.2.3b: La solución corregida resuelve el problema",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaArriba">
      <next>
      <block type="MoverACasillaArriba">
      <next>
      <block type="ComerChurrasco">
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
  </xml>`,
  });

  actividadTest("3.2.3c", {
    descripcionAdicional: "3.2.3c: La solución provista no resuelve el problema",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
  <statement name="program">
    <block type="MoverACasillaAbajo">
    <next>
    <block type="MoverACasillaAbajo">
    <next>
    <block type="MoverACasillaIzquierda">
    <next>
    <block type="MoverACasillaArriba">
    <next>
    <block type="ComerChurrasco">
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
</xml>`,
    errorEsperado: "¡Hay un obstáculo!",
  });

  actividadTest("3.2.3c", {
    descripcionAdicional: "3.2.3c: La solución corregida resuelve el problema",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaAbajo">
      <next>
      <block type="MoverACasillaAbajo">
      <next>
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaArriba">
      <next>
      <block type="MoverACasillaArriba">
      <next>
      <block type="ComerChurrasco">
      </block>
      </next>
      </block>
      </next>
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
    </xml>`,
  });

  actividadTest("3.2.3d", {
    descripcionAdicional: "3.2.3d: La solución provista no resuelve el problema",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaArriba">
      <next>
      <block type="MoverACasillaArriba">
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
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
    </statement>
    </block>
  </xml>`,
    errorEsperado: "¡Hay un obstáculo!"
  });

  actividadTest("3.2.3d", {
    descripcionAdicional: "3.2.3d: La solución corregida resuelve el problema",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaArriba">
      <next>
      <block type="MoverACasillaArriba">
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
      </next>
      </block>
      </next>
      </block>
    </statement>
    </block>
  </xml>`,
  });

});

