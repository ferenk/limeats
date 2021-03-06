export {
    getCurrentMoment, getCurrentTimeStr, printMoment, isNumeric, isError,
    toNumericOrZero, toFixedFloat, printToFixedFloat,
    copyText2Clipboard
};

/**
 * 
 * @param {String} thresholdTime 
 * @returns {import("client/3rdparty/ts/moment").Moment}
 */
function getCurrentMoment(thresholdTime)
{
    // @ts-ignore:next-line (moment undefined)
    moment.locale('hu');

    // Switch to yesterday if needed (based on thresholdTime)
    // @ts-ignore:next-line (moment undefined)
    let currMoment = moment();
    if (currMoment.format('HH:mm') < thresholdTime)
        currMoment.milliseconds(currMoment.milliseconds() - 24 * 60*60 * 1000);

    return currMoment;
}

/**
 * @return string
 */
function getCurrentTimeStr()
{
    let date = new Date();
    date = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    let currentTimeStr = date.toISOString().slice(11, 16);
    return currentTimeStr;
}

/**
 * 
 * @param {import("client/3rdparty/ts/moment").Moment} currMoment 
 * @returns 
 */
function printMoment(currMoment)
{
     // Field: WeekdaysMin
    // @ts-ignore:next-line (moment undefined)
    let weekDayMin = moment.localeData().weekdaysMin(currMoment);
    weekDayMin = weekDayMin.charAt(0).toUpperCase() + weekDayMin.slice(1);

    // Result
    return `${currMoment.format('YYYY-MM-DD')}.${weekDayMin}`;
}

/**
 * Check a string if it contains only numbers
 * @param {String} str 
 * @returns boolean
 */
function isNumeric(str) {
    if (typeof str != "string")
        return false;
    return !isNaN(Number(str)) && !isNaN(parseFloat(str));
}

/**
 * 
 * @param {String | Number} str 
 * @returns {Number}
 */
function toNumericOrZero(str)
{
    try {
        let retVal = toFixedFloat(str);
        if (isNaN(retVal))
            retVal = 0;
        return retVal;
    }
    catch {
        return 0;
    }
}

/**
 * 
 * @param {Number | String} num 
 * @param {Number} decimals 
 * @returns {Number}
 */
function toFixedFloat(num = 0, decimals = 1) {
    /** @type {Number} */
    let realNum;
    if (typeof (num) == 'string')
        realNum = parseFloat(num);
    else
        realNum = num;
    let decimalPower = Math.pow(10, decimals);
    //debug console.log(`decimalPower: ${decimalPower}`);
    return Math.round(realNum * decimalPower) / decimalPower;
}

/**
 * 
 * @param {Number} num 
 * @param {Number} decimals 
 * @param {boolean} padDecimals 
 * @returns 
 */
function printToFixedFloat(num, decimals, padDecimals) {
    if (decimals == null)
        decimals = 0;
    let numStr = toFixedFloat(num, decimals).toString();
    if (padDecimals == true) {
        let decimalPointPos = numStr.search('\\.');
        let paddingNeeded = (decimalPointPos >= 0 ? (numStr.length - decimalPointPos - 1) - decimals : decimals + 1);
        //debug console.log(`numStr: ${numStr}, decimals: ${decimals}, paddingNeeded: ${paddingNeeded}, decimalpointpos: ${decimalPointPos}`);
        numStr += ' '.repeat(paddingNeeded);
    }
    return numStr;
}

/**
 * Detect if the given object is an error
 * @param {Object | Error} e 
 * @returns true if the object is an Error
 */
let isError = function (e)
{
    return e && e instanceof Error && e.stack != null && e.message != null &&
        typeof e.stack === 'string' && typeof e.message === 'string';
}

/**
 * Copies a string to the clipboard
 * It uses the execCommand() method, because writeText works only on localhost
 * @param {String} text The string to copy
 */
function copyText2Clipboard(text)
{
    $('#txtCopyHelper').val(text);
    $('#txtCopyHelper').show();
    // @ts-ignore:next-line (HTMLElement.select is not assignable)
    $('#txtCopyHelper')[0].select();
    let retVal = document.execCommand('copy');
    $('#txtCopyHelper').hide();
    return retVal;
}

