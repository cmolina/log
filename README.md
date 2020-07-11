# @cmolina/log
Keep track for when functions are being called and when they returned.

## Quickstart

Install the dependency

```sh
npm i -D @cmolina/log
```

Log your functions

```typescript
import { log } from '@cmolina/log';
import { myFunction } from './some-local-module';

// 1. wrap your function
const myFunctionWithLogs = log(myFunction);

// 2. use your wrapped function as expected
myFunctionWithLogs('pass', 'the', 'original', 'parameters');

// 3. see the logs in your console!
/*
    myFunction('pass', 'the', 'original', 'parameters') started
    myFunction('pass', 'the', 'original', 'parameters') returned '😁'
*/
```

Log your methods

```typescript
import { log } from '@cmolina/log';
import { MyClass } from './some-local-module';

const myInstance = new MyClass();

// 1. wrap your instance
const myInstanceWithLogs = log(myInstance);

// 2. use your wrapped method as expected
myInstanceWithLogs.myMethod('pass', 'the', 'original', 'parameters');

// 3. see the logs in your console!
/*
    MyClass.myMethod('pass', 'the', 'original', 'parameters') started
    MyClass.myMethod('pass', 'the', 'original', 'parameters') returned '😲'
*/
```
