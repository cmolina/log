interface LogFunctionOptions {
    onStart?: (signature: string) => void;
    onEnd?: (signature: string, result: unknown) => void;
    className?: string;
}

const defaultOptions: LogFunctionOptions = { className: '', onStart, onEnd };

export function logFunction(methodOrFn: Function, options?: LogFunctionOptions): Function {
    const { className, onStart, onEnd } = Object.assign({}, defaultOptions, options);

    return new Proxy(methodOrFn, {
        apply(fn, thisArg, argumentsList) {
            const functionName = fn.name;
            const signature = stringifySignature({ argumentsList, className, functionName });
            if (isFunction(onStart)) onStart(signature);

            const output = fn.apply(thisArg, argumentsList);
            if (isFunction(onEnd)) onEnd(signature, output);

            return output;
        }
    })
}

export function loggingMethodsFor<T extends object, U extends keyof T>(instance: T): T {
    return new Proxy(instance, {
        get(target, propertyName) {
            const property = target[propertyName as U] as unknown;

            if (isFunction(property)) {
                const className = target.constructor.name;
                return logFunction(property, { className });
            } else {
                return property;
            }
        }
    })
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
        result.then(output => console.log(`${signature} returns ${output}`));
    } else {
        console.log(`${signature} returns ${result}`);
    }
}

function isFunction(value: any): value is Function {
    return typeof value === "function";
}

function isPromise(value: any): value is Promise<unknown> {
    return value && isFunction(value?.then);
}
