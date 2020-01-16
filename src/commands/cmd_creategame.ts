import {Command} from "./command";
import Discord = require("discord.js");
import {MainIndex} from "../../index";
import {stringutils} from "../utils/stringutils";

import conf = require("../utils/config");



export class cmd_creategame extends Command {

    constructor() {
        super("create", "Erstellt ein neues Spiel.");
    }

    execute(dcMessage: Discord.Message) {

        let channel: Discord.Channel = dcMessage.channel;

        if(channel.type != "text") {
            return;
        }

        let chan = dcMessage.guild.channels.get(channel.id);
        if(chan.name != conf.getConfig().mainChannel) {
            return;
        }

        let stdEmojis = stringutils.listEmojis(dcMessage.content);
        let customEmojis = stringutils.listCustomEmojis(dcMessage.content);
        let emoji = stdEmojis != null ? (customEmojis != null ? (stdEmojis.index < customEmojis.index ? stdEmojis : customEmojis) : stdEmojis) : customEmojis;

        //console.log(emoji[0]);

        dcMessage.delete();

        if (emoji == null) {
            dcMessage.member.send("Du musst schon einen Emoji angeben, damit die Nachricht erstellt werden kann.");
            return;
        }

        let customEmoji;
        try {
            customEmoji = emoji[0].split(":")[2].substr(0, emoji[0].split(":")[2].length - 1);
        } catch {}

        if(customEmoji != null) {
            if(dcMessage.guild.emojis.get(customEmoji) == null) {
                dcMessage.member.send("Nette Idee, aber der Bot ist nicht von Feco. Du kannst keine Fremdemojis verwenden :P ");
                return;
            }
        }

        let i = MainIndex.instance.guildGameManagerByGuild(dcMessage.guild).createGame(emoji.toString(), dcMessage.member);
        dcMessage.member.send("Spiel erstellt. ID: #" + i);
        let tmpMsg;
        dcMessage.channel.send(dcMessage.content.substr(8).toString()).then(msg => {
            tmpMsg = msg;

            //tmpMsg.react(emoji[0]);-*

            if(customEmoji != null){
                tmpMsg.react(dcMessage.guild.emojis.get(customEmoji));
            } else {
                tmpMsg.react(emoji[0]);
            }
        });
    }
}