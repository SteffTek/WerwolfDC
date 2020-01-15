import {Command} from "./command";
import Discord = require("discord.js");

export class cmd_back extends Command {

    constructor(){
        super("back", "Gamephase zurück während RoleChekcing");
    }

    execute(dcMessage: Discord.Message) {
    }
}