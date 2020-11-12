const STATUS = {
    PENDING: "pending",
    FULFILLED: "fulfulled",
    REJECTED: "rejected",
};

const is = (a) => Object.prototype.toString.call(a) === `[object ${typeStr}]`;

const isFunction = is("Function");

const isObject = is("Object");

const isThePromise = (a) => a instanceof Promise;

class Promise {
    _status = STATUS.PENDING;
    _result = undefined;

    constructor() {}

    then(onFulfilled, onRejected) {
        if (isFunction(onFulfilled)) {
        }

        if (isFunction(onRejected)) {
        }

        return new Promise();
    }

    catch(onRejected) {
        return this.then(undefined, onRejected);
    }

    _resolve(result) {
        if (this._status === STATUS.PENDING) {
            this._status = STATUS.FULFILLED;
            this._result = result;
        }
    }

    _reject(error) {
        if (this._status === STATUS.PENDING) {
            this._status = STATUS.REJECTED;
            this._result = error;
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
                        this._reject(e);
                        return;
                        //Otherwise, reject promise with e as the reason.
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

    static resolve() {}
    static reject() {}
    static all() {}
    static race() {}
}

module.exports = Promise;
