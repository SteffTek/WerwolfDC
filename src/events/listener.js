var logger_1 = require("../utils/logger");
var Discord = require('discord.js');
var guild_1 = require("../server/guild");
var conf = require("../utils/config");
var DiscordHandler = (function () {
    function DiscordHandler() {
        var _this = this;
        this.client = new Discord.Client();
        this.isReady = false;
        this.guilds = [];
        this.client.on('ready', function () {
            logger_1.logger.info("Logged in as " + _this.client.user.tag + "!");
            _this.isReady = true;
            //Get Every Server
            _this.client.guilds.forEach((function (value) {
                _this.guilds.push(new guild_1.GuildManager(value));
            }));
        });
        //MESSAGE HANDLER
        this.client.on('message', function (msg) {
            //COMMAND LISTENER
        });
        //BOT JOIN SERVER HANDLER
        this.client.on("guildCreate", function (guild) {
            var gm = new guild_1.GuildManager(guild);
            _this.guilds.push(gm);
            gm.setup();
        });
        this.client.login(conf.getConfig().token);
    }
    Object.defineProperty(DiscordHandler.prototype, "getClient", {
        get: function () {
            return this.client;
        },
        enumerable: true,
        configurable: true
    });
    return DiscordHandler;
})();
exports.DiscordHandler = DiscordHandler;
