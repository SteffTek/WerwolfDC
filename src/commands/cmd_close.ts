import {Command} from "./command";
import Discord = require("discord.js");
import {MainIndex} from "../../index";
import {Game} from "../game/game";
import {GuildGameManager} from "../server/guild";

export class cmd_close extends Command {

    constructor(){
        super("close", "Spiel schließen");
    }

    execute(dcMessage: Discord.Message) {
        let user = dcMessage.member;
        let guild = dcMessage.guild;
        if(guild == null) {
            return;
        }
        let id = -1;

        let guildManager: GuildGameManager = MainIndex.instance.guildGameManagerByGuild(guild);
        dcMessage.delete();

        for(var game in guildManager.games){
            console.log(game);
            if(guildManager.games[game].leader.dcUser == user){
                id = parseInt(game);
                break;
            }
        }

        if(id != -1) {
            guildManager.closeGame(id);
        } else {
            let tmpMsg;
            dcMessage.channel.send("Du leitest gerade kein Spiel!").then(msg => {
                tmpMsg = msg;
                tmpMsg.delete(3000);
            });
        }
    }
}