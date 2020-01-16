import {Command} from "./command";
import Discord = require("discord.js");

export class cmd_creategame extends Command {

    constructor(){
        super("create", "Erstellt ein neues Spiel.");
    }

    execute(dcMessage: Discord.Message) {
    }
}