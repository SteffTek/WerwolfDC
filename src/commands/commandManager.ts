import Discord = require("discord.js");
import {Command} from "./command";
import {logger} from "../utils/logger";
import "./cmd_creategame"

export class CommandManager {

    commands: Array<Command>;

    constructor(){

    }

    add(command: Command){
        this.commands.push(command);
    }

    handleMessage(dcMessage: Discord.Message) {



        for (let cmd in this.commands) {
        }
    }
}