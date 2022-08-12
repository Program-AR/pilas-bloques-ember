echo Getting Pilasweb and pilas-bloques-exercises versions

PILAS_BLOQUES_EXERCISES_VERSION=$(awk '$1 ~ /"pilas-bloques-exercises"/ {print $2}' package.json)

PILASWEB_VERSION=$(awk '$1 ~ /"pilasweb"/ {print $2}' package.json)

change_version(){
    local version=$(echo "$2" | sed 's/[",^]//g')
    sed -i "s/${1}.js?v=[0-9]*.[0-9]*.[0-9]*/${1}.js?v=${version}/g" public/pilas.html
}

echo Changing pilas.html versions 

change_version "pilas-bloques-exercises" $PILAS_BLOQUES_EXERCISES_VERSION
change_version "pilasweb" $PILASWEB_VERSION