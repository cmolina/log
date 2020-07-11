import { expect, use, spy } from 'chai';
import spies from 'chai-spies';
import { logFunction } from '../src/index';

use(spies);

describe('logFunction', () => {
    const sumFn = (a: number, b: number) => a + b;
    let logSpy: ChaiSpies.SpyFunc0Proxy<void>;

    beforeEach(() => {
        logSpy = spy.on(console, 'log', () => {});
    });

    afterEach(() => {
        spy.restore(console);
    });

    it('should log default values', () => {
        const sumFnLogged = logFunction(sumFn);
        sumFnLogged(1, 2);

        expect(logSpy).to.have.been.called.with('sumFn(1, 2) started');
        expect(logSpy).to.have.been.called.with('sumFn(1, 2) returns 3');
    });

    it('should run custom onStart function', () => {
        const onStart = spy();

        const sumFnLogged = logFunction(sumFn, { onStart });
        sumFnLogged(1, 2);

        expect(onStart, 'receives function signature').to.have.been.called.with('sumFn(1, 2)');
    });

    it('should run custom onEnd function', () => {
        const onEnd = spy();

        const sumFnLogged = logFunction(sumFn, { onEnd });
        sumFnLogged(1, 2);

        expect(onEnd, 'receives function signature and return value').to.have.been.called.with('sumFn(1, 2)', 3);
    });
});
