import {Command} from "./command";
import Discord = require("discord.js");

export class cmd_pool extends Command {

    constructor(){
        super("pool", "Rollen festlegen");
    }

    execute(dcMessage: Discord.Message) {
    }
}