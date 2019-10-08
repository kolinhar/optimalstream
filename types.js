/**
 * check if num is between 1 and 100
 * @param {string|number} num
 * @returns {number}
 */
function oneTo100(num = mandatory()) {
    num = justNumber(num);

    if (num < 1 || num > 100) {
        throw new Error("number must be between 1 and 100");
    }

    return num;
}

/**
 * check if num is a number
 * @param {string|number} num
 * @returns {number}
 */
function justNumber(num = mandatory()) {
    if (isNaN(num)) {
        throw new Error(`${num} is not a number}`);
    }

    return parseFloat(num);
}

function notNegativeNumber(num = mandatory()) {
    num = justNumber(num);

    if (num < 0) {
        throw new Error("num must be a positive number");
    }

    return num;
}

function mandatory() {
    throw new Error(`this field is mandatory`);
}

exports.oneTo100 = oneTo100;
exports.justNumber = justNumber;
exports.mandatory = mandatory;
exports.notNegativeNumber = notNegativeNumber;
