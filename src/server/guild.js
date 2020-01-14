const Discord = require('discord.js');
const Logger = require("../utils/logger");

const Game = require("../game/game").Game;

class GuildManager {

    constructor(guild){
        this.guild = guild;
        this.gameInviteChannel = guild.channels.find("name", "spielankündigungen");
        this.games = {}
    }

    createGame() {
        for(var i = 0; i < 9999; i++) {
            if(this.games[i] == null){
                this.games[i] = new Game(this.guild);
                return;
            }
        }
    }

    //Create Channel
    setup() {
        Logger.info("Setting up " + this.guild.name);
        this.guild.createChannel("Werwolf", {type: "category"}).then(cat => {
            this.guild.createChannel("spielankündigung", {type: "text"}).then(chan => {
                chan.setParent(cat.id);
                this.gameInviteChannel = chan;
                Logger.info("Server " + this.guild.name + " successfully set up!");
            })
        })
    }

}

module.exports = {
    GuildManager: GuildManager
}