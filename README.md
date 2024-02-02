![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Ember](https://img.shields.io/badge/ember-1C1E24?style=for-the-badge&logo=ember.js&logoColor=#D04A37)

¡Hola! :vulcan_salute: Este es un proyecto relacionado a [Pilas Bloques](https://pilasbloques.program.ar) :heart:. En el repositorio de ese proyecto encontrarás las guías sobre [cómo contribuir](https://github.com/Program-AR/pilas-bloques-app/blob/develop/CONTRIBUTING.md) y el [código de conducta](https://github.com/Program-AR/pilas-bloques-app/blob/develop/CODE_OF_CONDUCT.md), que son guías que aplican también a este proyecto.

Hi! :vulcan_salute: This is a project related to [Pilas Bloques](https://pilasbloques.program.ar) :heart:. In that project's repository you'll find the [contribution guidelines](https://github.com/Program-AR/pilas-bloques-app/blob/develop/CONTRIBUTING_en.md) and the [code of conduct](https://github.com/Program-AR/pilas-bloques-app/blob/develop/CODE_OF_CONDUCT_en.md) which also apply to this project.
_____________

## Sobre este proyecto

Este es el repositorio de las primeras versiones de Pilas Bloques, desarrolladas en la tecnología Ember.JS. Este proyecto ya no es el principal de Pilas Bloques, el proyecto principal es [pilas-bloques-app](https://github.com/Program-AR/pilas-bloques-app). 

Para contribuir o aportar, se recomienda empezar por ese proyecto. Este proyecto pronto será deprecado.

### Sobre los grupos experimentales:

Pilas Bloques puede compilarse de forma distinta dependiendo del grupo experimental a construir. Eso se logra seteando la variable de entorno `EXPERIMENT_GROUP` al buildear o compilar:

```
EXPERIMENT_GROUP=treatment npm run start
```

En Windows esto se tiene que hacer con:
```
SET "EXPERIMENT_GROUP=treatment" && npm run start
```

Los grupos experimentales pueden ser: `notAffected`, `control`, `treatment`, `autoassign` y `off`.

- `notAffected`: (default) no muestra ningún tipo de feedback sobre la solución propuesta.
- `control`: al finalizar un desafío muestra las expectativas existentes para el mismo, sin informar si se cumplieron o no.
- `treatment`: tiene un período de entrenamiento en el cual muestra las expectativas existentes sobre el desafío, junto con una barra de progreso para las que se cumplieron. Se agrega feedback sobre los bloques. Una vez terminado el período de entrenamiento pasa a tener un comportamiento similar a *control*.
- `autoassign`: asigna aleatoriamente un grupo experimental en tiempo de ejecución (elige entre `control` y `treatment).
- `off`: Siempre muestra las expectativas y la barra de progreso. Deja de mostrar la encuesta de preguntas al usuario.

