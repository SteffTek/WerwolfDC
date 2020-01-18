import {Command} from "./command";
import Discord = require("discord.js");
import {GuildGameManager} from "../server/guild";
import {MainIndex} from "../../index";
import {Game} from "../game/game";
import {constants} from "../utils/const";
import {User} from "../game/user";

export class cmd_add extends Command {

    constructor(){
        super("add", "Nutzer hinzufügen - Role nur während der Ingame Phase benötigt");
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
                if(!game.addUser(usr, role)){
                    let tmpMsg;
                    dcMessage.channel.send("Nutzer kann nicht hinzugefügt werden! Wenn die Spielphase \"Ingame\n erreicht wurde muss eine Rolle(Chat) angegeben werden.").then((msg) => {
                            tmpMsg = msg;
                            tmpMsg.delete(7000);
                        }
                    );
                }
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