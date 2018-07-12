Internacionalización
=============
## ¿Cómo agregar un nuevo idioma para Pilas Bloques?

En primer lugar, hay que clonar el repositorio

```sh
git clone https://github.com/ingridc/pilas-bloques.git
```
Luego, hay que seguir los pasos que se encuentran en el archivo README.md del proyecto.

Una vez que se hayan instalado las dependencias, hay que generar los archivos locales para el nuevo idioma. Por ejemplo, si se quiere agregar el idioma francés el comando a ejecutar sería el siguiente:
```sh
ember generate locale fr
```
Esta acción genera el archivo translations.js donde hay que realizar las traduccciones.
