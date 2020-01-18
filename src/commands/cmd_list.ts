import {Command} from "./command";
import Discord = require("discord.js");
import {GuildGameManager} from "../server/guild";
import {MainIndex} from "../../index";
import {Game} from "../game/game";

export class cmd_list extends Command {

    constructor() {
        super("list", "Spieler auflisten");
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
            if (guildManager.games[game].leader.dcUser == user || guildManager.games[game].getUser(user.id) != null) {
                id = parseInt(game);
                break;
            }
        }
        dcMessage.delete();

        if (id != -1) {
            let game: Game = guildManager.games[id];
            let users = game.listUsers(false);

            let string = "__**Die Besetzung von Dorf #" + game.id + ":**__ \n\n";
            for (let i = 0; i < users.length; i++) {
                string += users[i] + "\n"
            }

            dcMessage.channel.send(string);

        } else {
            let tmpMsg;
            dcMessage.channel.send("Du bist gerade in keinem Spiel!").then(msg => {
                tmpMsg = msg;
                tmpMsg.delete(3000);
            });
        }

    }
}