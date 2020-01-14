"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Core Modules
var fs = require("fs");
var path = require("path");
// Utils
var logger_1 = require("./logger");
var packagefile = require("../../package.json");
var configPath = path.resolve("config.json");
/**
 * Check if the config is valid JSON
 *
 * @param {*} obj
 * @returns {boolean} whether it is valid JSON
 */
var validJson = function (obj) {
    try {
        JSON.parse(obj);
    }
    catch (e) {
        return false;
    }
    return true;
};
/**
 * Reads out config data
 *
 * @returns {string} JSON Content
 */
exports.getConfig = function () {
    if (!fs.existsSync(configPath)) {
        logger_1.logger.error("Config does not exist! Make sure you copy config.template.json and paste it as 'config.json'. Then configure it.");
        process.exit(1);
    }
    var jsondata = "";
    try {
        jsondata = String(fs.readFileSync(configPath));
    }
    catch (e) {
        logger_1.logger.error("Cannot read config file: " + e);
        process.exit(1);
    }
    if (validJson(jsondata))
        return JSON.parse(jsondata);
    logger_1.logger.error("Config is not valid JSON. Stopping...");
    return process.exit(1);
};
exports.getVersion = function () {
    return packagefile.version;
};
exports.getName = function () {
    return packagefile.name;
};
exports.getAuthor = function () {
    return packagefile.author;
};
exports.getDescription = function () {
    return packagefile.description;
};
//# sourceMappingURL=config.js.map