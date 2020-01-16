//Req

// Utils
import {DiscordHandler} from "./src/events/listener";
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
        this._version = conf.getVersion();
        this._appname = conf.getName();
        this._devname = conf.getAuthor();
        this._discordHandler = new DiscordHandler();
        this._guildGameManager = new Array<GuildGameManager>();
        this._commandManager = new CommandManager();
        this._discordClient = new Discord.Client();

        MainIndex._instance = this;
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

    static get instance() {
        return this._instance;
    }

    get commandManager(): CommandManager {
        return this._commandManager;
    }

//Discord Bot ist logged in
}