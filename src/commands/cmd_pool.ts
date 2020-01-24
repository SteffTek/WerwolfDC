import {Command} from "./command";
import Discord = require("discord.js");
import {constants} from '../utils/const';
import {GuildGameManager} from "../server/guild";
import {MainIndex} from "../../index";
import {User} from "../game/user";
import {Game, GamePhase} from "../game/game";

export class cmd_pool extends Command {

    constructor(){
        super("pool", "Rollen festlegen", "3 Werwolf(wwchat) Hexe(hexenchat) Jäger Amor(amorchat) 4 Dorfbewohner");
    }

    execute(dcMessage: Discord.Message) {

        // !pool 3 Werwolf(wwchat) Hexe(hexenchat) Jäger Amor 4 Dorfbewohner

        let guild = dcMessage.guild;
        if(guild == null) {
            return;
        }

        let id = -1;
        let guildManager: GuildGameManager = MainIndex.instance.guildGameManagerByGuild(guild);
        for (let game in guildManager.games) {
            if (guildManager.games[game].leader.dcUser == dcMessage.member) {
                id = parseInt(game);
                break;
            }
        }

        if (id != -1) {
            let game: Game = guildManager.games[id];

            if(game.gamePhase != GamePhase.created) {
                dcMessage.channel.send("Die Spielphase ist zu weit fortgeschritten!").then(function(msg: Discord.Message) {
                    msg.delete(3000);
                });
                return;
            }

            //ARGS PARSEN => ARRAY
            let array = new Array<string>();

            let message = dcMessage.content.substr(6);
            let args = message.split(" ");
            let amount = 1;
            let currentArg = 0;
            let maxArgs = args.length;

            for(let i = 0; i < maxArgs; i++){

                amount = parseInt(args[currentArg]);
                if(isNaN(amount)) {
                    amount = 1;
                } else {
                    currentArg++;
                    maxArgs--;
                }

                for(let x = 0; x < amount; x++){
                    array.push(args[currentArg]);
                }

                currentArg++;
                amount = 1;
            }

            game.setRoles(array);
        } else {
            let tmpMsg;
            dcMessage.channel.send("Du leitest gerade kein Spiel!").then((msg) => {
                    tmpMsg = msg;
                    tmpMsg.delete(3000);
                }
            );
        }

    }
}