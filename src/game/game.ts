import Discord = require('discord.js');
import {User} from "./user";
import {constants} from "../utils/const";

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
        //Create Roles
        this.guild.createRole({name:"Spielleiter #" + this.id, color: "ORANGE"});
        this.guild.createRole({name:"Spielleiter #" + this.id, color: "GREEN"});
        this.guild.createRole({name:"Spielleiter #" + this.id, color: "RED"});
        this.guild.createRole({name:"Bürgermeister #" + this.id, color: "GOLD"});

        //Set Leader
        this.leader.isLeader = true;

        //Create Channels
        this.guild.createChannel("Dorf #" + this.id, {type: "category"}).then(village => {
            this.userChannelMap.set("Category", village);

            //SPIELLEITER
            this.guild.createChannel("Spielleitung", {type: "text", permissionOverwrites: [{ id: constants.leaderRole(this.guild, this.id) }]}).then(chan => {
                chan.setParent(village.id);
                this.userChannelMap.set("Spielleitung", chan);
            })

            //GameChat
            this.guild.createChannel("GameChat", {type: "text", permissionOverwrites: [{ id: constants.leaderRole(this.guild, this.id) },{ id: constants.aliveRole(this.guild, this.id) },{ id: constants.deadRole(this.guild, this.id), deny: ["SEND_MESSAGES"] }]}).then(chan => {
                chan.setParent(village.id);
                this.userChannelMap.set("GameChat", chan);
            })

            //Polls
            this.guild.createChannel("Abstimmungen", {type: "text", permissionOverwrites: [{ id: constants.leaderRole(this.guild, this.id) },{ id: constants.aliveRole(this.guild, this.id) },{ id: constants.deadRole(this.guild, this.id), deny: ["SEND_MESSAGES"] }]}).then(chan => {
                chan.setParent(village.id);
                this.userChannelMap.set("Abstimmungen", chan);
            })

            //Dead
            this.guild.createChannel("Totenchat", {type: "text", permissionOverwrites: [{ id: constants.leaderRole(this.guild, this.id) },{ id: constants.deadRole(this.guild, this.id) }]}).then(chan => {
                chan.setParent(village.id);
                this.userChannelMap.set("Totenchat", chan);
            })

            //DIE SPIELCHATS FÜR DIE WERWÖLFE UND CO EINFÜGEN


            //VOICE
            //VILLAGE
            this.guild.createChannel("Dorf", {type: "voice", permissionOverwrites: [{ id: constants.leaderRole(this.guild, this.id) },{ id: constants.aliveRole(this.guild, this.id) },{ id: constants.deadRole(this.guild, this.id) }]}).then(chan => {
                chan.setParent(village.id);
                this.userChannelMap.set("Dorf", chan);
            })

            //DEAD
            this.guild.createChannel("Tot", {type: "voice", permissionOverwrites: [{ id: constants.leaderRole(this.guild, this.id) },{ id: constants.deadRole(this.guild, this.id) }]}).then(chan => {
                chan.setParent(village.id);
                this.userChannelMap.set("Tot", chan);
            })

        })

    }

    close() {
        //RESET CHANNEL
        this.userChannelMap.get("Category").delete();

        //RESET USERS
        this.users.forEach((user) => {
            user.reset();
        });
        this.users = [];

        //RESET ROLES
        constants.leaderRole(this.guild, this.id).delete();
        constants.aliveRole(this.guild, this.id).delete();
        constants.deadRole(this.guild, this.id).delete();
        constants.mayorRole(this.guild, this.id).delete();
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