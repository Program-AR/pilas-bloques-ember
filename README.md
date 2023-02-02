![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Ember](https://img.shields.io/badge/ember-1C1E24?style=for-the-badge&logo=ember.js&logoColor=#D04A37)

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/Program-AR/pilas-bloques/issues)
[![open issues](https://badgen.net/github/open-issues/Program-AR/pilas-bloques)](https://github.com/Program-AR/pilas-bloques/issues)
![downloads](https://img.shields.io/github/downloads/Program-AR/pilas-bloques/total.svg)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

[:gb: Read in English](https://github.com/Program-AR/pilas-bloques/blob/develop/README_en.md)
_____________

# Pilas Bloques - Una herramienta para aprender a programar

<p align="center">
  <img src="https://user-images.githubusercontent.com/5421992/216465215-be8ae60c-5498-42ef-acc2-1d57fa38b349.svg" width="70%" />
</p>

## Sobre la aplicación

Pilas Bloques es una aplicación para enseñar y aprender a programar, desarrollada especialmente para el aula. Se proponen desafíos con diversos niveles de dificultad para acercar a las y los estudiantes al mundo de la programación por medio de bloques. Para más información, ver el [Acerca De](https://pilasbloques.program.ar/acerca-de-pilas-bloques/) de Pilas Bloques.

![](https://github.com/Program-AR/pilas-bloques/blob/master/screenshots/desafios.png)
![](https://github.com/Program-AR/pilas-bloques/blob/master/screenshots/editor.png)



## Cómo contribuír

¡En la guia de [CONTRIBUTING](https://github.com/Program-AR/pilas-bloques/blob/develop/CONTRIBUTING.md) tenés toda la informacion necesaria para contribuir al proyecto!

## Cómo instalar el entorno de desarrollo

Para colaborar en Pilas Bloques vas a tener que instalar [Git](https://git-scm.com/) y clonar el repositorio de [Pilas Bloques](https://github.com/Program-AR/pilas-bloques):

```
git clone https://github.com/Program-AR/pilas-bloques.git
```

### Pre-requisitos
  
* Node. La version requerida para el proyecto está en el archivo `.nvmrc`.

  Debian/Ubuntu:
  ```
  git clone https://github.com/nvm-sh/nvm.git ~/.nvm
  source ~/.nvm/nvm.sh
  source ~/.nvm/install.sh
  nvm install .
  ```

### Usá la version de NodeJS de Pilas Bloques:
```
nvm use
```
  
### Instalá las dependencias del proyecto:
```
npm install
```

## Comandos comunes de desarrollo

### Correr todos los tests:
```
npm test
```

### Levantar Pilas Bloques:
```
npm run start
```

### Buildear Pilas Bloques:

```
npm run build
```

### Sobre los grupos experimentales:

Pilas Bloques puede compilarse de forma distinta dependiendo del grupo experimental a construir. Eso se logra seteando la variable de entorno `EXPERIMENT_GROUP` al buildear o compilar:

```
EXPERIMENT_GROUP=treatment npm run start
```

En Windows esto se tiene que hacer con:
```
SET "EXPERIMENT_GROUP=treatment" && npm run start
```

Los grupos experimentales pueden ser: `notAffected`, `control`, `treatment` y `autoassign`.

- `notAffected`: (default) no muestra ningún tipo de feedback sobre la solución propuesta.
- `control`: al finalizar un desafío muestra las expectativas existentes para el mismo, sin informar si se cumplieron o no.
- `treatment`: tiene un período de entrenamiento en el cual muestra las expectativas existentes sobre el desafío, junto con una barra de progreso para las que se cumplieron. Se agrega feedback sobre los bloques. Una vez terminado el período de entrenamiento pasa a tener un comportamiento similar a *control*.
- `autoassign`: asigna aleatoriamente un grupo experimental en tiempo de ejecución (elige entre `control` y `treatment).

### Empaquetando instaladores:

- Por defecto, al hacer un _release_ de la aplicación, el CI se encarga de generar todos los instaladores empaquetados. Por ejemplo: al correr `npm run release:patch`.
- Para hacerlo de manera local, primero hay que correr el comando `EXPERIMENT_GROUP=treatment npm run build:prod` (seteando la variable de entorno relacionada al grupo experimental) y luego buildear el instalador correspondiente a tu SO. Por ejemplo: `npm run pack:linux`.
- Si se desea buildear para otro SO (que no sea el tuyo) hay que tener en cuenta que solamente se puede hacer desde linux. Además, hay que tener instaladas ciertas dependencias:
  - **Windows:** se necesita tener instalado `nsis`, `wine` y `wine-mono`.
    - Debian/Ubuntu:

      ```
      sudo apt install nsis
      ```
    - Arch:

      ```
      yay -S nsis
      ```
  - **macOS:** no disponible.

### Preparar el backend (opcional):

Para tener un backend para probar funcionalidades relacionadas a usuarios y a guardar desafios es necesario tener levantado los proyectos de Pilas Bloques API, Pilas Bloques Analytics, (ambos disponibles en el proyecto [backend](https://github.com/Program-AR/pilas-bloques-backend)) y una base de datos [MongoDB](https://www.mongodb.com/).

_____________

### Release & deploy (Solo para el equipo de Pilas Bloques)
https://github.com/Program-AR/pilas-bloques/wiki/Release-y-Deploy

_____________

### Registro de cambios
[aquí](notasDeVersion.md)
