import {logger} from "../utils/logger";
import {GuildGameManager} from "../server/guild";
import {Game, GamePhase} from "../game/game";
import {MainIndex} from "../../index";
import conf = require("../utils/config");

export class DiscordHandler {

    isReady: boolean;

    constructor() {
        this.isReady = false;

        MainIndex.instance.discordClient.on('ready', () => {
            logger.info(`Logged in as ${MainIndex.instance.discordClient.user.tag}!`);

            this.isReady = true;

            //Get Every Server
            MainIndex.instance.discordClient.guilds.forEach((value => {
                MainIndex.instance.guildGameManager.push(new GuildGameManager(value));
            }))

            MainIndex.instance.discordClient.user.setActivity(conf.getConfig().prefix + "help | Server: " + MainIndex.instance.discordClient.guilds.size, { type: 'PLAYING' });

            logger.info("Server loaded!");
        });

        //REACTION HANDLER
        MainIndex.instance.discordClient.on('messageReactionAdd', (reaction, user) => {

            if(user == MainIndex.instance.discordClient.user)
                return;

            if(reaction.message.channel.type != "text")
                return;

            let isMainChannel = false;

            if(reaction.message.guild.channels.get(reaction.message.channel.id).name == conf.getConfig().mainChannel){
                isMainChannel = true;
            }

            let guild = reaction.message.guild;
            let guildGameManager = MainIndex.instance.guildGameManagerByGuild(guild);
            let game: Game;
            let gameStatus;

            if(isMainChannel) {
                for(let ga in guildGameManager.games) {
                    if(reaction.message.id == guildGameManager.games[ga].createMessage.id) {
                        game = guildGameManager.games[ga];
                        break;
                    }
                }

                if(game == null) {
                    return;
                }

                if(game.leader.dcUser.id != user.id)
                    game.addUser(reaction.message.guild.members.get(user.id));
            } else {
                //IF NOT
                for (let g in guildGameManager.games) {
                    //GET GAME
                    let gm = guildGameManager.games[g];
                    gameStatus = gm.checkIfReactionFromGame(reaction);
                    if(gameStatus != "") {
                        game = gm;
                        break;
                    }
                }

                if(gameStatus == "" || gameStatus == null) {
                    return;
                }

                //GAME GOTTEN
                if(gameStatus == "poll") {
                    for(let p in game.polls){
                        let poll = game.polls[p];

                        if(poll.channel.id == reaction.message.channel.id) {

                            poll.handleReaction(reaction, user);
                            return;
                        }
                    }
                } else if(gameStatus == "game") {
                    game.handleReaction(reaction, user);
                }
            }
        });

        MainIndex.instance.discordClient.on('messageReactionRemove', (reaction, user) => {

            if(user == MainIndex.instance.discordClient.user)
                return;

            if(reaction.message.channel.type != "text")
                return;

            let isMainChannel = false;

            if(reaction.message.guild.channels.get(reaction.message.channel.id).name == conf.getConfig().mainChannel){
                isMainChannel = true;
            }

            let guild = reaction.message.guild;
            let guildGameManager = MainIndex.instance.guildGameManagerByGuild(guild);
            let game;

            if(isMainChannel) {
                for(let ga in guildGameManager.games) {
                    if(reaction.message.id == guildGameManager.games[ga].createMessage.id) {
                        game = guildGameManager.games[ga];
                        break;
                    }
                }

                if(game == null) {
                    return;
                }

                if(game.gamePhase != GamePhase.created){
                    return;
                }

                if(game.leader.dcUser.id != user.id)
                    game.kickUser(reaction.message.guild.members.get(user.id));
            }
        });

        //MESSAGE HANDLER
        MainIndex.instance.discordClient.on('message', msg => {
            if (msg.author === MainIndex.instance.discordClient.user)
                return;

            //this._guilds[0].createGame(emo[0], msg.member);

            if(msg.content.startsWith(conf.getConfig().prefix)) {
                MainIndex.instance.commandManager.handleMessage(msg);
                return;
            }

            //CHECK IF IN POLL
            for(let gu in MainIndex.instance.guildGameManager) {
                let guild = MainIndex.instance.guildGameManager[gu];

                let game: Game;

                for (let g in guild.games) {
                    //GET GAME
                    let gm = guild.games[g];
                    for(let u in gm.users) {
                        let usr = gm.users[u];
                        if(usr.dcUser.id == msg.author.id) {
                            game = gm;
                        }
                    }
                }

                if(game == null) {
                    continue;
                }

                for(let p in game.polls) {
                    let poll = game.polls[p];

                    if(poll.channel.id == msg.channel.id) {
                        poll.handleMessage(msg);
                    //PRIVAT CHAT
                    } else if(msg.guild == null){
                        if(poll.channel.id == game.userChannelMap.get("Abstimmungen").id){
                            poll.handleMessage(msg);
                        }
                    }
                }
            }
        });

        //BOT JOIN SERVER HANDLER
        MainIndex.instance.discordClient.on("guildCreate", guild => {
            let gm: GuildGameManager = new GuildGameManager(guild);
            MainIndex.instance.guildGameManager.push(gm);
            gm.setup();
        });

        MainIndex.instance.discordClient.login(conf.getConfig().token);

    }
}