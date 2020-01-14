"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger;
(function (logger) {
    /**
     * Formats the current time
     *
     * @returns {string} Time
     */
    var getDate = function () {
        var date = new Date();
        var hourData = date.getHours();
        var minData = date.getMinutes();
        var secData = date.getSeconds();
        var hour = (hourData < 10 ? "0" : "") + hourData;
        var min = (minData < 10 ? "0" : "") + minData;
        var sec = (secData < 10 ? "0" : "") + secData;
        return "[" + hour + ":" + min + ":" + sec + "]";
    };
    function error(input) {
        console.log(" \x1b[41m\x1b[30m x \x1b[0m\x1b[31m [ERROR] " + getDate() + " - " + input + "\x1b[0m");
    }
    logger.error = error;
    function warn(input) {
        console.log(" \x1b[43m\x1b[30m ! \x1b[0m\x1b[33m [WARN]  " + getDate() + " - " + input + "\x1b[0m");
    }
    logger.warn = warn;
    function info(input) {
        console.log(" \x1b[44m\x1b[30m i \x1b[0m\x1b[36m [INFO]  " + getDate() + " - " + input + "\x1b[0m");
    }
    logger.info = info;
    function done(input) {
        console.log(" \x1b[42m\x1b[30m ✓ \x1b[0m\x1b[32m [DONE]  " + getDate() + " - " + input + "\x1b[0m");
    }
    logger.done = done;
})(logger = exports.logger || (exports.logger = {}));
//# sourceMappingURL=logger.js.map