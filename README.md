pilas-engine-bloques
====================

Una aplicación experimental para fomentar el aprendizaje
de la programación usando [pilas-engine](http://www.pilas-engine.com.ar) y
[blockly](https://developers.google.com/blockly/).


![](preview/main.png)



Instalación para desarrolladores
--------------------------------

Antes de comenzar, necesitas tener instalado ``nodejs`` (que
viene con ``npm`` incluido) y las dependencias ``bower``, ``grunt`` y
``grunt-cli``.

Para instalar ``nodejs`` podés leer el [siguiente tutorial de instalación](http://examplelab.com.ar/como-instalar-nodejs-en-huayra-linux/), y
para instalar las otras dependencias podés ejecutar los comandos:

```
sudo npm install -g bower grunt grunt-cli
```

Luego, para instalar la aplicación en sí:

```
git clone http://github.com/hugoruscitti/pilas-engine-bloques
cd pilas-engine-bloques
npm install
bower install
```

Luego, invocando a ``make`` vas a ver los comandos mas comunes para
utilizar, y si algo de lo que querés hacer no está ahí, también vas a poder
usar los comandos ``ember``, ``npm`` o ``grunt``.
