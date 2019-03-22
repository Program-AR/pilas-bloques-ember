/// <reference path = "../node_modules/reflect-metadata/Reflect.d.ts"/>

/*
 * For using Classes as Mixins.
 * Usage: if you want to add M1 to class A
 * Before A class definition use decorator:
 *     @mergeWith(M1)
 * 
 * You can repeat the use of the decorator to merge mutliple mixins:
 * 
 *     @mergeWith(M1)
 *     @mergeWith(M2)
 */

function mergeWith(origin: Function): Function {
    return function (target: Function) {
        Object.getOwnPropertyNames(origin.prototype).forEach(name => mergeProperty(name, origin, target))
        return target;
    }
}

function mergeProperty(name: string, origin: Function, target: Function) {
    if (!target.prototype[name]) {
        target.prototype[name] = origin.prototype[name]
    }
}