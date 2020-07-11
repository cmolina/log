const defaultOptions = { onStart, onEnd };

export function log<T extends Function | object>(fnOrInstance: T, options?: LogOptions): T {
    const sanitizedOptions = Object.assign({}, defaultOptions, options);

    if (isFunction(fnOrInstance)) {
        return logFunction(fnOrInstance, sanitizedOptions);
    }
    return loggingMethodsFor(fnOrInstance, sanitizedOptions);
}

function logFunction<T extends Function>(methodOrFn: T, options: LogFunctionOptions): T {
    const { className, onStart, onEnd } = options;

    return new Proxy(methodOrFn, {
        apply(fn, thisArg, argumentsList) {
            const functionName = options.functionName || fn.name;
            const signature = stringifySignature({ argumentsList, className, functionName });
            if (isFunction(onStart)) onStart(signature);

            const output = fn.apply(thisArg, argumentsList);
            if (isFunction(onEnd)) onEnd(signature, output);

            return output;
        }
    })
}

function loggingMethodsFor<T extends object, U extends keyof T>(instance: T, options: LogFunctionOptions): T {
    const className = instance.constructor.name;

    return new Proxy(instance, {
        get(target, propertyName) {
            const property = target[propertyName as U];

            if (isFunction(property)) {
                options = Object.assign({}, options, { className, functionName: propertyName });
                return logFunction(property, options);
            }
            return property;
        }
    });
}

function stringifySignature(args: { className?: string, functionName: string, argumentsList: any[] }): string {
    const concatenatedArguments = Array.from(args.argumentsList).join(', ');
    const functionPrefix = args.className ? args.className + '.' : '';
    return `${functionPrefix}${args.functionName}(${concatenatedArguments})`;
}

function onStart(signature: string): void {
    console.log(`${signature} started`);
}

function onEnd(signature: string, result: unknown): void {
    if (isPromise(result)) {
        result.then(output => console.log(`${signature} returned ${output}`));
    } else {
        console.log(`${signature} returned ${result}`);
    }
}

interface LogOptions {
    onStart?: (signature: string) => void;
    onEnd?: (signature: string, result: unknown) => void;
}

interface LogFunctionOptions extends LogOptions {
    functionName?: string;
    className?: string;
}

function isFunction(value: any): value is Function {
    return typeof value === "function";
}

function isPromise(value: any): value is Promise<unknown> {
    return value && isFunction(value?.then);
}
