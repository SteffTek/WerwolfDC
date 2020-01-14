import Discord = require('discord.js');
import {User} from "./user";

export class Game {

    guild: Discord.Guild;
    emoji: Discord.Emoji;
    leader: User;
    id: number;
    userChannelMap = new Map();
    users: Array<User>;

    constructor(id: number, guild: Discord.Guild, emoji: Discord.Emoji, leader: User){
        this.guild = guild;
        this.emoji = emoji;
        this.leader = leader;
        this.id = id;

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