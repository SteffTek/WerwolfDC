import {Command} from "./command";
import Discord = require("discord.js");

export class cmd_kick extends Command {

    constructor(){
        super("kick", "Nutzer entfernen");
    }

    execute(dcMessage: Discord.Message) {
    }
}