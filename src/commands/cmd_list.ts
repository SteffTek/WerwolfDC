import {Command} from "./command";
import Discord = require("discord.js");

export class cmd_list extends Command {

    constructor(){
        super("list", "Spieler auflisten");
    }

    execute(dcMessage: Discord.Message) {
    }
}