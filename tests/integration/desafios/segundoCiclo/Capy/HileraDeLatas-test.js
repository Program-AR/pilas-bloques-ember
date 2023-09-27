import { moduloActividad, actividadTest } from '../../../../helpers/actividadTest';

const nombre = 'HileraDeLatas';

moduloActividad(nombre, () => {

	actividadTest(nombre, {
		solucion: '<xml xmlns=\"http://www.w3.org/1999/xhtml\"><variables></variables><block type=\"al_empezar_a_ejecutar\" id=\"zgQ0+[L]_[4[!wBGxNvV\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\"><statement name=\"program\"><shadow type=\"required_statement\" id=\"+Z(-=`Jr)~b1fhWnMr3s\"></shadow><block type=\"MoverACasillaIzquierda\" id=\"E_#^X}OjB+5VMt-aF!Z^\"><next><block type=\"MoverACasillaIzquierda\" id=\"yzAl9N#Rtg[wGo[lEphn\"><next><block type=\"Si\" id=\"?C?8/MJ]bB!3[v[:}^E;\"><value name=\"condition\"><shadow type=\"required_value\" id=\"b%5B@DaV54BZ1V~^Q=`=\"></shadow><block type=\"TocandoLata\" id=\"/CVR9Yk,z.];$psxbe$b\"></block></value><statement name=\"block\"><shadow type=\"required_statement\" id=\"7C]Y.kyJfn#~@}fv.fJ:\"></shadow><block type=\"repetir\" id=\"J8gSNFFtVcfo4]o;rc5T\"><value name=\"count\"><shadow type=\"required_value\" id=\"_ss4F$Wv^LW-g2b+n@yA\"></shadow><block type=\"math_number\" id=\"G:PlW_~9(-{rUl#T^g^x\"><field name=\"NUM\">3</field></block></value><statement name=\"block\"><shadow type=\"required_statement\" id=\"3KMlnUtt80%)C}=z%$y]\"></shadow><block type=\"RecogerLata\" id=\"pw!.Lh0;tV,*CE;7GKVk\"><next><block type=\"MoverACasillaAbajo\" id=\"89Hegs/D]`SL4N_BEp39\"></block></next></block></statement><next><block type=\"RecogerLata\" id=\"*6Lp%P7?,xTz@=Yz;Vk*\"><next><block type=\"repetir\" id=\"_X0=O.==|VChd!aH9m_g\"><value name=\"count\"><shadow type=\"required_value\" id=\"GScGqN9|Yw,k37wYj]$v\"></shadow><block type=\"math_number\" id=\"mW/s-7?*-{5/Ljc~Ckt$\"><field name=\"NUM\">3</field></block></value><statement name=\"block\"><shadow type=\"required_statement\" id=\"??EQ3g2G|1!d:j]-B^I,\"></shadow><block type=\"MoverACasillaArriba\" id=\"Ej5zvGF[q)PTFyV]HWVM\"></block></statement></block></next></block></next></block></statement><next><block type=\"MoverACasillaIzquierda\" id=\"69J;EQkK~Lk]U_W~NEsu\"><next><block type=\"MoverACasillaIzquierda\" id=\"Q8*tkyNM*]NxXKxLwM0P\"><next><block type=\"Si\" id=\"L9x``JH4{x|Jo`~64{JE\"><value name=\"condition\"><shadow type=\"required_value\" id=\"k,WZ:4_gAW:3UUz_+;qk\"></shadow><block type=\"TocandoLata\" id=\"#_@$M3_w?/v-]P%cPGt@\"></block></value><statement name=\"block\"><shadow type=\"required_statement\" id=\"I3-j;w`Y)@#9:FKtIvN#\"></shadow><block type=\"RecogerLata\" id=\"A*MGNJ3zMzu7vI95Ve(@\"></block></statement></block></next></block></next></block></next></block></next></block></next></block></statement></block></xml>'
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Da error al querer avanzar hacia una casilla con obstaculos',
		solucion: '<xml xmlns=\"http://www.w3.org/1999/xhtml\"><variables></variables><block type=\"al_empezar_a_ejecutar\" id=\"NM_JO$8pGwA`|zV5gLT4\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\"><statement name=\"program\"><shadow type=\"required_statement\" id=\"?,iVo5gL9O{y48Joxs]Z\"></shadow><block type=\"MoverACasillaAbajo\" id=\"u2Icda]N(xCSyjOa7Q:I\"></block></statement></block></xml>',
		errorEsperado: 'No puedo ir para abajo',
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Da error al querer recoger una lata donde no hay',
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml">\n  <variables></variables>\n  <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">\n    <statement name="program">\n      <shadow type="required_statement"></shadow>\n      <block type="RecogerLata"></block>\n    </statement>\n  </block>\n</xml>',
		errorEsperado: 'Acá no hay una lata',
	});

});
