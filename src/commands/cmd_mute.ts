import {Command} from "./command";
import Discord = require("discord.js");
import {GuildGameManager} from "../server/guild";
import {MainIndex} from "../../index";
import {Game} from "../game/game";
import {constants} from "../utils/const";

export class cmd_mute extends Command {

    constructor() {
        super("mute", "Spieler muten");
    }

    execute(dcMessage: Discord.Message) {
        let sender = dcMessage.member;
        let guild = dcMessage.guild;
        let user: Discord.GuildMember = constants.stringToGuildMember(dcMessage.content.split(" ", 2)[1], guild);

        if (guild == null) {
            return;
        }
        let id = -1;

        let guildManager: GuildGameManager = MainIndex.instance.guildGameManagerByGuild(guild);
        for (let game in guildManager.games) {
            if (guildManager.games[game].leader.dcUser == sender) {
                id = parseInt(game);
                break;
            }
        }
        dcMessage.delete();

        if (id != -1) {
            if(user == null){
                let game: Game = guildManager.games[id];
                let users = game.users;
                for (let u in users) {
                    let gameUser = users[u];
                    gameUser.dcUser.setMute(!gameUser.dcUser.mute);
                }
            } else {
                user.setMute(!user.mute);
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

1