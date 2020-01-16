import {Command} from "./command";
import Discord = require("discord.js");

export class cmd_add extends Command {

    constructor(){
        super("add", "Nutzer hinzufügen - Role nur während der Ingame Phase benötigt");
    }

    execute(dcMessage: Discord.Message) {
    }
}