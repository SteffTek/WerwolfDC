//Req

// Utils
import {DiscordHandler} from "./src/events/listener";

import conf = require("./src/utils/config");

// APP INFO
let version = conf.getVersion();
let appname = conf.getName();
let devname = conf.getAuthor();

//Vars
let discordHandler = new DiscordHandler();

//Discord Bot ist logged in