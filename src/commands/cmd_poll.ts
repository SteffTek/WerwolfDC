import {Command} from "./command";
import Discord = require("discord.js");

export class cmd_poll extends Command {

    constructor(){
        super("poll", "Umfrage starten - Argument public = User Votes werden angezeigt");
    }

    execute(dcMessage: Discord.Message) {
    }
}