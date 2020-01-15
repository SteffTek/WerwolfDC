import {Command} from "./command";
import Discord = require("discord.js");

export class cmd_leader extends Command {

    constructor(){
        super("leader", "Spielleitung übergeben");
    }

    execute(dcMessage: Discord.Message) {
    }
}