"use strict";
//Req
Object.defineProperty(exports, "__esModule", { value: true });
// Utils
var listener_1 = require("./src/events/listener");
var conf = require("./src/utils/config");
// APP INFO
var version = conf.getVersion();
var appname = conf.getName();
var devname = conf.getAuthor();
//Vars
var discordHandler = new listener_1.DiscordHandler();
//Discord Bot ist logged in
//# sourceMappingURL=index.js.map