enum STATUS {
    PENDING = "Pending",
    FUlFILLED = "Fulfilled",
    REJECTED = "Rejected",
}
type OnFulfilled<R, U> = (value: R) => U | Thenable<U>;
type OnRejected<U> = (error: any) => U | Thenable<U>;
interface Thenable<R> {
    then<U>(
        onFulfilled?: OnFulfilled<R, U>,
        onRejected?: OnRejected<U>
    ): Thenable<U>;
}

export class Promise<R> implements Thenable<R> {
    private status: STATUS = STATUS.PENDING;
    private result: R = null;

    constructor() {}

    then<U>(
        onFulfilled?: OnFulfilled<R, U>,
        onRejected?: OnRejected<U>
    ): Promise<U> {}
    catch<U>(onRejected?: OnRejected<U>): Promise<U> {}
    finally(onFinally?: () => any | Thenable<any>): Promise<R> {}

    static resolve() {}
    static reject() {}
    static all() {}
    static race() {}
}
