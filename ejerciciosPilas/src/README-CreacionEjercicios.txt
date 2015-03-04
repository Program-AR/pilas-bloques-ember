La idea es:
  -> Crear un nuevo archivo en la carpeta src/escenas que se llame <nombre de la escena>.ts.
  	Por ejemplo, "ElObreroCopado.ts".
  -> Definir dentro una clase que extienda de Base con su método iniciar()
  -> Abrir visorEjercicios.html con el navegador, indicando la clase de la escena a
  	cargar en la URL. Por ejemplo:
		file:///home/alf/..../visorEjercicios.html?nombre=ElObreroCopado
	(notar el "?nombre=ElObreroCopado" detrás de la URL).