import {Command} from "./command";
import Discord = require("discord.js");
import {GuildGameManager} from "../server/guild";
import {MainIndex} from "../../index";
import {User} from "../game/user";
import {constants} from "../utils/const";
import {Game} from "../game/game";

export class cmd_leader extends Command {

    constructor(){
        super("leader", "Spielleitung übergeben");
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
            let game: Game = guildManager.games[id];
            let usr: Discord.GuildMember = constants.stringToGuildMember(user, guild);

            if(game.getUser(usr.id) != null) {
                let tmpMsg;
                dcMessage.channel.send("Der neue Spielleiter darf nicht im Spiel sein!").then((msg) => {
                        tmpMsg = msg;
                        tmpMsg.delete(3000);
                    }
                );
                return;
            }

            for (let g in guildManager.games) {
                let games = guildManager.games[g];
                if(games.getUser(usr.id) != null || games.leader.dcUser.id == usr.id) {
                    let tmpMsg;
                    dcMessage.channel.send("Der neue Spielleiter darf nicht in einem anderen Spiel sein!").then((msg) => {
                            tmpMsg = msg;
                            tmpMsg.delete(3000);
                        }
                    );
                    return;
                }
            }

            if (usr == null) {
                let tmpMsg;
                dcMessage.channel.send("Nutzer nicht gefunden!").then((msg) => {
                        tmpMsg = msg;
                        tmpMsg.delete(3000);
                    }
                );
            } else {
                game.leader.reset();
                game.leader = new User(usr, game, true);
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