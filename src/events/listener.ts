import {logger} from "../utils/logger";
import Discord = require('discord.js');
import {GuildManager} from "../server/guild";
import conf = require("../utils/config");

export class DiscordHandler {

    client: Discord.Client;
    isReady: boolean;
    guilds: Array<GuildManager>;

    constructor(){
        this.client = new Discord.Client();
        this.isReady = false;

        this.guilds = [];

        this.client.on('ready', () => {
            logger.info(`Logged in as ${this.client.user.tag}!`);

            this.isReady = true;

            //Get Every Server
            this.client.guilds.forEach( (value => {
                this.guilds.push(new GuildManager(value));
            }))
        });

        //MESSAGE HANDLER
        this.client.on('message', msg => {
            //COMMAND LISTENER

        });

        //BOT JOIN SERVER HANDLER
        this.client.on("guildCreate", guild => {
            let gm: GuildManager = new GuildManager(guild);
            this.guilds.push(gm);
            gm.setup();
        });

        this.client.login(conf.getConfig().token);

    }

    get getClient(){
        return this.client;
    }
}