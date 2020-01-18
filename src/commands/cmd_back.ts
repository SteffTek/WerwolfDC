import {Command} from "./command";
import Discord = require("discord.js");
import {GuildGameManager} from "../server/guild";
import {MainIndex} from "../../index";
import {Game} from "../game/game";

export class cmd_back extends Command {

    constructor() {
        super("back", "Gamephase zurück während RoleChekcing");
    }

    execute(dcMessage: Discord.Message) {
        let user = dcMessage.member;
        let guild = dcMessage.guild;
        if (guild == null) {
            return;
        }
        let id = -1;

        let guildManager: GuildGameManager = MainIndex.instance.guildGameManagerByGuild(guild);
        for (let game in guildManager.games) {
            if (guildManager.games[game].leader.dcUser == user) {
                id = parseInt(game);
                break;
            }
        }
        dcMessage.delete();

        if (id != -1) {
            let game: Game = guildManager.games[id];
            if (!game.prevGamePhase()) {
                dcMessage.channel.send("Das Spiel ist bereits zu weit fortgeschritten!").then(function (msg: Discord.Message) {
                    msg.delete(3000);
                });
            }
        } else {
            let tmpMsg;
            dcMessage.channel.send("Du leitest gerade kein Spiel!").then(msg => {
                tmpMsg = msg;
                tmpMsg.delete(3000);
            });
        }
    }
}