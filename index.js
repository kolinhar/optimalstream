const colors = require('colors');
const {octets, TEST_FILE_PATH, TEST_FILE_COPY_PATH} = require("./constants");
const {checkTolerance, moy, testValue} = require("./calcul");
const {EventEmitter} = require("events");
const {createTestFile, testHighWaterMark, deleteTestFiles} = require('./fileTestGenerator/fileCreator');

// console.clear();
createTestFile();

const MAX_LOOP_AT_SAME_BYTE = 10;

const rate = 40;
const tolerance = 10;

let max_bytes = 64;
let min_bytes = 1;
let old_min_bytes = 64;
let old_max_bytes = 1;
let current_bytes = 64;
let loop_at_same_bytes = 0;
let props = [];


const Cycle = new EventEmitter();
Cycle.on("done", hwm => {
    //the rate is reached, then
    //store the highWaterMark somewhere...
    console.log(`Best highWaterMark founded: ${hwm} * ${octets}`.bold.green);
    deleteTestFiles([TEST_FILE_PATH, TEST_FILE_COPY_PATH]);
});
Cycle.on("abort", () => {
    //the rate can't be reached with this tolerance
    // console.log("/!\\ the rate you choose can't be reached with this tolerance /!\\".bold.red.underline);
    console.log(`optimal highWaterMark seems to be between ${min_bytes} and ${max_bytes}`);
    console.table(props);
    //calc moyenne
    const moyenne = moy(props);
    // console.table(moyenne);
    console.table(moyenne.map(val=>{
        const v = checkTolerance(rate, tolerance, val.moyRate);
        val.label = (v === -1 || v === 1) ? 'recommended' : 'out of range';
        return val;
    }));
    deleteTestFiles([TEST_FILE_PATH, TEST_FILE_COPY_PATH]);
});
Cycle.on("ready", () => {
    //ready to begin a new test
    console.log("test is beginning\n-------------------------------------------------------------------------".blue);
    console.log(`rate and tolerance desired: ${rate}% ±${tolerance} `);
    Cycle.emit("next");
});
Cycle.on("next", () => {
    console.log(`current_bytes: ${current_bytes}, min_bytes: ${min_bytes}, max_bytes: ${max_bytes}, loop_at_same_bytes: ${loop_at_same_bytes}`);

    if (loop_at_same_bytes >= MAX_LOOP_AT_SAME_BYTE) {
        return Cycle.emit("abort");
    }

    if (min_bytes === max_bytes){
        return Cycle.emit("done", max_bytes);
    }

    //ready to begin a new iteration of highWaterMark
    testHighWaterMark(rate, tolerance, current_bytes)
        .then(calculatedRate => {
            if (min_bytes === old_min_bytes && max_bytes === old_max_bytes) {
                loop_at_same_bytes++;
                props.push({
                    current_bytes,
                    calculatedRate: parseFloat(calculatedRate)
                });
            } else {
                loop_at_same_bytes = 0;
                props = [];
            }

            switch (checkTolerance(rate, tolerance, calculatedRate)) {
                case -2:
                    old_min_bytes = min_bytes = current_bytes;
                    current_bytes = testValue(current_bytes + (max_bytes - current_bytes), min_bytes, max_bytes);
                    break;
                case -1:
                    old_min_bytes = min_bytes = current_bytes;
                    current_bytes = testValue(current_bytes + 1, min_bytes, max_bytes);
                    break;
                case 0:
                    //find
                    return Cycle.emit("done", calculatedRate);
                case 1:
                    old_max_bytes = max_bytes = current_bytes;
                    current_bytes = testValue(current_bytes - 1, min_bytes, max_bytes);
                    break;
                case 2:
                    old_max_bytes = max_bytes = current_bytes;
                    current_bytes = testValue(current_bytes / 2, min_bytes, max_bytes);
                    break;
            }

            Cycle.emit("next");
        });
});


createTestFile().then(() => {
    console.log("ready to test!");
    Cycle.emit("ready");
}).catch(err => {
    console.log(err);
});
