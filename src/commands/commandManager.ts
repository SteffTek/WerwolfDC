import Discord = require("discord.js");
import {Command} from "./command";
import {logger} from "../utils/logger";
import "./cmd_creategame"
import conf = require("../utils/config");
import {cmd_creategame} from "./cmd_creategame";
import {cmd_next} from "./cmd_next";
import {cmd_close} from "./cmd_close";
import {cmd_kick} from "./cmd_kick";
import {cmd_poll} from "./cmd_poll";
import {cmd_pool} from "./cmd_pool";

export class CommandManager {

    commands: Array<Command> = new Array<Command>();

    constructor() {
        this.add(new cmd_creategame());
        this.add(new cmd_close());
        this.add(new cmd_kick());
        this.add(new cmd_poll());
        this.add(new cmd_pool());
    }

    add(command: Command) {
        this.commands.push(command);
    }

    handleMessage(dcMessage: Discord.Message) {
        this.commands.forEach(cmd => {
            if (dcMessage.content.startsWith(conf.getConfig().prefix)) {
                if (dcMessage.content.substr(1).toLowerCase().split(" ", 2)[0] == cmd.name) {
                    cmd.execute(dcMessage);
                    return;
                }
            }
        })


    }
}