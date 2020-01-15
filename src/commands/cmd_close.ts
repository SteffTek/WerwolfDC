import {Command} from "./command";
import Discord = require("discord.js");

export class cmd_close extends Command {

    constructor(){
        super("close", "Spiel schließen");
    }

    execute(dcMessage: Discord.Message) {
    }
}