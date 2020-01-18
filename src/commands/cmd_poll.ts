import {Command} from "./command";
import Discord = require("discord.js");
import {constants} from '../utils/const';
import {GuildGameManager} from "../server/guild";
import {MainIndex} from "../../index";
import {User} from "../game/user";
import {Game, GamePhase} from "../game/game";

export class cmd_poll extends Command {

    constructor(){
        super("poll", "Umfrage starten - Argument public = User Votes werden angezeigt");
    }

    execute(dcMessage: Discord.Message) {

        let privateString: string = dcMessage.content.split(" ", 2)[1];
        let isPrivate: boolean = false;

        if(privateString == "private" || privateString == "privat") {
            isPrivate = true;
        }

        let guild = dcMessage.guild;
        if(guild == null) {
            return;
        }

        let id = -1;

        let guildManager: GuildGameManager = MainIndex.instance.guildGameManagerByGuild(guild);
        dcMessage.delete();

        for (let game in guildManager.games) {
            if (guildManager.games[game].leader.dcUser == dcMessage.member) {
                id = parseInt(game);
                break;
            }
        }

        let tmpMsg;
        if (id != -1) {

            let game = guildManager.games[id];
            if(game.gamePhase != GamePhase.ingame) {
                dcMessage.channel.send("Das Spiel befindet sich nicht in der Ingame Phase").then((msg) => {
                    tmpMsg = msg;
                    tmpMsg.delete(3000);
                });
                return;
            }

            if(!game.createPoll(dcMessage.channel)) {
                dcMessage.channel.send("Dies ist kein Vote-Channel").then((msg) => {
                    tmpMsg = msg;
                    tmpMsg.delete(3000);
                });
            }

        } else {
            dcMessage.channel.send("Du leitest gerade Kein Spiel").then((msg) => {
                tmpMsg = msg;
                tmpMsg.delete(3000);
            });
        }

    }
}