const shelljs = require('shelljs');

let filesToFix = ["parent.js", "child.js"]

filesToFix.forEach( file => {
    const path = `node_modules/ember-composability-tools/addon/mixins/${file}`
    console.log(`Fixing ember-composability-tools ${file} - tryInvoke deprecation`)
    shelljs.sed('-i', '^import { tryInvoke } from .*$', '', path)
    shelljs.sed('-i', "tryInvoke[(]\([A-z]*\), [']\([A-z]*\)['][)];", "$1.$2?.()", path)
})