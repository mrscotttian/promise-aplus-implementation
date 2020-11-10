import Promise from "../src/promise";

describe("A promise’s then method accepts two arguments", () => {
    describe("Both onFulfilled and onRejected are optional arguments", () => {
        test("If onFulfilled is not a function, it must be ignored", () => {
            Promise.
        });
        test("If onRejected is not a function, it must be ignored", () => {});
    });
    describe("If onFulfilled is a function", () => {
        test("it must be called after promise is fulfilled, with promise’s value as its first argument", () => {});
        test("it must not be called before promise is fulfilled", () => {});
        test("it must not be called more than once", () => {});
    });
    describe("If onRejected is a function", () => {
        test("it must be called after promise is rejected, with promise’s reason as its first argument", () => {});
        test("it must not be called before promise is rejected", () => {});
        test("it must not be called more than once", () => {});
    });
    describe("onFulfilled or onRejected must not be called until the execution context stack contains only platform code.", () => {});
    describe("onFulfilled and onRejected must be called as functions (i.e. with no this value)", () => {});
    describe("then may be called multiple times on the same promise", () => {
        test("If/when promise is fulfilled, all respective onFulfilled callbacks must execute in the order of their originating calls to then", () => {});
        test("If/when promise is rejected, all respective onRejected callbacks must execute in the order of their originating calls to then", () => {});
    });
    describe("then must return a promise", () => {
        test("If either onFulfilled or onRejected returns a value x, run the Promise Resolution Procedure [[Resolve]](promise2, x)", () => {});
        test("If either onFulfilled or onRejected throws an exception e, promise2 must be rejected with e as the reason", () => {});
        test("If onFulfilled is not a function and promise1 is fulfilled, promise2 must be fulfilled with the same value as promise1", () => {});
        test("If onRejected is not a function and promise1 is rejected, promise2 must be rejected with the same reason as promise", () => {});
    });
});
