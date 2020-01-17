import {Command} from "./command";
import Discord = require("discord.js");
import {constants} from '../utils/const';
import {GuildGameManager} from "../server/guild";
import {MainIndex} from "../../index";
import {User} from "../game/user";

export class cmd_kick extends Command {

    constructor() {
        super("kick", "Nutzer entfernen");
    }

    execute(dcMessage: Discord.Message) {

        let user: string = dcMessage.content.split(" ", 2)[1];
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
            let game = guildManager.games[id];
            let usr: User = constants.stringToUser(user, game);

            if (usr == null) {
                let tmpMsg;
                dcMessage.channel.send("Nutzer nicht gefunden!").then((msg) => {
                        tmpMsg = msg;
                        tmpMsg.delete(3000);
                    }
                );
            } else {
                game.kickUser(usr.dcUser);
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