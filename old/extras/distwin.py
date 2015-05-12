# -*- encoding: utf-8 -*-
import os

DIRECTORIO_WINDOWS = 'distribuibles/ejemplo/win'
DESTINO = DIRECTORIO_WINDOWS + '/destino'
DIRECTORIO_BASE = os.path.abspath(os.path.curdir)
CONSERVAR_NW = True


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

if exists(DESTINO):
    rm(DESTINO)

copy('dist', DESTINO)

os.chdir(DESTINO)
realizar_zip('destino.zip')
os.chdir(DIRECTORIO_BASE)

renombrar(DESTINO + '/destino.zip', DIRECTORIO_WINDOWS + '/pilas-engine-bloques.nw')
rm(DESTINO)


for x in os.listdir('extras/nodewebkit-bins/'):
    copy('extras/nodewebkit-bins/%s' %(x), DIRECTORIO_WINDOWS + '/')

fusionar(DIRECTORIO_WINDOWS + '/pilas-engine-bloques.exe', DIRECTORIO_WINDOWS + '/nw.exe', DIRECTORIO_WINDOWS + '/pilas-engine-bloques.nw')

if not CONSERVAR_NW:
    rm(DIRECTORIO_WINDOWS + '/pilas-engine-bloques.nw')
    rm(DIRECTORIO_WINDOWS + '/nw.exe')
    rm(DIRECTORIO_WINDOWS + '/credits.html')

copy('extras/instalador.nsi',  DIRECTORIO_WINDOWS + '/')

generar_instalador(DIRECTORIO_WINDOWS + '/instalador.nsi')

copy('distribuibles/ejemplo/win/pilas-engine-bloques_0.1.6.exe', '/Users/hugoruscitti/Google Drive/binarios-pilas-engine-bloques/')
copy('distribuibles/ejemplo/win/pilas-engine-bloques_0.1.6.exe', '/Users/hugoruscitti/shared/')
