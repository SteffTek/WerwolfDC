"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = require("../game/game");
var logger_1 = require("../utils/logger");
var GuildManager = /** @class */ (function () {
    function GuildManager(guild) {
        this.guild = guild;
        this.gameInviteChannel = guild.channels.find("name", "spielankündigungen");
        this.games = {};
    }
    GuildManager.prototype.createGame = function (emoji, leader) {
        for (var i = 0; i < 9999; i++) {
            if (this.games[i] == null) {
                this.games[i] = new game_1.Game(i, this.guild, emoji, leader);
                return;
            }
        }
    };
    //Create Channel
    GuildManager.prototype.setup = function () {
        var _this = this;
        logger_1.logger.info("Setting up " + this.guild.name);
        this.guild.createChannel("Werwolf", { type: "category" }).then(function (cat) {
            _this.guild.createChannel("spielankündigung", { type: "text" }).then(function (chan) {
                chan.setParent(cat.id);
                _this.gameInviteChannel = chan;
                logger_1.logger.done("Server " + _this.guild.name + " successfully set up!");
            });
        });
    };
    return GuildManager;
}());
exports.GuildManager = GuildManager;
//# sourceMappingURL=guild.js.map