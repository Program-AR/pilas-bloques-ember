/// <reference path = "../node_modules/reflect-metadata/Reflect.d.ts"/>

function mergeWith(origin: Function): Function {
    return function (target: Function) {
        Object.getOwnPropertyNames(origin.prototype).forEach(name => mergeProperty(name, origin, target))
        return target;
    }
}

function mergeProperty(name, origin, target) {
    if (!target.prototype[name]) {
        target.prototype[name] = origin.prototype[name]
    }
}