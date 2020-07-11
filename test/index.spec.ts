import { expect, use, spy } from 'chai';
import spies from 'chai-spies';
import { log } from '../src/index';

use(spies);

const sumFn = (a: number, b: number) => a + b;
class MyClass {
    myMethod(a: number, b: number) {
        return b - a;
    }
}
describe('log', () => {
    let logSpy: ChaiSpies.SpyFunc0Proxy<void>;

    // comment these two lines to see the logs back in the terminal
    beforeEach(() => logSpy = spy.on(console, 'log', () => {}));
    afterEach(() => spy.restore(console));

    it('should log for functions', () => {
        const sumFnWithLogs = log(sumFn);
        const result = sumFnWithLogs(1, 2);

        expect(logSpy).to.have.been.called.with('sumFn(1, 2) started');
        expect(logSpy).to.have.been.called.with('sumFn(1, 2) returned 3');
        expect(result).to.equal(3);
    });

    it('should log for instances', () => {
        const instance = new MyClass();
        const instanceWithLogs = log(instance);
        const result = instanceWithLogs.myMethod(1, 2);

        expect(logSpy).to.have.been.called.with('MyClass.myMethod(1, 2) started');
        expect(logSpy).to.have.been.called.with('MyClass.myMethod(1, 2) returned 1');
        expect(result).to.equal(1);
    });

    it('should run custom onStart function', () => {
        const onStart = (signature: string) => console.log(`🛫 ${signature}`);

        const sumFnWithLogs = log(sumFn, { onStart });
        sumFnWithLogs(1, 2);

        expect(logSpy).to.have.been.called.with('🛫 sumFn(1, 2)');
    });

    it('should run custom onEnd function', () => {
        const onEnd = (signature: string, result: unknown) => console.log(`🛬 ${signature} = ${result}`);

        const sumFnWithLogs = log(sumFn, { onEnd });
        sumFnWithLogs(1, 2);

        expect(logSpy).to.have.been.called.with('🛬 sumFn(1, 2) = 3');
    });
});
