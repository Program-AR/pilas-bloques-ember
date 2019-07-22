import { moduloActividad, actividadTest } from '../../../helpers/actividadTest';

moduloActividad("Lita - Repetición", () => {

    actividadTest("4.I1a", {
        descripcionAdicional: '4.I1.a: Se puede resolver',
        solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
        <statement name="program">
        <block type="Repetir">
            <value name="count">
            <block type="math_number">
                <field name="NUM">3</field>
            </block>
            </value>
            <statement name="block">
            <block type="MoverACasillaIzquierda">
                <next>
                <block type="MoverACasillaAbajo">
                    <next>
                    <block type="MoverACasillaAbajo"></block>
                    </next>
                </block>
                </next>
            </block>
            </statement>
            <next>
            <block type="MoverACasillaIzquierda">
                <next>
                <block type="AgarrarTomate">
                    <next>
                    <block type="MoverACasillaIzquierda">
                        <next>
                        <block type="AgarrarLechuga">
                            <next>
                            <block type="MoverACasillaIzquierda">
                                <next>
                                <block type="PrepararEnsalada"></block>
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


    actividadTest("4.I1b", {
        descripcionAdicional: "4.I1b: La solución propuesta no resuelve el problema",
        solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="Repetir" disabled="true" x="42" y="-249">
        <value name="count">
        <block type="math_number">
            <field name="NUM">10</field>
        </block>
        </value>
    </block>
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
        <statement name="program">
        <block type="Repetir">
            <value name="count">
            <block type="math_number">
                <field name="NUM">4</field>
            </block>
            </value>
            <statement name="block">
            <block type="MoverACasillaArriba"></block>
            </statement>
            <next>
            <block type="AgarrarLechuga">
                <next>
                <block type="Repetir">
                    <value name="count">
                    <block type="math_number">
                        <field name="NUM">5</field>
                    </block>
                    </value>
                    <statement name="block">
                    <block type="MoverACasillaDerecha">
                        <next>
                        <block type="AgarrarTomate"></block>
                        </next>
                    </block>
                    </statement>
                    <next>
                    <block type="MoverACasillaDerecha">
                        <next>
                        <block type="PrepararEnsalada"></block>
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
        errorEsperado: "¡Acá no hay lechuga!"
    });

    actividadTest("4.I1b", {
        descripcionAdicional: "4.I1b: La solución correcta resuelve el problema",
        solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="Repetir" disabled="true" x="42" y="-249">
        <value name="count">
        <block type="math_number">
            <field name="NUM">10</field>
        </block>
        </value>
    </block>
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
        <statement name="program">
        <block type="Repetir">
            <value name="count">
            <block type="math_number">
                <field name="NUM">5</field>
            </block>
            </value>
            <statement name="block">
            <block type="MoverACasillaArriba"></block>
            </statement>
            <next>
            <block type="AgarrarLechuga">
                <next>
                <block type="Repetir">
                    <value name="count">
                    <block type="math_number">
                        <field name="NUM">5</field>
                    </block>
                    </value>
                    <statement name="block">
                    <block type="MoverACasillaDerecha"></block>
                    </statement>
                    <next>
                    <block type="AgarrarTomate">
                        <next>
                        <block type="MoverACasillaDerecha">
                            <next>
                            <block type="PrepararEnsalada"></block>
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
    </xml>`
    });

});
