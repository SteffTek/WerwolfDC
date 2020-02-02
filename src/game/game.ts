import Discord = require('discord.js');
import {User} from "./user";
import {Poll, PollPhase} from "./poll";
import {constants} from "../utils/const";
import conf = require("../utils/config");

export enum GamePhase {
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
    createMessage: Discord.Message;
    id: number;
    userChannelMap = new Map();
    users: Array<User>;
    roles: Array<string>;
    userActions: Object;
    polls: Array<Poll>

    constructor(id: number, guild: Discord.Guild, emoji: string, dcLeader: Discord.GuildMember, createMessage: Discord.Message) {
        this.guild = guild;
        this.emoji = emoji;
        this.id = id;
        this.createMessage = createMessage;
        this.gamePhase = GamePhase.created;
        this.users = [];
        this.polls = [];
        this.roles = [];
        this.userActions = {};

        //Create Roles

        this.createRoles(this, function (game: Game) {
            game.leader = new User(dcLeader, game, true);
            game.create();
        })
    }

    //Create Ranks and Channels
    create() {

        this.userChannelMap.set("specialChats", new Array);

        //Set Leader
        this.leader.isLeader = true;

        //Create Channel
        this.createChannel();
    }

    nextGamePhase() {

        if(this.users.length < 2) {
            //return false;
            //FIXME HIER IST WICHTIG, NE?
        }

        if (this.gamePhase == GamePhase.created) {
            return this.checkRoles();
        }

        if (this.gamePhase == GamePhase.rolechecking) {
            return this.start();
        }

        if (this.gamePhase == GamePhase.ingame) {
            this.close();
            return true;
        }

    }

    prevGamePhase() {
        if (this.gamePhase == GamePhase.rolechecking) {
            this.gamePhase = GamePhase.created;
            return true;
        }

        return false;
    }

    checkRoles() {
        if (this.shuffleRoles()) {
            this.gamePhase = GamePhase.rolechecking;

            let string = "__**Die Rollenverteilung:**__ \n\n";
            let userList = this.listUsers(true);
            for (let i = 0; i < userList.length; i++) {
                string += userList[i] + "\n"
            }

            this.userChannelMap.get("Spielleitung").send(string);

            return true;
        } else {
            return false;
        }
    }

    start() {
        if (this.gamePhase != GamePhase.rolechecking) {
            return false;
        }

        this.gamePhase = GamePhase.ingame;

        this.userChannelMap.get("Spielleitung").send("```css\n- - - Nutzer - - -\n```").then(msg => {
            //ROLLEN VERTEILEN
            this.createMessage.delete().catch();
            let i = 0;
            function recursion(game: Game) {
                let user = game.users[i];

                if (user.isLeader) {
                    i++;
                    if(game.users.length > i) {
                        recursion(game);
                    }
                    return;
                }

                user.announceRole();

                //Im Spielleiter Channel Message erstellen
                game.userChannelMap.get("Spielleitung").send(user.dcUser.displayName + " - " + user.role).then(message => {
                    message.react("💀").then(react => {
                        message.react("💚").then(react => {
                            message.react("👌").then( react => {
                                game.userActions[user.dcUser.id] = message;

                                i++;
                                if(game.users.length > i) {
                                    recursion(game);
                                }
                                return;
                            })
                        });
                    });
                })
            }

            recursion(this);
        });

        return true;
    }

    close() {
        //RESET SPECIAL CHANNEL
        this.gamePhase = GamePhase.closed;
        this.resetSpecialChannels();
        this.resetChannels();

        //RESET USERS
        for (let u in this.users) {
            let user = this.users[u];
            user.reset();
        }
        this.users = [];

        for (let us in this.userActions) {
            let rec: Discord.Message = this.userActions[us];
            rec.clearReactions();
        }

        this.leader.reset();

        //RESET ROLES
        /*constants.leaderRole(this.guild, this.id).delete();
        constants.aliveRole(this.guild, this.id).delete();
        constants.deadRole(this.guild, this.id).delete();
        constants.mayorRole(this.guild, this.id).delete();*/

        //Remove Invite Message
        this.createMessage.delete().catch();
    }

    createPoll(dcChannel: Discord.Channel, isPrivate: boolean = null) {

        var privatePoll = false;
        var channel: Discord.TextChannel;
        var specialChats = this.userChannelMap.get("specialChats");
        for (let c in specialChats) {
            let chat = specialChats[c];

            if(chat.id == dcChannel.id) {
                channel = chat;
                break;
            }
        }

        if(dcChannel.id == this.userChannelMap.get("Abstimmungen").id) {
            channel = this.userChannelMap.get("Abstimmungen");
            privatePoll = true;
        }

        if(isPrivate != null) {
            privatePoll = isPrivate;
        }

        if (channel == null) {
            return false;
        }

        this.polls.push(new Poll(this, channel, privatePoll));
        return true;

    }

    handleReaction(dcReaction: Discord.MessageReaction, dcUser: Discord.User) {
        //Ignore when not Result
        if (this.gamePhase != GamePhase.ingame) {
            return;
        }

        //Check if Leader
        let leader = this.leader;
        if (leader.dcUser.id != dcUser.id) {
            return;
        }

        let emojiString = dcReaction.emoji.toString();

        let id = this.getReactedUser(dcReaction.message);
        let user = this.getUser(id);

        if (user == null) {
            return;
        }

        dcReaction.remove(leader.dcUser.id);

        if (emojiString == "💀") {
            //IF DEATH
            user.alive = false;
        } else if (emojiString == "👌") {
            //IF MAYOR
            if (this.getMayor() != null) {
                this.getMayor().isMayor = false;
            }
            user.isMayor = true;
        } else if (emojiString == "💚") {
            //IF ALIVE
            user.alive = true;
        }

    }

    getReactedUser(dcMessage: Discord.Message) {
        for (let userID in this.userActions) {
            let msg = this.userActions[userID];
            if (msg.id == dcMessage.id) {
                return userID;
            }
        }
        return null;
    }

    listUsers(showRole: boolean): Array<string> {
        let users = [];
        for (let u in this.users) {
            let user = this.users[u];
            users.push(user.dcUser.displayName + (showRole ? " - " + user.role : ""));
        }
        return users;
    }

    kickUser(dcUser: Discord.GuildMember) {
        for (let u in this.users) {
            var user = this.users[u];

            if (user.dcUser == dcUser) {

                //Delete Message in Spielleiter
                for (let userID in this.userActions) {
                    if (user.dcUser.id == userID) {
                        this.userActions[userID].delete();
                        delete (this.userActions[userID]);
                        break;
                    }
                }

                user.reset();
                this.users.splice(parseInt(u), 1);
                return;
            }
        }
    }

    addUser(dcUser: Discord.GuildMember, role: string = null): boolean {
        for (var u in this.users) {
            var user = this.users[u];

            if (user.dcUser == dcUser) {
                return false; //ALREADY ADDED
            }
        }

        if (this.gamePhase == GamePhase.rolechecking || this.gamePhase == GamePhase.closed) {
            return false;
        }

        let newUser = new User(dcUser, this, false)

        if (role != null) {
            if (this.gamePhase == GamePhase.ingame) {
                newUser.alive = true;
                newUser.role = role;

                newUser.announceRole();

                //Im Spielleiter Channel Message erstellen
                this.userChannelMap.get("Spielleitung").send(newUser.dcUser.displayName + " - " + newUser.role).then(message => {
                    message.react("💀");
                    message.react("💚");
                    message.react("👌");
                    this.userActions[newUser.dcUser.id] = message;
                })
            }
        } else {
            if (this.gamePhase == GamePhase.ingame) {
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

        if (this.roles.length != this.users.length) {
            return false;
        }

        let roles = this.roles.slice();

        for (let u in this.users) {
            let user = this.users[u];
            let random = Math.floor(Math.random() * roles.length);

            user.role = roles[random];
            roles.splice(random, 1);
        }

        return true;
    }

    resetSpecialChannels() {
        //RESET SPECIAL CHANNEL
        let specialChats = this.userChannelMap.get("specialChats").slice();
        let i = 0;

        function recursion() {
            let chat = specialChats[i];
            specialChats[i].delete().then(() => {
                i++;
                if (i < specialChats.length) {
                    recursion();
                }
            });
        }

        if (specialChats.length > 0)
            recursion();
    }

    resetChannels() {
        this.userChannelMap.forEach((value: Discord.Channel, key: string) => {
            if (key != "specialChats") {
                //value.delete();
            }
        });
    }

    setRoles(array: Array<string>) {
        // /pool 3 werwolf(wwchat)
        //array = [werwolf(wwchat), werwolf(wwchat), dorfbewohner]
        this.roles = array;

        this.resetSpecialChannels();

        //CREATE SPECIAL CHANNEL
        this.userChannelMap.set("specialChats", new Array);
        let i = 0;

        function recursion(game: Game) {
            let role = array[i];
            console.log(role);
            let chat = role.replace("(", " ").replace(")", "").split(" ")[1];

            if (chat == null) {
                i++;
                if (array.length > i) {
                    recursion(game);
                }
                return;
            }

            let exists = false;
            for (const c in game.userChannelMap.get("specialChats")) {
                let channel = game.userChannelMap.get("specialChats")[c];
                if (channel.name == chat) {
                    exists = true;
                }
            }

            if (exists) {
                i++;
                if (array.length > i) {
                    recursion(game);
                }
                return;
            }

            //Special Channel
            game.guild.createChannel(chat, {
                type: "text",
                permissionOverwrites: [
                    {
                        id: constants.leaderRole(game.guild, game.id),
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                    },
                    {
                        id: game.guild.defaultRole.id,
                        deny: ["VIEW_CHANNEL"]
                    }
                ]
            }).then((chan: Discord.TextChannel) => {
                chan.setParent(game.userChannelMap.get("Category").id);
                game.userChannelMap.get("specialChats").push(chan);

                i++;
                if (array.length > i) {
                    recursion(game);
                }
                return;
            })
        }

        if (array.length > 0)
            recursion(this);
    }

    getUser(id: string) {
        for (let u in this.users) {
            let user = this.users[u];

            if (user.dcUser.id == id) {
                return user;
            }
        }
        return null;
    }

    getMayor(): User {
        for (let u in this.users) {
            let user = this.users[u];

            if (user.isMayor) {
                return user;
            }
        }
        return null;
    }

    getAlive(): Object {
        let array = {};

        for (let u in this.users) {
            if (this.users[u].alive) {
                array[this.users[u].dcUser.id] = this.users[u];
            }
        }

        return array;
    }

    checkIfReactionFromGame(dcReaction: Discord.MessageReaction) {
        let channelID = dcReaction.message.channel.id;

        if (this.userChannelMap.get("Spielleitung").id == channelID) {
            return "game";
        }

        if (this.userChannelMap.get("Abstimmungen").id == channelID) {
            return "poll";
        }

        for (let p in this.polls) {
            let poll = this.polls[p];

            if (poll.channel.id == channelID) {
                return "poll";
            }
        }

        return "";
    }

    checkIfMessageFromGame(dcMessage: Discord.Message) {
        let channelID = dcMessage.channel.id;

        if (this.userChannelMap.get("Abstimmungen").id == channelID) {
            return "poll";
        }

        for (let p in this.polls) {
            let poll = this.polls[p];

            if (poll.channel.id == channelID) {
                return "poll";
            }
        }

        return "";
    }

    //Manage Roles
    createRoles(game: Game, _callback) {
        var instantiated = 0;

        //Create Roles
        if (constants.leaderRole(this.guild, this.id) == null) {
            console.log("oof");
            this.guild.createRole({name: "Spielleiter #" + this.id, color: "ORANGE", hoist: true}).then(role => {
                instantiated++;
            });
        } else {
            instantiated++;
        }

        if(constants.mayorRole(this.guild, this.id) == null) {
            this.guild.createRole({name:"Bürgermeister #" + this.id, color: "GOLD", hoist: false}).then(role => {
                instantiated++;
            });
        } else {
            instantiated++;
        }

        if (constants.aliveRole(this.guild, this.id) == null) {
            this.guild.createRole({name: "Lebendig #" + this.id, color: "GREEN", hoist: true}).then(role => {
                instantiated++;
            });
        } else {
            instantiated++;
        }

        if (constants.deadRole(this.guild, this.id) == null) {
            this.guild.createRole({name: "Tod #" + this.id, color: "RED", hoist: true}).then(role => {
                instantiated++;
            });
        } else {
            instantiated++;
        }


        while(instantiated < 4){}

        _callback(game);
    }

    createChannel() {

        let village = this.guild.channels.find(channel => channel.name === "Dorf #" + this.id);
        let children = [];

        //IF VILLAGE DOESNT EXIST
        if (village == null) {
            //CREATE
            this.guild.createChannel("Dorf #" + this.id, {type: "category"}).then(vill => {
                this.userChannelMap.set("Category", vill);
                village = vill
                create(this);
            });
        } else {
            this.userChannelMap.set("Category", village);
            create(this);
        }

        function create(game: Game) {
            //SPIELLEITUNG
            if(game.guild.channels.find(channel => channel.name === "spielleitung" && channel.parentID === village.id) == null) {
                game.guild.createChannel("spielleitung", {type: "text", permissionOverwrites: [{id: game.guild.defaultRole.id, deny: ["VIEW_CHANNEL"] },{ id: constants.leaderRole(game.guild, game.id), allow: ["VIEW_CHANNEL", "READ_MESSAGES", "READ_MESSAGE_HISTORY", "SEND_MESSAGES"] },{ id: constants.aliveRole(game.guild, game.id), deny: ["VIEW_CHANNEL"] },{ id: constants.deadRole(game.guild, game.id), deny: ["VIEW_CHANNEL"] }]}).then(chan => {
                    chan.setParent(village.id);
                    game.userChannelMap.set("Spielleitung", chan);
                })
            } else {
                game.userChannelMap.set("Spielleitung", game.guild.channels.find(channel => channel.name === "spielleitung" && channel.parentID === village.id));
            }

            //GAMECHAT
            if(game.guild.channels.find(channel => channel.name === "gamechat" && channel.parentID === village.id) == null) {
                game.guild.createChannel("gamechat", {type: "text", permissionOverwrites: [{id: game.guild.defaultRole.id, deny: ["SEND_MESSAGES"], allow: ["READ_MESSAGES", "READ_MESSAGE_HISTORY"]},{ id: constants.leaderRole(game.guild, game.id), allow: ["SEND_MESSAGES"] },{ id: constants.aliveRole(game.guild, game.id), allow: ["SEND_MESSAGES"] },{ id: constants.deadRole(game.guild, game.id), deny: ["SEND_MESSAGES"] }]}).then(chan => {
                    chan.setParent(village.id);
                    game.userChannelMap.set("GameChat", chan);
                })
            } else {
                game.userChannelMap.set("GameChat", game.guild.channels.find(channel => channel.name === "gamechat" && channel.parentID === village.id));
            }

            //POLLS
            if(game.guild.channels.find(channel => channel.name === "abstimmungen" && channel.parentID === village.id) == null) {
                game.guild.createChannel("abstimmungen", {type: "text", permissionOverwrites: [{id: game.guild.defaultRole.id, deny: ["SEND_MESSAGES"], allow: ["READ_MESSAGES", "READ_MESSAGE_HISTORY"]},{ id: constants.leaderRole(game.guild, game.id), allow: ["SEND_MESSAGES"] },{ id: constants.aliveRole(game.guild, game.id), allow: ["SEND_MESSAGES"] },{ id: constants.deadRole(game.guild, game.id), deny: ["SEND_MESSAGES"] }]}).then(chan => {
                    chan.setParent(village.id);
                    game.userChannelMap.set("Abstimmungen", chan);
                })
            } else {
                game.userChannelMap.set("Abstimmungen", game.guild.channels.find(channel => channel.name === "abstimmungen" && channel.parentID === village.id));
            }

            //DEAD
            if(game.guild.channels.find(channel => channel.name === "totenchat" && channel.parentID === village.id) == null) {
                game.guild.createChannel("totenchat", {type: "text", permissionOverwrites: [{id: game.guild.defaultRole.id, allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "READ_MESSAGES"]},{ id: constants.leaderRole(game.guild, game.id) },{ id: constants.aliveRole(game.guild, game.id), deny: ["VIEW_CHANNEL"] },{ id: constants.deadRole(game.guild, game.id) }]}).then(chan => {
                    chan.setParent(village.id);
                    game.userChannelMap.set("Totenchat", chan);
                })
            } else {
                game.userChannelMap.set("Totenchat", game.guild.channels.find(channel => channel.name === "totenchat" && channel.parentID === village.id));
            }

            //VILLAGE
            if (game.guild.channels.find(channel => channel.name === "Dorf" && channel.parentID === village.id) == null) {
                game.guild.createChannel("Dorf", {
                    type: "voice",
                    permissionOverwrites: [{id: constants.leaderRole(game.guild, game.id)}, {id: constants.aliveRole(game.guild, game.id)}, {id: constants.deadRole(game.guild, game.id)}]
                }).then(chan => {
                    chan.setParent(village.id);
                    game.userChannelMap.set("Dorf", chan);
                })
            } else {
                game.userChannelMap.set("Dorf", game.guild.channels.find(channel => channel.name === "Dorf" && channel.parentID === village.id));
            }

            //DEAF
            if (game.guild.channels.find(channel => channel.name === "Tot" && channel.parentID === village.id) == null) {
                game.guild.createChannel("Tot", {
                    type: "voice",
                    permissionOverwrites: [{id: constants.leaderRole(game.guild, game.id)}, {
                        id: constants.aliveRole(game.guild, game.id),
                        deny: ["VIEW_CHANNEL"]
                    }, {id: constants.deadRole(game.guild, game.id)}]
                }).then(chan => {
                    chan.setParent(village.id);
                    game.userChannelMap.set("Tot", chan);
                })
            } else {
                game.userChannelMap.set("Tot", game.guild.channels.find(channel => channel.name === "Tot" && channel.parentID === village.id));
            }

        }
    }
}