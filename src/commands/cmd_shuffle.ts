import {Command} from "./command";
import Discord = require("discord.js");
import {GuildGameManager} from "../server/guild";
import {MainIndex} from "../../index";
import {Game, GamePhase} from "../game/game";

export class cmd_shuffle extends Command {

    constructor(){
        super("shuffle", "Mischt die Rollen in der Checking Phase.");
    }

    execute(dcMessage: Discord.Message) {
        let user = dcMessage.member;
        let guild = dcMessage.guild;
        if(guild == null) {
            return;
        }
        let id = -1;

        let guildManager: GuildGameManager = MainIndex.instance.guildGameManagerByGuild(guild);
        for(let game in guildManager.games){
            if(guildManager.games[game].leader.dcUser == user){
                id = parseInt(game);
                break;
            }
        }
        dcMessage.delete();

        if(id != -1) {
            let game: Game = guildManager.games[id];

            if(game.gamePhase == GamePhase.rolechecking) {
                if(!game.checkRoles()) {
                    let tmpMsg;
                    dcMessage.channel.send("Die Rollen- und Spieler-Anzahl stimmt nicht überein.").then(msg => {
                        tmpMsg = msg;
                        tmpMsg.delete(3000);
                    });
                }
                return;
            }

            let tmpMsg;
            dcMessage.channel.send("Die Spielphase muss Rolechecking sein!").then(msg => {
                tmpMsg = msg;
                tmpMsg.delete(3000);
            });

        } else {
            let tmpMsg;
            dcMessage.channel.send("Du leitest gerade kein Spiel!").then(msg => {
                tmpMsg = msg;
                tmpMsg.delete(3000);
            });
        }
    }
}