const Logger = require("../utils/logger");
const GuildManager = require("../server/guild").GuildManager;
const Discord = require('discord.js');
let conf = require("../utils/config");

class DiscordHandler {

    constructor(){

        this.client = new Discord.Client();
        this.isReady = false;

        this.guilds = [];

        this.client.on('ready', () => {
            Logger.info(`Logged in as ${this.client.user.tag}!`);

            this.isReady = true;

            //Get Every Server
            for(var guild in this.client.guilds){
                this.guilds.push(new GuildManager(guild));
            }
        });

        //MESSAGE HANDLER
        this.client.on('message', msg => {

            //COMMAND LISTENER

        });

        //BOT JOIN SERVER HANDLER
        this.client.on("guildCreate", guild => {
            var gm = new GuildManager(guild);
            this.guilds.push(gm);
            gm.setup();
        });

        this.client.login(conf.getConfig().token);

    }

    get getClient(){
        return this.client;
    }
}

module.exports = {
    DiscordHandler: DiscordHandler
}