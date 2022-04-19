#!/bin/bash
declare -a FoldersToMigrate=("font-awesome/scss" "angular-material-styles/src/core" "angular-material-styles/src/components" )

for folder in "${FoldersToMigrate[@]}"; do
   echo "Changing deprecated division - ${folder}";
   sass-migrator division node_modules/$folder/**/*.scss node_modules/$folder/*.scss;
done

