# -*- encoding: utf-8 -*-
import os

DIRECTORIO_WINDOWS = 'distribuibles/ejemplo/win'
DIRECTORIO_BASE = os.path.abspath(os.path.curdir)


def rm(archivo_o_directorio):
    print("Borrando '%s'" %(archivo_o_directorio))
    os.system("rm -r -f '%s'" %(archivo_o_directorio))

def crear_directorio(ruta):
    print("Creando el directorio '%s'" %(ruta))
    os.makedirs(ruta)

def exists(path):
    return os.path.exists(path)

def copy(desde, hasta):
    print("Copiando '%s' -> '%s'" %(desde, hasta))
    os.system("cp -r '%s' '%s'" %(desde, hasta))

def realizar_zip(nombre_salida):
    print("Creando el archivo '%s'" %(nombre_salida))
    os.system('zip -r %s *' %(nombre_salida))

def renombrar(antes, despues):
    print("Renombrando '%s' -> '%s'" %(antes, despues))
    os.system("mv '%s' '%s'" %(antes, despues))

def fusionar(destino, fuente1, fuente2):
    print "Generando el archivo '%s'" %(destino)
    os.system("cat '%s' '%s' > '%s'" %(fuente1, fuente2, destino))

def generar_instalador(ruta):
    print "Generando el instalador"
    os.system("makensis '%s'" %(ruta))


# crear el directorio salida para window
if exists(DIRECTORIO_WINDOWS):
    rm(DIRECTORIO_WINDOWS)


crear_directorio(DIRECTORIO_WINDOWS)

# obtiene los binarios iniciales de nodewebkit 0.7.5
# para windows.
if not exists('extras/nodewebkit-bins'):
    copy('/Users/hugoruscitti/Google Drive/nodewebkit-bins', 'extras/')

if exists(DIRECTORIO_WINDOWS + '/public'):
    rm(DIRECTORIO_WINDOWS + '/public')



copy('public', DIRECTORIO_WINDOWS)

os.chdir(DIRECTORIO_WINDOWS + '/public')
realizar_zip('public.zip')
os.chdir(DIRECTORIO_BASE)

renombrar(DIRECTORIO_WINDOWS + '/public/public.zip', DIRECTORIO_WINDOWS + '/pilas-engine-bloques.nw')
rm(DIRECTORIO_WINDOWS + '/public')


for x in os.listdir('extras/nodewebkit-bins/'):
    copy('extras/nodewebkit-bins/%s' %(x), DIRECTORIO_WINDOWS + '/')

fusionar(DIRECTORIO_WINDOWS + '/pilas-engine-bloques.exe', DIRECTORIO_WINDOWS + '/nw.exe', DIRECTORIO_WINDOWS + '/pilas-engine-bloques.nw')

rm(DIRECTORIO_WINDOWS + '/pilas-engine-bloques.nw')
rm(DIRECTORIO_WINDOWS + '/nw.exe')
rm(DIRECTORIO_WINDOWS + '/credits.html')

copy('extras/instalador.nsi',  DIRECTORIO_WINDOWS + '/')

generar_instalador(DIRECTORIO_WINDOWS + '/instalador.nsi')

#renombrar(DIRECTORIO_WINDOWS + '/public/public.zip', DIRECTORIO_WINDOWS + '/pilas-engine-bloques.nw')
copy('distribuibles/ejemplo/win/pilas-engine-bloques_0.1.0.exe', '/Users/hugoruscitti/Google Drive/')
copy('distribuibles/ejemplo/win/pilas-engine-bloques_0.1.0.exe', '/Users/hugoruscitti/shared/')


"""
rm -r -f distwin
rm -r -f distwin.zip
rm -r -f conectar-educativo.nw
rm -r -f /Users/hugoruscitti/shared/conectar-educativo.nw

mkdir distwin
cp -r -f src/* distwin
mkdir distwin/node_modules
cp -r -f node_modules/ffthumb distwin/node_modules/
cp -r -f node_modules/nedb distwin/node_modules/
cp -r -f node_modules/fs-extra distwin/node_modules/
cd distwin
zip -r distwin.zip *
mv distwin.zip ..
cd ..
mv distwin.zip conectar-educativo.nw
rm -r -f distwin/*

#cp conectar-educativo.nw /Users/hugoruscitti/shared/

cp extras/bins/* distwin/
cp extras/instalador.nsi distwin/
mv conectar-educativo.nw distwin/
cat distwin/nw.exe distwin/conectar-educativo.nw > distwin/conectar-educativo.exe
rm distwin/nw.exe distwin/conectar-educativo.nw

cp -rf distwin ../../shared/


echo "El instalador está en el directorio shared/distwin, solo queda compilar el instalador."
"""
