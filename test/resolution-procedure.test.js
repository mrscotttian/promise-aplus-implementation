import Promise from "../src/promise";

describe("To run [[Resolve]](promise, x), perform the following step", () => {
    describe("If promise and x refer to the same object", () => {
        test("reject promise with a TypeError as the reason", () => {});
    });
    describe("If x is a promise, adopt its state", () => {
        test("If x is pending, promise must remain pending until x is fulfilled or rejected", () => {});
        test("If/when x is fulfilled, fulfill promise with the same value", () => {});
        test("If/when x is rejected, reject promise with the same reason", () => {});
    });
    describe("Otherwise, if x is an object or function. Let then be x.then", () => {
        test("If retrieving the property x.then results in a thrown exception e, reject promise with e as the reason", () => {});
        describe("If then is a function, call it with x as this, first argument resolvePromise, and second argument rejectPromise, where:", () => {
            test("If/when resolvePromise is called with a value y, run [[Resolve]](promise, y)", () => {});
            test("If/when rejectPromise is called with a reason r, reject promise with r", () => {});
            test("If both resolvePromise and rejectPromise are called, or multiple calls to the same argument are made, the first call takes precedence, and any further calls are ignored", () => {});
            describe("If calling then throws an exception e", () => {
                test("If resolvePromise or rejectPromise have been called, ignore it", () => {});
                test("Otherwise, reject promise with e as the reason", () => {});
            });
        });
        test("If then is not a function, fulfill promise with x", () => {});
    });
    describe("If x is not an object or function, fulfill promise with x", () => {});
});
