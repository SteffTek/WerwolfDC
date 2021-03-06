//Req

// Utils
import {DiscordHandler} from "./src/events/discordHandler";
import Discord = require("discord.js");
import conf = require("./src/utils/config");
import {GuildGameManager} from "./src/server/guild";
import {CommandManager} from "./src/commands/commandManager";
import {Command} from "./src/commands/command";

export class MainIndex {
    // APP INFO
    private _appname;
    private _version;
    private _devname;

    //Vars
    private _discordHandler;
    private _guildGameManager: Array<GuildGameManager>;
    private static _instance;
    private _commandManager: CommandManager;
    private _discordClient: Discord.Client;

    constructor() {
        MainIndex._instance = this;
        this._version = conf.getVersion();
        this._appname = conf.getName();
        this._devname = conf.getAuthor();
        this._discordClient = new Discord.Client();
        this._commandManager = new CommandManager();
        this._guildGameManager = new Array<GuildGameManager>();
        this._discordHandler = new DiscordHandler();
    }


    get version() {
        return this._version;
    }

    get appname() {
        return this._appname;
    }

    get devname() {
        return this._devname;
    }

    get discordHandler() {
        return this._discordHandler;
    }

    get discordClient(): Discord.Client {
        return this._discordClient;
    }

    get guildGameManager(): Array<GuildGameManager> {
        return this._guildGameManager;
    }

    guildGameManagerByGuild(guild: Discord.Guild){
        for(let g in this.guildGameManager){
            let ggm = this.guildGameManager[g];
            if(ggm.guild.id == guild.id){
                return ggm;
            }
        }
        return null;
    }

    static get instance() {
        return this._instance;
    }

    get commandManager(): CommandManager {
        return this._commandManager;
    }

//Discord Bot ist logged in
}

new MainIndex();