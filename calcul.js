const {justNumber, oneTo100} = require("./types");

/**
 *
 * @param {number} rate
 * @param {number} tolerance
 * @param {number} calculatedRate
 * @returns {number}
 */
function checkTolerance(rate, tolerance, calculatedRate) {
    rate = oneTo100(rate);
    tolerance = justNumber(tolerance);
    calculatedRate = justNumber(calculatedRate);

    let calculatedGap = null;
    let result = null;
    let sign = null;

    if (rate > calculatedRate) {
        calculatedGap = rate - calculatedRate;
        sign = -1;
    }

    if (rate < calculatedRate) {
        calculatedGap = calculatedRate - rate;
        sign = 1;
    }

    if (calculatedGap <= tolerance) {
        result = 1 * sign;
    } else if (calculatedGap > tolerance) {
        result = 2 * sign;
    }

    if (rate === calculatedRate) {
        result = 0;
    }

    return result;
}

/**
 * return value if between min and max, if not
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function testValue(value, min, max) {
    if (value >= min && value <= max)
        return value;

    if (value < min)
        return min;

    if (value > max)
        return max;
}

function moy(valueTab) {
    let ValueObj = {};
    let result = [];

    valueTab.forEach(val => {
        if (!ValueObj[val.current_bytes]) {
            ValueObj[val.current_bytes] = [];
        }

        ValueObj[val.current_bytes].push(val.calculatedRate)
    });

    for (let elt in ValueObj) {
        result.push({
            current_bytes: parseInt(elt, 10),
            moyRate: parseFloat((ValueObj[elt].reduce((acc, value) => acc + parseFloat(value), 0) / ValueObj[elt].length).toFixed(3))
        });
    }

    return result.sort(function (a, b) {
        if (a.current_bytes > b.current_bytes)
            return 1;

        if (a.current_bytes < b.current_bytes)
            return -1;

        if (a.current_bytes === b.current_bytes)
            return 0;
    });
}

exports.checkTolerance = checkTolerance;
exports.testValue = testValue;
exports.moy = moy;
