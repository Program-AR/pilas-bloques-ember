Pilas Bloques
=============

- Issues planificados para este sprint: [![Stories in Ready](https://badge.waffle.io/Program-AR/pilas-bloques.png?label=ready&title=Ready)](http://waffle.io/Program-AR/pilas-bloques)

- Rama master: [![Build Status](https://travis-ci.org/Program-AR/pilas-bloques.svg?branch=master)](https://travis-ci.org/Program-AR/pilas-bloques)
- Rama develop (principal): [![Build Status](https://travis-ci.org/Program-AR/pilas-bloques.svg?branch=develop)](https://travis-ci.org/Program-AR/pilas-bloques)

Esta es una versión hermana de [pilas-engine](http://www.pilas-engine.com.ar) pero
utilizando bloques, javascript y desafíos para aprender a programar.

![](screenshots/principal.png)
![](screenshots/desafios.png)
![](screenshots/editor.png)

¿Cómo empezar?
--------------

Generalmente, lo que se suele hacer inmeditamente después de clonar el repositorio es instalar lo necesario:

Para la dependencia node-gyp es necesario g++, si no lo tenés:
```
sudo apt-get install g++

```

Al igual que make:
```
sudo apt-get install make

```

Y lo mismo con python:
```
sudo apt install python

```

Y también hay que asegurarse de tener node (actualmente compilamos con node 6)

Podemos lograrlo con nvm, para lo cual hay que instalarlo:
```
git clone https://github.com/creationix/nvm.git ~/.nvm
source ~/.nvm/nvm.sh
source ~/.nvm/install.sh
```

Y luego elegir la versión de node:

```
nvm install 6.11.3
nvm use 6.11.3
```

Luego, se puede escribir el comando ``make`` para ver las tareas disponibles:

![](screenshots/make.png)

Luego, para instalar las dependencias, compilar el módulo ejercicios_pilas y correr la aplicación, sencillamente:

```
make full
make serve
```

En general, para compilar diariamente, con `make serve` ya es suficiente.


Tests
-----

Para ejecutar los tests de la aplicación hay 3 opciones:

1. Levantar el server de test:

```
  make test
```

2. Ejecutar los tests de forma contínua:


```
  ember test --watch
```

De todas formas, aunque no ejecutes los tests en forma local, en este
proyecto estamos usando travis para que los test se ejecuten siempre
después de cada "push":

https://travis-ci.org/Program-AR/pilas-bloques


Notas de versión
---------

[acá](notasDeVersion.md)