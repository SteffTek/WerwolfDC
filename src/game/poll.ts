import Discord = require('discord.js');
import {User} from "./user";
import {Game} from "./game";
import {constants} from "../utils/const";
import conf = require("../utils/config");

export enum PollPhase {
    accuse,
    voting,
    result
}

export class Poll {

    private _game: Game;
    private _channel: Discord.TextChannel;
    private _private: boolean;

    private _userMessages: Object;
    private _votes: Object;
    private _voteMessages: Object;
    private _resultMessages: Object;
    private _notVoted: Object;
    private _notVotedMsg: Discord.Message;

    private _currentReactionMessage: Discord.Message;

    private _accused: Object;
    private _pollPhase: PollPhase;

    constructor(game: Game, channel: Discord.TextChannel, privatePoll: boolean = false) {
        this._game = game;
        this._channel = channel;
        this._votes = {}  //VOTER.DCUSER.ID : ACCUSED.DCUSER.ID
        this._accused = {} //USER.DCUSER.ID : ACCUSED.DCUSER.ID
        this._userMessages = {} //ACCUSED.DCUSER.ID : DISCORD.MESSAGE
        this._voteMessages = {} //VOTER.DCUSER.ID : DISCORD.MESSAGE
        this._resultMessages = {} //ACCUSED.DCUSER.ID : DISCORD.MESSAGE
        this._notVoted = {} //ACCUSED.DCUSER.ID : USER
        this.pollPhase = PollPhase.accuse;
        this._private = privatePoll;

        this._channel.send("```cs\n# - - - Anklage - - -\n```").then((msg: Discord.Message) => {
            this._currentReactionMessage = msg;
            msg.react("👌");
        });
    }

    get channel(): Discord.TextChannel {
        return this._channel;
    }

    updateVotedList() {
        if(this._notVotedMsg != null) {
            let string = "__**Noch nicht gewählt:**__\n\n";

            for(let u in this._notVoted) {
                let user = this._notVoted[u];

                if(user.alive) {
                    string += "- **" + user.dcUser.displayName + "**\n"
                }
            }

            this._notVotedMsg.edit(string);
        }
    }

    nextPollPhase() {

        //SEND IN USERNAMES
        if(this.pollPhase == PollPhase.accuse) {
            this._currentReactionMessage.clearReactions().then( msg => {
                this._channel.send("```md\n# - - - Voting - - -\n```").then((msg: Discord.Message) => {
                    this._currentReactionMessage = msg;
                    msg.react("👌");

                    if(this._private) {

                        let string = "__**Noch nicht gewählt:**__\n\n";

                        for(let u in this._game.users) {
                            let user = this._game.users[u];

                            if(user.alive) {
                                string += "- **" + user.dcUser.displayName + "**\n"
                                this._notVoted[user.dcUser.id] = user;
                            }
                        }

                        this._game.userChannelMap.get("Abstimmungen").send(string).then( message => {
                            this._notVotedMsg = message;

                            let strAnklage = "\n";
                            for(let a in this._accused) {
                                let user = this._game.getUser(this._accused[a]);
                                strAnklage += "- " + user.dcUser.displayName + "\n";
                            }

                            for(let u in this._game.users){
                                let user = this._game.users[u];

                                if(user.alive)
                                    user.dcUser.send("Anklage erhoben gegen:\n" + strAnklage + "\nBitte hier eine Wahl treffen. \n\n Für eine Enthaltung \"-\" schreiben.");
                            }
                        })
                    }
                    this.pollPhase = PollPhase.voting;
                });
            });
        }

        if(this.pollPhase == PollPhase.voting) {
            this._currentReactionMessage.clearReactions().then( msg => {
                this.pollPhase = PollPhase.result;

                if(this._private){
                    this._notVotedMsg.delete();
                }

                this._channel.send("```py\n# - - - Ergebnis - - -\n```");
                this.printResult();
            });
        }

        if(this.pollPhase == PollPhase.result) {
            this._currentReactionMessage.clearReactions().then( msg => {
                this._channel.send("```cs\n# - - - Anklage - - -\n```").then((msg: Discord.Message) => {
                    this._currentReactionMessage = msg;
                    this.pollPhase = PollPhase.accuse;
                    this._votes = {}  //VOTER.DCUSER.ID : ACCUSED.DCUSER.ID
                    this._accused = {} //USER.DCUSER.ID : ACCUSED.DCUSER.ID
                    this._userMessages = {} //ACCUSED.DCUSER.ID : DISCORD.MESSAGE
                    this._voteMessages = {} //VOTER.DCUSER.ID : DISCORD.MESSAGE
                    this._resultMessages = {} //ACCUSED.DCUSER.ID : DISCORD.MESSAGE
                    msg.react("👌");
                });
            });
        }
    }

    set pollPhase(pollPhase: PollPhase) {
        this._pollPhase = pollPhase;
    }

    get pollPhase(): PollPhase {
        return this._pollPhase;
    }

    printResult() {
        //PRINT

        var votes = {} // ACCUSED ID : COUNT
        var voters = this._game.getAlive();
        for(let v in voters) {
            let voter = this._game.getUser(v);

            if(this._votes.hasOwnProperty(voter.dcUser.id)){

                if(this._votes[voter.dcUser.id] == 0) {
                    // Vote = 0 aka Enthalten
                    continue;
                }

                if(!votes.hasOwnProperty(this._votes[voter.dcUser.id])){
                    votes[this._votes[voter.dcUser.id]] = 0;
                }

                votes[this._votes[voter.dcUser.id]] += 1;
                delete(voters[voter.dcUser.id]);
            }
        }

        for(let vote in votes) {
            //CREATE EMBED MESSAGE
            let user = this._game.getUser(vote);

            if(user == null) {
                // Vote = 0 aka Enthalten
                continue;
            }

            var string = "";
            for(let userVote in this._votes) {
                let voteUser = this._game.getUser(userVote);

                if(this._votes[userVote] == voteUser.dcUser.id) {
                    string += voteUser.dcUser.displayName + "; "
                }
            }

            let embed = new Discord.RichEmbed()
                .setColor("#0099ff")
                .setTitle(user.dcUser.displayName)
                .addField("Gewählt durch: ", string, true)
                .addField("Stimmen:", votes[vote], true);

            this._channel.send(embed).then((msg: Discord.Message) => {
                msg.react("💀").then( react => {
                    msg.react("👌");
                });
                this._resultMessages[user.dcUser.id] = msg;
            });
        }

        //Enthaltung (Wer in Voters übrig ist)
        let enthaltungen = "";
        for(let voter in voters) {
            let voteUser = this._game.getUser(voters[voter].dcUser.id);

            if(this._channel.members.get(voteUser.dcUser.id) != null) {
                enthaltungen += voteUser.dcUser.displayName + "; ";
            }
        }

        let embedEnthaltung = new Discord.RichEmbed()
        .setColor("#0099ff")
        .setTitle("Enthaltungen:")
        .setDescription(enthaltungen);

        //SEND ENTHALTUNG
        this._channel.send(embedEnthaltung).then( msg => {
            //RESET REACTION MESSAGE
            this._currentReactionMessage.clearReactions();
            //POST NEW REACTION MESSAGE
            this._channel.send("```fix\n- - - Fertig - - -\n```").then((msg: Discord.Message) => {
                this._currentReactionMessage = msg;
                msg.react("👌");
            });
        });
    }

    handleReaction(dcReaction: Discord.MessageReaction, dcUser: Discord.User){

        //Check if Leader
        let leader = this._game.leader;
        if(leader.dcUser.id != dcUser.id){
            return;
        }

        let emojiString = dcReaction.emoji.toString();

        let id = this.getReactedUser(dcReaction.message);
        let user = this._game.getUser(id);

        if(user == null) {
            if(emojiString == "👌") {
                this.nextPollPhase();
            }
        } else {
            if(emojiString == "💀") {
                //IF DEATH
                user.alive = false;
                user.isMayor = false;
            } else if(emojiString =="👌") {
                //IF MAYOR
                if(this._game.getMayor() != null) {
                    this._game.getMayor().isMayor = false;
                }
                user.isMayor = true;
            }
        }

        //Reset Reactions
        for(let m in this._resultMessages){
            let msg = this._resultMessages[m];
            msg.clearReactions();
            delete(this._resultMessages[m]);
        }

    }

    getReactedUser(dcMessage: Discord.Message) {
        for(let userID in this._resultMessages) {
            let msg = this._resultMessages[userID];
            if(msg.id == dcMessage.id) {
                return userID;
            }
        }
        return null;
    }

    handleMessage(dcMessage: Discord.Message) {

        //Ignore while Result shows
        if(this.pollPhase == PollPhase.result) {
            return;
        }

        if(this._game.getUser(dcMessage.author.id) == null) {
            return;
        }

        if(!this._game.getUser(dcMessage.author.id).alive) {
            return;
        }

        if(this.pollPhase == PollPhase.voting){
            if(this._private && dcMessage.guild != null) {
                return;
            }
        }

        if(this.pollPhase == PollPhase.accuse) {
            let author = this._game.getUser(dcMessage.author.id);
            this.accuse(dcMessage.content, author);
        }

        if(this.pollPhase == PollPhase.voting) {
            let author = this._game.getUser(dcMessage.author.id);
            this.vote(dcMessage.content, author);
        }

        if(dcMessage.guild != null)
            dcMessage.delete();
    }

    //VOTING
    vote(username: string, voter: User){

        if(this.pollPhase != PollPhase.voting){
            return;
        }

        //CHECK FOR ENTHALTUNG
        if(username.startsWith("-")){
            if(this._private){
                //CHANGING ACCUSE
                if(this._votes.hasOwnProperty(voter.dcUser.id)){
                    this._votes[voter.dcUser.id] = 0;
                    constants.privateSelfDestructingMessage(voter, "Du hast dich enthalten!", 0);
                    this._voteMessages[voter.dcUser.id].edit(voter.dcUser.displayName + " hat sich umentschieden.");
                    return;
                }

                constants.privateSelfDestructingMessage(voter, "Du hast dich enthalten!", 0);
                this._channel.send(voter.dcUser.displayName + " hat abgestimmt!").then(msg => {
                    message = msg;
                    this._voteMessages[voter.dcUser.id] = message;
                    delete(this._notVoted[voter.dcUser.id]);
                    this.updateVotedList();

                    this._votes[voter.dcUser.id] = 0;
                    return;
                });
            }
        }

        //CHECK IF USER EXISTS
        let user = constants.stringToUser(username, this._game);
        if(user == null){
            if(!this._private){
                constants.selfDestructingMessage(this._channel, "Nutzer **" + username + "** nicht gefunden!");
                return;
            }
            constants.privateSelfDestructingMessage(voter, "Nutzer **" + username + "** nicht gefunden!")
            return;
        }

        //CHECK IF USER IS ACCUSED
        if(!this._userMessages.hasOwnProperty(user.dcUser.id)){
            if(!this._private){
                constants.selfDestructingMessage(this._channel, "**" + username + "** ist nicht angeklagt!")
                return;
            }
            constants.privateSelfDestructingMessage(voter, "**" + username + "** ist nicht angeklagt!")
            return;
        }

        //CHANGING ACCUSE
        if(this._votes.hasOwnProperty(voter.dcUser.id)){
            this._votes[voter.dcUser.id] = user.dcUser.id;
            if(this._private){
                constants.privateSelfDestructingMessage(voter, "Du hast dich für **" + user.dcUser.displayName + "** umentschieden!", 0);
                this._voteMessages[voter.dcUser.id].edit(voter.dcUser.displayName + " hat sich umentschieden.");
            } else {
                this._voteMessages[voter.dcUser.id].edit(voter.dcUser.displayName + " hat sich für **" + user.dcUser.displayName + "** umentschieden.");
            }
            return;
        }

        //ADDING VOTE
        this._votes[voter.dcUser.id] = user.dcUser.id;
        let message;
        if(this._private){
            constants.privateSelfDestructingMessage(voter, "Du hast dich für **" + user.dcUser.displayName + "** entschieden!", 0);
            this._channel.send(voter.dcUser.displayName + " hat abgestimmt!").then(msg => {
                message = msg;
                this._voteMessages[voter.dcUser.id] = message;
                delete(this._notVoted[voter.dcUser.id]);
                this.updateVotedList();
            });
        } else {
            this._channel.send(voter.dcUser.displayName + " hat für **" + user.dcUser.displayName + "** abgestimmt!").then(msg => {
                message = msg;
                this._voteMessages[voter.dcUser.id] = message;
            });
        }

    }

    //ACCUSE
    accuse(username: string, accuser: User) {

        if(this.pollPhase != PollPhase.accuse){
            return;
        }

        if(!this._game.getAlive().hasOwnProperty(accuser.dcUser.id)){
            return;
        }

        //Remove Accuse
        if(username.startsWith("-")){
            if(this._accused.hasOwnProperty(accuser.dcUser.id)){
                let user = this._game.getUser(this._accused[accuser.dcUser.id]);
                this._userMessages[user.dcUser.id].delete();
                delete(this._accused[accuser.dcUser.id]);
                delete(this._userMessages[user.dcUser.id]);
            } else {
                constants.selfDestructingMessage(this._channel, "Du hast keinen Nutzer angeklagt!")
            }
            return;
        }

        //ADD ACCUSE
        let user = constants.stringToUser(username, this._game);
        if(user == null){
            constants.selfDestructingMessage(this._channel, "Nutzer **" + username + "** nicht gefunden!");
            return;
        }

        if(!user.alive) {
            constants.selfDestructingMessage(this._channel, "Nutzer **" + username + "** ist Tod :(!");
            return;
        }

        if(this._userMessages.hasOwnProperty(user.dcUser.id)){
            constants.selfDestructingMessage(this._channel, username + " ist bereits angeklagt!");
            return;
        }

        //CHANGING ACCUSE
        if(this._accused.hasOwnProperty(accuser.dcUser.id)){
            this._userMessages[this._accused[accuser.dcUser.id]].edit(accuser.dcUser.displayName + " hat stattdessen **" + user.dcUser.displayName + "** angeklagt!");
            this._userMessages[user.dcUser.id] = this._userMessages[this._accused[accuser.dcUser.id]];
            delete(this._userMessages[this._accused[accuser.dcUser.id]]);
            this._accused[accuser.dcUser.id] = user.dcUser.id;
            return;
        }

        //ADDING ACCUSE
        this._accused[accuser.dcUser.id] = user.dcUser.id;
        let message;
        this._channel.send(accuser.dcUser.displayName + " hat **" + user.dcUser.displayName + "** angeklagt!").then(msg => {
            message = msg;
            this._userMessages[user.dcUser.id] = message;
        });
    }
}