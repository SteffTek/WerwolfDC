import Discord = require("discord.js");

export class Command{

    private _name: string;
    private _description: string;

    constructor(name: string, description: string) {
        this._name = name;
        this._description = description;
    }

    execute(dcMessage: Discord.Message){}


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
}