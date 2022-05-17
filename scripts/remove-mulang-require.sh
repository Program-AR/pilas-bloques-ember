echo "Removing mulang require version";
sed -i "0,/require('..\\/package.json').version/s//''/" ./node_modules/mulang/build/mulang.js