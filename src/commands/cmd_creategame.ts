import {Command} from "./command";
import Discord = require("discord.js");
import {MainIndex} from "../../index";
import {stringutils} from "../utils/stringutils";

export class cmd_creategame extends Command {

    constructor(){
        super("create", "Erstellt ein neues Spiel.");
    }

    execute(dcMessage: Discord.Message) {

        console.log(dcMessage.content);
        let stdEmojis = stringutils.listEmojis(dcMessage.content);
        let customEmojis = stringutils.listCustomEmojis(dcMessage.content);
        let emojis: string[] = stdEmojis;

        if(customEmojis.length >= 1){
            emojis.concat(customEmojis);
        }

        dcMessage.delete();

       // console.log(emojis);

        if(emojis.length == 0){
            dcMessage.member.send("Du musst schon einen Emoji angeben, damit die Nachricht erstellt werden kann");
            return;
        } else if(emojis.length > 1){
            dcMessage.member.send("Ich weiß ja nicht, was du dir dadurch erhoffst, aber gib bitte nur ein Emoji an.");
            return;
        }

        let i = MainIndex.instance.guildGameManager.createGame(emojis[0], dcMessage.member);
        dcMessage.member.sendMessage("Spiel erstellt. ID: " + i);
    }
}