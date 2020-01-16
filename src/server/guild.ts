import Discord = require('discord.js');
import {Game} from "../game/game";
import {User} from "../game/user";
import {logger} from "../utils/logger";
import conf = require("../utils/config");

export class GuildGameManager {

    guild: Discord.Guild;
    gameInviteChannel: Discord.Channel;
    games: Object;

    constructor(guild: Discord.Guild){
        this.guild = guild;
        this.gameInviteChannel = guild.channels.find("name", conf.getConfig().mainChannel);
        this.games = {};
    }

    createGame(emoji: string, dcLeader: Discord.GuildMember, dcMessage: Discord.Message) {
        for(var i = 1; i < 10000; i++) {
            if(this.games[i] == null){
                this.games[i] = new Game(i, this.guild, emoji, dcLeader, dcMessage);
                return i;
            }
        }
        return -1;
    }

    closeGame(id: number) {
        this.games[id].close();
        delete(this.games[id]);
    }

    //Create Channel
    setup() {
        logger.info("Setting up " + this.guild.name);
        this.guild.createChannel("Werwolf", {type: "category"}).then(cat => {
            this.guild.createChannel("spielankündigung", {type: "text"}).then(chan => {
                chan.setParent(cat.id);
                this.gameInviteChannel = chan;
                logger.done("Server " + this.guild.name + " successfully set up!");
            })
        })
    }
}