import Discord = require('discord.js');
import {User} from "./user";

export class Game {

    guild: Discord.Guild;
    emoji: Discord.Emoji;
    leader: User;

    users: Array<User>;

    constructor(guild: Discord.Guild, emoji: Discord.Emoji, leader: User){
        this.guild = guild;
        this.emoji = emoji;
        this.leader = leader;

        this.create();
    }

    //Create Ranks and Channels
    create() {

    }

    close() {

    }
/*
    get getUser() {

    }*/

    kickUser() {

    }

    addUser() {

    }
/*
    get getRoles() {

    }*/

    set setRoles(roles) {

    }

}