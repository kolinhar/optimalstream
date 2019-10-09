const {createReadStream, createWriteStream, access} = require("fs");
const fs = require("fs");
const {octets, TEST_FILE_PATH, TEST_FILE_COPY_PATH, defaultHighWaterMark} = require("../constants");
const {oneTo100, notNegativeNumber} = require("../types");

function createTestFile() {
    return new Promise((resolve, reject) => {
        const wf = createWriteStream(TEST_FILE_PATH, {highWaterMark: octets * defaultHighWaterMark});
        wf.on("finish", () => {
            console.log(`file ${TEST_FILE_PATH} created and ready`.bgGreen.black);
            resolve();
        });
        wf.on("error", err => {
            console.log(`error: ${err}`.red);
        });
        let str = "";
        // create a 65536 string characters
        for (let i = 0; i < 65536; i++) {
            str += "A";
        }

        //create a text file of 100 chunks
        for (let i = 0; i < 100; i++) {
            wf.write(str);
        }
        wf.close();
    });
}


/**
 *
 * @param {string[]} pathArray
 */
function deleteTestFiles(pathArray) {
    let cpt = 0;
    return new Promise((resolve, reject) => {
        pathArray.forEach(val => {
            testFile(val)
                .then(() => {
                    fs.unlink(val, err => {
                        if (err) {
                            console.log(`cannot delete file ${val}, ${err.name}: ${err.message}`.yellow.bold);
                            reject();
                        } else {
                            console.log(`file ${val} deleted`.cyan);
                        }
                    });
                })
                .catch(err => {
                    console.log(`error ${err.name}: ${err.message}`);
                })
                .finally(() => {
                    cpt++;

                    if (cpt === pathArray.length) {
                        resolve();
                    }
                });
        });
    });
}

/**
 *
 * @param {number} rate
 * @param {number} tolerance
 * @param {number} byte
 * @returns {Promise}
 */
function testHighWaterMark(rate, tolerance, byte = 64) {
    return new Promise((resolve, reject) => {
        testFile(TEST_FILE_PATH).then(() => {
            rate = oneTo100(rate);
            tolerance = oneTo100(tolerance);
            byte = notNegativeNumber(byte);

            let cptDrain = 0;
            let cptTot = 0;
            let calculatedRate = 0;

            const rf = createReadStream(TEST_FILE_PATH, {highWaterMark: octets * byte});
            const wf = createWriteStream(TEST_FILE_COPY_PATH);

            wf.on("drain", () => {
                cptDrain++;
                rf.resume();
            });

            rf.on("close", () => {
                calculatedRate = ((cptDrain / cptTot) * 100).toFixed(3);
                wf.close();
            });

            wf.on("finish", () => {
                console.log(`calculated rate:${calculatedRate}%`.green.underline);
                resolve(calculatedRate)
            });

            rf.on("data", chunk => {
                const isReadyToWriteMoreDatas = wf.write(chunk);
                cptTot++;

                if (!isReadyToWriteMoreDatas) {
                    rf.pause();
                }
            });

            rf.on("error", reject);
            wf.on("error", reject);
        });
    });
}

function testFile(filePath) {
    return new Promise((resolve, reject) => {
        access(filePath, err => {
            if (err) {
                console.log(`file ${filePath} does not exist`.yellow.bold);
            }
            resolve()
        });
    });
}

exports.createTestFile = createTestFile;
exports.testHighWaterMark = testHighWaterMark;
exports.deleteTestFiles = deleteTestFiles;
