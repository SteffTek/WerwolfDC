import {Command} from "./command";
import Discord = require("discord.js");
import {GuildGameManager} from "../server/guild";
import {MainIndex} from "../../index";
import {Game, GamePhase} from "../game/game";
import {constants} from "../utils/const";
import {User} from "../game/user";

export class cmd_role extends Command {

    constructor(){
        super("role", "Nutzerrolle während des Spiels ändern.");
    }

    execute(dcMessage: Discord.Message) {

        let user: string = dcMessage.content.split(" ", 2)[1];
        let role: string = dcMessage.content.split(" ", 3)[2];
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

        if (id != -1) {
            let game: Game = guildManager.games[id];
            let usr: User = constants.stringToUser(user, game);

            if(game.gamePhase != GamePhase.ingame) {
                let tmpMsg;
                dcMessage.channel.send("Dieser Befehl funktioniert nur Ingame.").then((msg) => {
                        tmpMsg = msg;
                        tmpMsg.delete(3000);
                    }
                );
                return;
            }

            if (usr == null) {
                let tmpMsg;
                dcMessage.channel.send("Nutzer nicht gefunden!").then((msg) => {
                        tmpMsg = msg;
                        tmpMsg.delete(3000);
                    }
                );
            } else {
                usr.role = role;
                usr.announceRole();
            }
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