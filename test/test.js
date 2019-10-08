const assert = require('assert');
const {oneTo100, justNumber, mandatory, notNegativeNumber} = require('../types');
const {checkTolerance, testValue, moy} = require("../calcul");

describe("UNIT TEST", function () {
    describe('calcul', () => {
        describe('function moy()', function () {
            it('should return an array', function () {
                assert.deepStrictEqual(moy([{
                        "current_bytes": 8,
                        "calculatedRate": 45.443
                    }, {
                        "current_bytes": 7,
                        "calculatedRate": 1.202
                    }, {
                        "current_bytes": 8,
                        "calculatedRate": 47.191
                    }, {
                        "current_bytes": 7,
                        "calculatedRate": 1.202
                    }, {
                        "current_bytes": 8,
                        "calculatedRate": 46.941
                    }, {
                        "current_bytes": 7,
                        "calculatedRate": 2.404
                    }, {
                        "current_bytes": 8,
                        "calculatedRate": 45.943
                    }, {
                        "current_bytes": 7,
                        "calculatedRate": 1.53
                    }, {
                        "current_bytes": 8,
                        "calculatedRate": 48.564
                    }, {
                        "current_bytes": 7,
                        "calculatedRate": 1.639
                    }]
                ), [{
                    current_bytes: 7,
                    moyRate:1.595
                }, {
                    current_bytes: 8,
                    moyRate:46.816
                }]);
            });
        });

        describe('function checkTolerance()', function () {
            it('should return 0 if result is equal to rate: checkTolerance(4, 1, 4)', function () {
                assert.strictEqual(checkTolerance(4, 1, 4), 0);
            });
            it('should return -1 if result is near from - tolerance: checkTolerance(4, 1, 3)', function () {
                assert.strictEqual(checkTolerance(4, 1, 3), -1);
            });
            it('should return +1 if result is far from + tolerance: checkTolerance(4, 1, 5)', function () {
                assert.strictEqual(checkTolerance(4, 1, 5), 1);
            });
            it('should return -2 if result is out of - tolerance: checkTolerance(4, 1, 2)', function () {
                assert.strictEqual(checkTolerance(4, 1, 2), -2);
            });
            it('should return +2 if result is out of + tolerance: checkTolerance(4, 2, 9)', function () {
                assert.strictEqual(checkTolerance(4, 3, 9), 2);
            });
        });

        describe('function testValue()', function () {
            it('should return the 8: testValue(8,5,9)', function () {
                assert.strictEqual(testValue(8, 5, 9), 8);
            });
            it('should return the 9: testValue(18,8,9)', function () {
                assert.strictEqual(testValue(18, 5, 9), 9);
            });
            it('should return the 9: testValue(9,5,9)', function () {
                assert.strictEqual(testValue(9, 5, 9), 9);
            });
            it('should return the 5: testValue(2,5,9)', function () {
                assert.strictEqual(testValue(2, 5, 9), 5);
            });
            it('should return the 5: testValue(5,5,9)', function () {
                assert.strictEqual(testValue(5, 5, 9), 5);
            });
        });
    });

    describe('Types', function () {
        describe('function notNegativeNumber()', function () {
            it('should throw error if number is lower than 0: -1', function () {
                assert.throws(() => {
                    notNegativeNumber(-1)
                }, new Error("num must be a positive number"));
            });
            it('should throw error if number is lower than 0 even if it is inside a string: "-1"', function () {
                assert.throws(() => {
                    notNegativeNumber("-1")
                }, new Error("num must be a positive number"));
            });
            it('should return the number passed if it is higher than 0', function () {
                assert.strictEqual(notNegativeNumber("25"), 25);
            });
        });
        describe('function mandatory()', function () {
            it('should always throw error with a error message', function () {
                assert.throws(() => {
                    mandatory()
                }, new Error(`this field is mandatory`));
            });
            it('should always throw error with a error message even if there is a parameter', function () {
                assert.throws(() => {
                    mandatory(123)
                }, new Error(`this field is mandatory`));
            });
        });
        describe('function justNumber()', function () {
            it('should throw error if the parameter is not a number: "abc"', function () {
                assert.throws(() => {
                    justNumber("abc")
                })
            });
            it('should return the number passed: "123.42"', function () {
                assert.strictEqual(justNumber("123"), 123);
            });
            it('should return the number passed: 123.42', function () {
                assert.strictEqual(justNumber(123.42), 123.42);
            });
            it('should throw error on BigInt: 10n', function () {
                assert.throws(() => {
                    justNumber(10n)
                });
            });
            it('should throw error when there is no value', function () {
                assert.throws(() => {
                    justNumber()
                }, new Error(`this field is mandatory`));
            });
            it('should return the number passed even if it is inside a string: "123.42"', function () {
                assert.strictEqual(justNumber("123.42"), 123.42);
            });
        });

        describe('function oneTo100()', function () {
            it('should return the number passed when the value is between 1 and 100: 1', function () {
                assert.strictEqual(oneTo100(1), 1);
            });
            it('should return the number passed when the value is between 1 and 100: 100', function () {
                assert.strictEqual(oneTo100(100), 100);
            });
            it('should return the number passed when the value is between 1 and 100: 50', function () {
                assert.strictEqual(oneTo100(50), 50);
            });
            it('should throw error when the value is not between 1 and 100: 0', function () {
                assert.throws(() => {
                    oneTo100(0)
                }, new Error("number must be between 1 and 100"));
            });
            it('should throw error when the value is not between 1 and 100: 101', function () {
                assert.throws(() => {
                    oneTo100(101)
                }, new Error("number must be between 1 and 100"));
            });
            it('should throw error when there is no value', function () {
                assert.throws(() => {
                    oneTo100()
                }, new Error(`this field is mandatory`));
            });
            it('should throw error when value is lower than 0: -5', function () {
                assert.throws(() => {
                    oneTo100(-5)
                }, new Error("number must be between 1 and 100"));
            });
        });
    });
});
