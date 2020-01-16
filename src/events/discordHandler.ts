import {logger} from "../utils/logger";
import {GuildGameManager} from "../server/guild";
import conf = require("../utils/config");

import {MainIndex} from "../../index";
import {stringutils} from "../utils/stringutils";

export class DiscordHandler {

    isReady: boolean;

    constructor() {
        this.isReady = false;

        MainIndex.instance.discordClient.on('ready', () => {
            logger.info(`Logged in as ${MainIndex.instance.discordClient.user.tag}!`);

            this.isReady = true;

            //Get Every Server
            MainIndex.instance.discordClient.guilds.forEach((value => {
                MainIndex.instance.guildGameManager.push(new GuildGameManager(value));
            }))
        });

        //REACTION HANDLER
        MainIndex.instance.discordClient.on('messageReactionAdd', reaction => {
            if(reaction.me)
                return;

            let guild = reaction.message.guild;
            let guildGameManager = MainIndex.instance.guildGameManagerByGuild(guild);

        });
        MainIndex.instance.discordClient.on('messageReactionRemove', reaction => {
            let guild = reaction.message.guild;
            let guildGameManager = MainIndex.instance.guildGameManagerByGuild(guild);


        });

        //MESSAGE HANDLER
        MainIndex.instance.discordClient.on('message', msg => {
            if (msg.author === MainIndex.instance.discordClient.user)
                return;

            //this._guilds[0].createGame(emo[0], msg.member);

            MainIndex.instance.commandManager.handleMessage(msg);
        });

        //BOT JOIN SERVER HANDLER
        MainIndex.instance.discordClient.on("guildCreate", guild => {
            let gm: GuildGameManager = new GuildGameManager(guild);
            MainIndex.instance.guildGameManager.push(gm);
            gm.setup();
        });

        MainIndex.instance.discordClient.login(conf.getConfig().token);

    }
}