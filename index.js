//Req
let DiscordHandler = require("./src/events/listener").DiscordHandler;

// Utils
let conf = require("./src/utils/config");

// APP INFO
let version = conf.getVersion();
let appname = conf.getName();
let devname = conf.getAuthor();

//Vars
var discordHandler = new DiscordHandler();

//Discord Bot ist logged in