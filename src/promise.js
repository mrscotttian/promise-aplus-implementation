const STATUS = {
    PENDING: "pending",
    FULFILLED: "fulfulled",
    REJECTED: "rejected",
};

const is = (typeStr) => (a) =>
    Object.prototype.toString.call(a) === `[object ${typeStr}]`;

const isFunction = is("Function");

const isObject = is("Object");

const isThePromise = (a) => a instanceof Promise;

const nextTick = (task) => {
    setTimeout(task, 0);
};

class Queue {
    arr = [];

    isEmpty() {
        return !this.arr.length;
    }

    enqueue(a) {
        this.arr.push(a);
    }

    dequeue() {
        return this.arr.shift();
    }
}

class Promise {
    _status = STATUS.PENDING;
    _result = undefined;
    // If/when promise is fulfilled, all respective onFulfilled callbacks must execute in the order of their originating calls to then.
    _onFulfillQueue = new Queue();
    // If/when promise is rejected, all respective onRejected callbacks must execute in the order of their originating calls to then.
    _onRejectedQueue = new Queue();

    constructor(fn) {
        if (!isFunction(fn)) throw new TypeError();

        try {
            fn(this._resolve.bind(this), this._reject.bind(this));
        } catch (e) {
            this._reject(e);
        }
    }

    then(onFulfilled, onRejected) {
        // Both onFulfilled and onRejected are optional arguments:
        let result;
        let reason;

        if (isFunction(onFulfilled)) {
            // If onFulfilled is a function:
            // it must be called after promise is fulfilled, with promise’s value as its first argument.
            // it must not be called before promise is fulfilled.
            // it must not be called more than once.
            this._onFulfillQueue.enqueue((x) => {
                try {
                    result = onFulfilled(x);
                } catch (e) {
                    reason = e;
                }
            });
        } else {
            // If onFulfilled is not a function, it must be ignored.
        }

        if (isFunction(onRejected)) {
            // If onRejected is a function,
            // it must be called after promise is rejected, with promise’s reason as its first argument.
            // it must not be called before promise is rejected.
            // it must not be called more than once.
            this._onRejectedQueue.enqueue((r) => {
                try {
                    result = onRejected(r);
                } catch (e) {
                    reason = e;
                }
            });
        } else {
            // If onRejected is not a function, it must be ignored.
        }

        // onFulfilled or onRejected must not be called until the execution context stack contains only platform code. [3.1].
        // onFulfilled and onRejected must be called as functions (i.e. with no this value). [3.2]
        // then may be called multiple times on the same promise.
        // then must return a promise [3.3].
        // promise2 = promise1.then(onFulfilled, onRejected);
        // If either onFulfilled or onRejected returns a value x, run the Promise Resolution Procedure [[Resolve]](promise2, x).
        // If either onFulfilled or onRejected throws an exception e, promise2 must be rejected with e as the reason.

        // If onFulfilled is not a function and promise1 is fulfilled, promise2 must be fulfilled with the same value as promise1.
        // If onRejected is not a function and promise1 is rejected, promise2 must be rejected with the same reason as promise1.

        const promise2 = new Promise((resolve, reject) => {
            if (isFunction(onFulfilled)) {
                promise2._resolutionProcedure(result);
            } else {
                resolve(this._getResult);
            }

            if (isFunction(onRejected)) {
                reject(reason);
            } else {
                reject(this._getResult);
            }
        });

        return promise2;
    }

    catch(onRejected) {
        return this.then(undefined, onRejected);
    }

    _resolve(result) {
        if (this._status === STATUS.PENDING) {
            this._status = STATUS.FULFILLED;
            this._result = result;
            while (!this._onFulfillQueue.isEmpty()) {
                const task = this._onFulfillQueue.dequeue();
                nextTick(() => {
                    task.call(null, this._getResult());
                });
            }
        }
    }

    _reject(error) {
        if (this._status === STATUS.PENDING) {
            this._status = STATUS.REJECTED;
            this._result = error;

            while (!this._onRejectedQueue.isEmpty()) {
                const task = this._onRejectedQueue.dequeue();
                nextTick(() => {
                    task.call(null, this._getResult());
                });
            }
        }
    }

    _getStatus() {
        return this._status;
    }

    _getResult() {
        return this._result;
    }

    _resolutionProcedure(x) {
        // If promise and x refer to the same object, reject promise with a TypeError as the reason.
        if (this === x) {
            this._reject(
                "TypeError: The result and the promise cannot be the same"
            );
            return;
        }

        if (isThePromise(x)) {
            // If x is a promise, adopt its state:
            if (x._getStatus() === STATUS.PENDING) {
                //If x is pending, promise must remain pending until x is fulfilled or rejected.
                x.then(
                    (y) => this._resolve(y),
                    (r) => this._reject(r)
                );
            }

            if (x._getStatus() === STATUS.FULFILLED) {
                //If/when x is fulfilled, fulfill promise with the same value.
                this._resolve(x._getResult());
            }

            if (x._getStatus() === STATUS.REJECTED) {
                //If/when x is rejected, reject promise with the same reason.
                this._reject(x._getResult());
            }
        } else if (isObject(x) || isFunction(x)) {
            //Otherwise, if x is an object or function,
            //Let then be x.then.
            let then;

            try {
                then = x.then;
            } catch (e) {
                //If retrieving the property x.then results in a thrown exception e, reject promise with e as the reason.
                this._reject(e);
                return;
            }

            if (isFunction(then)) {
                //If then is a function, call it with x as this, first argument resolvePromise, and second argument rejectPromise, where:
                const {
                    resolvePromise,
                    rejectPromise,
                    isEitherCalled,
                } = () => {
                    let _hasCalled = false;
                    const preventMultiCall = (fn) => (result) => {
                        //If both resolvePromise and rejectPromise are called, or multiple calls to the same argument are made, the first call takes precedence, and any further calls are ignored.
                        if (!_hasCalled) {
                            _hasCalled = true;
                            fn(result);
                        }
                    };
                    const resolvePromise = preventMultiCall((y) => {
                        //If/when resolvePromise is called with a value y, run [[Resolve]](promise, y).
                        this._resolutionProcedure(y);
                    });
                    const rejectPromise = preventMultiCall((r) => {
                        //If/when rejectPromise is called with a reason r, reject promise with r.
                        this._reject(r);
                    });

                    const isEitherCalled = () => hasCalled;
                    return { resolvePromise, rejectPromise, isEitherCalled };
                };

                try {
                    then.call(x, resolvePromise, rejectPromise);
                } catch (e) {
                    //If calling then throws an exception e,
                    //If resolvePromise or rejectPromise have been called, ignore it.
                    if (!isEitherCalled()) {
                        //Otherwise, reject promise with e as the reason.
                        this._reject(e);
                    }
                }
            } else {
                //If then is not a function, fulfill promise with x.
                this._resolve(x);
            }
        } else {
            // If x is not an object or function, fulfill promise with x.
            this._resolve(x);
        }
    }

    static resolve(x) {
        return new Promise((resolve) => {
            resolve(x);
        });
    }

    static reject(r) {
        return new Promise((_, reject) => {
            reject(r);
        });
    }

    static all() {}
    static race() {}
}

module.exports = Promise;
