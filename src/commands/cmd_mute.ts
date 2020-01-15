import {Command} from "./command";
import Discord = require("discord.js");

export class cmd_mute extends Command {

    constructor(){
        super("mute", "Spieler muten");
    }

    execute(dcMessage: Discord.Message) {
    }
}1