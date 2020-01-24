import Discord = require("discord.js");

export abstract class Command {

    private _name: string;
    private _description: string;
    private _help: string;

    constructor(name: string, description: string, help: string = "") {
        this._name = name;
        this._description = description;
        this._help = help;
    }

    abstract execute(dcMessage: Discord.Message) : void;


    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get help(): string {
        return this._help;
    }

    set help(string: string) {
        this._help = string;
    }
}