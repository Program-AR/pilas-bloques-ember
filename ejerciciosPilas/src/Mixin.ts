/// <reference path = "../node_modules/reflect-metadata/Reflect.d.ts"/>

function mergeWith(mixin: Function): Function {
    return function (target: Function) {
        Object.getOwnPropertyNames(mixin.prototype).forEach(name => mergeProperty(name, mixin, target))
        return target;
    }
}

function mergeProperty(name, mixin, target) {
    if (!target.prototype[name]) {
        target.prototype[name] = mixin.prototype[name]
    }
}