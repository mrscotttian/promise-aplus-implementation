import Promise from '../src/promise'

describe('A promise must be in one of three states: pending, fulfilled, or rejected', () => {
    describe('When pending, a promise', () => {
        describe('may transition to either the fulfilled or rejected state', () => {

        });
    });
    describe('When fulfilled, a promise', () => {
        describe('must not transition to any other state', () => {

        });
        describe('must have a value, which must not change', () => {

        });
    });
    describe('When rejected, a promise', () => {
        describe('must not transition to any other state', () => {

        });
        describe('must have a reason, which must not change', () => {

        });
    });
});