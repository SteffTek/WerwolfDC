import {Command} from "./command";
import Discord = require("discord.js");
import {MainIndex} from "../../index";
import {Game} from "../game/game";
import {GuildGameManager} from "../server/guild";
import conf = require("../utils/config");
import { CommandManager } from "./commandManager";

export class cmd_help extends Command {

    commandManager: CommandManager;

    constructor(commandManager: CommandManager){
        super("help", "Hilfe anzeigen");
        this.commandManager = commandManager;
    }

    execute(dcMessage: Discord.Message) {

        let i = 0;
        function recursion(commandManager: CommandManager, dcMessage: Discord.Message) {
            let channel = dcMessage.channel;

            let cmd: Command = commandManager.getAll()[i];

            let embed = new Discord.RichEmbed()
            .setColor("#0099ff")
            .setTitle(conf.getConfig().prefix + cmd.name)
            .addField("Beschreibung:", cmd.description)
            .addField("Beispiel: ", conf.getConfig().prefix + cmd.name + " " + cmd.help);

            dcMessage.channel.send(embed).then( msg => {
                i++;

                if(i < commandManager.getAll().length){
                    recursion(commandManager, dcMessage);
                    return;
                }
                finish(dcMessage);
            });
        }

        recursion(this.commandManager, dcMessage)

        function finish(dcMessage: Discord.Message) {

            let embed = new Discord.RichEmbed()
            .setColor("#0099ff")
            .setTitle("Mehr Info nötig?")
            .addField("Weitere hilfe findest du in unserem GitHub!", "https://github.com/SteffTek/WerwolfDC")
            .setURL("https://github.com/SteffTek/WerwolfDC");

            dcMessage.channel.send(embed);
        }
    }
}