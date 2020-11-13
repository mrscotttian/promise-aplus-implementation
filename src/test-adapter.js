const Promise = require("./promise");

const deferred = () => {
    const promise = new Promise(() => {});
    return {
        promise,
        reject: promise._reject,
        resolve: promise._resolve,
    };
};
const rejected = (error) => {
    return Promise.reject(error);
};
const resolved = (result) => {
    return Promise.resolve(result);
};

module.exports = {
    deferred,
    rejected,
    resolved,
};
