import Discord = require("discord.js");
import {Command} from "./command";
import {logger} from "../utils/logger";
import conf = require("../utils/config");

import {cmd_help} from "./cmd_help";
import {cmd_creategame} from "./cmd_creategame";
import {cmd_next} from "./cmd_next";
import {cmd_close} from "./cmd_close";
import {cmd_kick} from "./cmd_kick";
import {cmd_poll} from "./cmd_poll";
import {cmd_pool} from "./cmd_pool";
import {cmd_back} from "./cmd_back";
import {cmd_leader} from "./cmd_leader";
import {cmd_list} from "./cmd_list";
import {cmd_add} from "./cmd_add";
import {cmd_mute} from "./cmd_mute";
import {cmd_role} from "./cmd_role";
import { cmd_shuffle } from "./cmd_shuffle";

export class CommandManager {

    commands: Array<Command> = new Array<Command>();

    constructor() {
        this.add(new cmd_help(this));
        this.add(new cmd_creategame());
        this.add(new cmd_close());
        this.add(new cmd_kick());
        this.add(new cmd_poll());
        this.add(new cmd_pool());
        this.add(new cmd_next());
        this.add(new cmd_back());
        this.add(new cmd_list());
        this.add(new cmd_leader());
        this.add(new cmd_add());
        this.add(new cmd_mute());
        this.add(new cmd_role());
        this.add(new cmd_shuffle());
    }

    add(command: Command) {
        this.commands.push(command);
    }

    getAll(): Array<Command> {
        return this.commands;
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