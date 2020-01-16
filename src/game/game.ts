import Discord = require('discord.js');
import {User} from "./user";
import {constants} from "../utils/const";

enum GamePhase {
    created,
    rolechecking,
    ingame,
    closed
}

export class Game {

    gamePhase: GamePhase;
    guild: Discord.Guild;
    emoji: string;
    leader: User;
    id: number;
    userChannelMap = new Map();
    users: Array<User>;
    roles: Array<string>;
    userActions: Object;

    constructor(id: number, guild: Discord.Guild, emoji: string, dcLeader: Discord.GuildMember){
        this.guild = guild;
        this.emoji = emoji;
        this.id = id;
        this.gamePhase = GamePhase.created;

        //Create Roles
        this.guild.createRole({name:"Spielleiter #" + this.id, color: "ORANGE"}).then(role => {
            this.guild.createRole({name:"Lebendig #" + this.id, color: "GREEN"}).then(role => {
                this.guild.createRole({name:"Tod #" + this.id, color: "RED"}).then(role => {
                    this.guild.createRole({name:"Bürgermeister #" + this.id, color: "GOLD"}).then(role => {
                        this.leader = new User(dcLeader, this, true);
                        this.create();
                    })
                })
            })
        });
    }

    //Create Ranks and Channels
    create() {

        this.userChannelMap.set("specialChats", new Array);

        //Set Leader
        this.leader.isLeader = true;

        //Create Channels
        this.guild.createChannel("Dorf #" + this.id, {type: "category"}).then(village => {
            this.userChannelMap.set("Category", village);

            //SPIELLEITER
            this.guild.createChannel("Spielleitung", {type: "text", permissionOverwrites: [{id: this.guild.defaultRole.id, deny: ["VIEW_CHANNEL"] },{ id: constants.leaderRole(this.guild, this.id) },{ id: constants.aliveRole(this.guild, this.id), deny: ["VIEW_CHANNEL"] },{ id: constants.deadRole(this.guild, this.id), deny: ["VIEW_CHANNEL"] }]}).then(chan => {
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
            this.guild.createChannel("Totenchat", {type: "text", permissionOverwrites: [{ id: constants.leaderRole(this.guild, this.id) },{ id: constants.aliveRole(this.guild, this.id), deny: ["VIEW_CHANNEL"] },{ id: constants.deadRole(this.guild, this.id) }]}).then(chan => {
                chan.setParent(village.id);
                this.userChannelMap.set("Totenchat", chan);
            })

            //VOICE
            //VILLAGE
            this.guild.createChannel("Dorf", {type: "voice", permissionOverwrites: [{ id: constants.leaderRole(this.guild, this.id) },{ id: constants.aliveRole(this.guild, this.id) },{ id: constants.deadRole(this.guild, this.id) }]}).then(chan => {
                chan.setParent(village.id);
                this.userChannelMap.set("Dorf", chan);
            })

            //DEAD
            this.guild.createChannel("Tot", {type: "voice", permissionOverwrites: [{ id: constants.leaderRole(this.guild, this.id) },{ id: constants.aliveRole(this.guild, this.id), deny: ["VIEW_CHANNEL"] },{ id: constants.deadRole(this.guild, this.id) }]}).then(chan => {
                chan.setParent(village.id);
                this.userChannelMap.set("Tot", chan);
            })

        })

    }

    start() {
        this.gamePhase = GamePhase.ingame;

        //ROLLEN VERTEILEN
        for(let u in this.users) {
            let user = this.users[u];

            if(user.isLeader) {
                continue;
            }

            user.announceRole();

            //Im Spielleiter Channel Message erstellen
            this.userChannelMap.get("Spielleitung").send(user.dcUser.displayName + " - " + user.role).then( message => {
                message.react(":skull:");
                message.react(":green_heart:");
                message.react(":ok_hand:");
                this.userActions[user.dcUser.id] = message;
            })
        }
    }

    close() {
        //RESET CHANNEL
        this.userChannelMap.get("Category").delete();
        this.userChannelMap.get("Spielleitung").delete();
        this.userChannelMap.get("GameChat").delete();
        this.userChannelMap.get("Abstimmungen").delete();
        this.userChannelMap.get("Totenchat").delete();
        this.userChannelMap.get("Dorf").delete();
        this.userChannelMap.get("Tot").delete();

        //RESET SPECIAL CHANNEL
        let specialChats = this.userChannelMap.get("specialChats");
        for(var i in specialChats) {
            let chat = specialChats[i];
            this.guild.channels.get(chat.name).delete();
        }

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

    listUsers(showRole: boolean): Array<string> {
        let users = [];
        for(var u in this.users){
            let user = this.users[u];
            users.push(user.dcUser.displayName + (showRole) ? " - " +user.role : "");
        }
        return users;
    }

    kickUser(dcUser: Discord.GuildMember) {
        for(var u in this.users) {
            console.log(u);
            var user = this.users[u];

            if(user.dcUser == dcUser) {

                //Delete Message in Spielleiter
                for(let userID in this.userActions) {
                    if(user.dcUser.id == userID) {
                        this.userActions[userID].delete();
                        delete(this.userActions[userID]);
                        break;
                    }
                }

                user.reset();
                this.users.slice(parseInt(u), 1);
                return;
            }
        }
    }

    addUser(dcUser: Discord.GuildMember, role: string): boolean {
        for(var u in this.users) {
            console.log(u);
            var user = this.users[u];

            if(user.dcUser == dcUser) {
                return false; //ALREADY ADDED
            }
        }

        let newUser = new User(dcUser, this, false)

        if(role != null) {
            if(this.gamePhase == GamePhase.ingame){
                newUser.alive = true;
                newUser.role = role;

                newUser.announceRole();

                //Im Spielleiter Channel Message erstellen
                this.userChannelMap.get("Spielleitung").send(newUser.dcUser.displayName + " - " + newUser.role).then( message => {
                    message.react(":skull:");
                    message.react(":green_heart:");
                    message.react(":ok_hand:");
                    this.userActions[newUser.dcUser.id] = message;
                })
            }
        } else {
            if(this.gamePhase == GamePhase.ingame){
                return false; //Bei Ingame muss eine Rolle angegeben werden
            }
        }

        this.users.push(newUser);
        return true;
    }

    get getRoles(): Array<string> {
        return this.roles;
    }

    shuffleRoles() {

        if(this.roles.length != this.users.length) {
            return false;
        }

        let roles = this.roles.slice();

        for(let u in this.users){
            let user = this.users[u];
            let random = Math.floor(Math.random() * roles.length);

            user.role = roles[random];
            roles.splice(random, 1);
        }

        return true;
    }

    resetSpecialChannels() {
        //RESET SPECIAL CHANNEL
        let specialChats = this.userChannelMap.get("specialChats");
        for(var i in specialChats) {
            let chat = specialChats[i];
            this.guild.channels.get(chat.name).delete();
        }
    }

    set setRoles(array: Array<string>) {
        //array = [werwolf(wwchat), werwolf(wwchat), dorfbewohner]
        this.roles = array;

        this.resetSpecialChannels();

        //CREATE SPECIAL CHANNEL
        this.userChannelMap.get("specialChats").clear();
        for(var r in array) {
            let role = array[r];
            let chat = role.replace("(", " ").replace(")", "").split(" ")[1];

            var exists = false;
            for(var c in this.userChannelMap.get("specialChats")) {
                let channel = this.userChannelMap.get("specialChats")[c];
                if(channel.name == chat) {
                    exists = true;
                }
            }

            if(exists) {
                continue;
            }

            //Special Channel
            this.guild.createChannel(chat, {type: "text", permissionOverwrites: [{ id: constants.leaderRole(this.guild, this.id) }]}).then(chan => {
                chan.setParent(this.userChannelMap.get("Category").id);
                this.userChannelMap.get("specialChats").push(chan);
            })
        }
    }
}