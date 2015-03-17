class RecogerEstrella extends Recoger {
 paso;
    imagenAnterior;  
	iniciar(receptor) {
        super.iniciar(receptor);
        pilas.escena_actual().intentaronRecoger();
    }
}

