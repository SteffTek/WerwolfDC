import {logger} from "../utils/logger";
import Discord = require('discord.js');
import {GuildManager} from "../server/guild";
import conf = require("../utils/config");

import {CommandManager} from "../commands/commandManager";
import {User} from "../game/user";
import {Emoji} from "discord.js";

export class DiscordHandler {

    client: Discord.Client;
    isReady: boolean;
    guilds: Array<GuildManager>;
    commandManager = new CommandManager();

    constructor() {
        this.client = new Discord.Client();
        this.isReady = false;

        this.guilds = [];

        this.client.on('ready', () => {
            logger.info(`Logged in as ${this.client.user.tag}!`);

            this.isReady = true;

            //Get Every Server
            this.client.guilds.forEach((value => {
                this.guilds.push(new GuildManager(value));
            }))
        });

        //MESSAGE HANDLER
        this.client.on('message', msg => {
            if (msg.author === this.client.user)
                return;

            //COMMAND LISTENER
            let emo: string = msg.content.split(" ", 2)[0];
            let anyEmo = this.client.emojis.find(emoji => emoji.name == emo);
            logger.info(msg.toString());


/*
            let toSend: string = "a ";
            for(let e in msg.content.split(" ")){
               let tmp: string = msg.content.split(" ")[e];
               logger.info(tmp);

                msg.client.emojis.find(guildEmoji => {

                    logger.info(guildEmoji.toString());

                    if(guildEmoji.toString() === tmp){
                        logger.info("true");
                        toSend += guildEmoji.toString() + " ";
                        return false;
                    }

                    return false;
                });
            }*/

            // msg.client.emojis.find(fn => (fn.s))
            /*this.client.emojis.find(emoji => {
                if (emoji.name == emo) {
                    anyEmo = emoji;
                    return true;
                }

                return false;
            });*/

            //msg.channel.send(anyEmo);
        });

        //BOT JOIN SERVER HANDLER
        this.client.on("guildCreate", guild => {
            let gm: GuildManager = new GuildManager(guild);
            this.guilds.push(gm);
            gm.setup();
        });

        this.client.login(conf.getConfig().token);

    }

    get getClient() {
        return this.client;
    }
}