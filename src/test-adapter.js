const Promise = require("./promise");

function deffered() {
    const promise = new Promise();
    return {
        promise,
        reject: promise._reject,
        resolve: promise._resolve,
    };
}
function rejected(error) {
    const promise = new Promise();
    return promise._reject(error);
}
function resolved(result) {
    const promise = new Promise();
    return promise._resolve(result);
}

module.exports = {
    deffered,
    rejected,
    resolved,
};
