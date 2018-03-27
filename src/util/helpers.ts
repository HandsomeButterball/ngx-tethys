export function inputValueToBoolean(value: boolean | string): boolean {
    return value === '' || (value && value !== 'false');
}

export function isUndefined(value) {
    return value === undefined;
}

export function isNull(value) {
    return value === null;
}

export function isUndefinedOrNull(value) {
    return isUndefined(value) || isNull(value);
}

function isObjectLike(value) {
    return typeof value == 'object' && value !== null
}

function baseGetTag(value) {

    const objectProto = Object.prototype;
    const hasOwnProperty = objectProto.hasOwnProperty;
    const toString = objectProto.toString;
    const symToStringTag = typeof Symbol !== 'undefined' ? Symbol.toStringTag : undefined;

    if (value == null) {
        return value === undefined ? '[object Undefined]' : '[object Null]';
    }
    if (!(symToStringTag && symToStringTag in Object(value))) {
        return toString.call(value);
    }
    const isOwn = hasOwnProperty.call(value, symToStringTag);
    const tag = value[symToStringTag];
    let unmasked = false;
    try {
        value[symToStringTag] = undefined;
        unmasked = true;
    } catch (e) { }

    const result = toString.call(value);
    if (unmasked) {
        if (isOwn) {
            value[symToStringTag] = tag;
        } else {
            delete value[symToStringTag];
        }
    }
    return result;
}

export function isNumber(value) {
    return typeof value === 'number' ||
        (isObjectLike(value) && baseGetTag(value) === '[object Number]');
}

export function isObject(value) {
    // Avoid a V8 JIT bug in Chrome 19-20.
    // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
    const type = typeof value;
    return !!value && (type === 'object' || type === 'function');
}

export function isFunction(value) {
    const type = typeof value;
    return !!value && type === 'function';
}


export function get(object: any, path: string, defaultValue?: any) {
    let paths = path.split('.')
    let result = object[paths.shift()];
    while (result && paths.length) {
        result = result[paths.shift()];
    }
    return result === undefined ? defaultValue : result;
}


export function set(object: any, path: string, value: any) {
    if (object == null) {
        return object;
    }
    let paths = path.split('.');
    let index = -1;
    let length = paths.length;
    let lastIndex = length - 1;
    let nested = object;
    while (nested !== null && ++index < length) {
        var key = paths[index];
        if (isObject(nested)) {
            if (index === lastIndex) {
                nested[key] = value;
                nested = nested[key];
                break;
            } else {
                if (nested[key] == null) {
                    nested[key] = {};
                }
            }
        }
        nested = nested[key];
    }
    return object;
}