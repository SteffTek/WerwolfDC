"use strict";

// Core Modules
import * as fs from 'fs';
import path = require("path");

// Utils
import {logger} from "./logger";

const packagefile = require("../../../package.json");
const configPath  = path.resolve("config.json");

/**
 * Check if the config is valid JSON
 *
 * @param {*} obj
 * @returns {boolean} whether it is valid JSON
 */
let validJson = function(obj){
    try {
        JSON.parse(obj);
    }
    catch (e){
        return false;
    }
    return true;
};

/**
 * Reads out config data
 *
 * @returns {string} JSON Content
 */
export let getConfig = function(){
    if (!fs.existsSync(configPath)){
        logger.error("Config does not exist! Make sure you copy config.template.json and paste it as 'config.json'. Then configure it.");
        process.exit(1);
    }

    let jsondata = "";
    try {
        jsondata = String(fs.readFileSync(configPath));
    }
    catch (e){
        logger.error(`Cannot read config file: ${e}`);
        process.exit(1);
    }

    if (validJson(jsondata)) return JSON.parse(jsondata);

    logger.error("Config is not valid JSON. Stopping...");
    return process.exit(1);
};

export let getVersion = function(){
    return packagefile.version;
};

export let getName = function(){
    return packagefile.name;
};

export let getAuthor = function(){
    return packagefile.author;
};

export let getDescription = function(){
    return packagefile.description;
};