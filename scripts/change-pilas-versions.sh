echo Getting Pilasweb and pilas-bloques-exercises versions
PILAS_BLOQUES_EXERCISES_VERSION="$(awk '$1 ~ /"pilas-bloques-exercises"/ {print $2}' ../package.json | sed 's/[",^]//g')"

PILASWEB_VERSION=$(awk '$1 ~ /"pilasweb"/ {print $2}' ../package.json | sed 's/[",^]//g')

echo Changing pilas.html versions 
sed "s/pilasweb.js?v=[0-9].[0-9].[0-9]/pilasweb.js?v=${PILASWEB_VERSION}/g" ../public/pilas.html
sed "s/pilas-bloques-exercises.js?v=[0-9].[0-9].[0-9]/pilas-bloques-exercises.js?v=${PILAS_BLOQUES_EXERCISES_VERSION}/g" ../public/pilas.html