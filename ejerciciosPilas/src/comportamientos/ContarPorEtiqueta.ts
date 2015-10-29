/// <reference path="ComportamientoAnimado.ts"/>

/*
Requiere que la escena tenga como atributo una instancia de la
clase contadorDeEtiquetas bajo el nombre contadorDeEtiquetas y una
funcion llamada personajePrincipal que devuelve precisamente dicho
personaje


Ejemplo de uso: ElMonoQueSabeContar.ts
*/


class ContarPorEtiqueta extends ComportamientoColision {
  nombreAnimacion(){
    // redefinir por subclase
    return "contar";
  }
    metodo(objetoColision){
        this.argumentos['dondeReflejarValor'].aumentar(1);
    }
}
