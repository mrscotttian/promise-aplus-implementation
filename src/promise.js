const STATUS = {
    PENDING: "pending",
    FULFILLED: "fulfulled",
    REJECTED: "rejected",
};

function isFunction(a) {
    return Object.prototype.toString.call(a) === "[object Function]";
}

class Promise {
    status = STATUS.PENDING;
    result = undefined;

    constructor() {}
    then(onFulfilled, onRejected) {
        if (isFunction(onFulfilled)) {
        }

        if (isFunction(onRejected)) {
        }
    }
    catch(onRejected) {
        return this.then(undefined, onRejected);
    }
    finally() {}
    _resolve(result) {
        if (this.status === STATUS.PENDING) {
            this.status = STATUS.FULFILLED;
            this.result = result;
        }
    }
    _reject(error) {
        if (this.status === STATUS.PENDING) {
            this.status = STATUS.REJECTED;
            this.result = error;
        }
    }
    static resolve() {}
    static reject() {}
    static all() {}
    static race() {}
}

module.exports = Promise;
