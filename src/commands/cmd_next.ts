import {Command} from "./command";
import Discord = require("discord.js");

export class cmd_next extends Command {

    constructor(){
        super("next", "Nächste Gamephase");
    }

    execute(dcMessage: Discord.Message) {
    }
}