sass_migrator_division() {
    sass-migrator division **/* *.scss;
}

echo 'Changing deprecated division - font-awesome';

cd node_modules/font-awesome/scss
sass_migrator_division;

cd ../..

echo 'Changing deprecated division - angular-material-styles'

cd angular-material-styles/src/core
sass_migrator_division;

cd ../components
sass_migrator_division;

