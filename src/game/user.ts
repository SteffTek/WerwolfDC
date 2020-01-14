import Discord = require("discord.js");

export class User {

    private _dcUser: Discord.User;
    private _alive: boolean;
    private _role: string;


    constructor(dcUser: Discord.User) {
        this._dcUser = dcUser;
    }

    get dcUser(): Discord.User {
        return this._dcUser;
    }

    get alive(): boolean {
        return this._alive;
    }

    set alive(value: boolean) {
        this._alive = value;
    }

    get role(): string {
        return this._role;
    }

    set role(value: string) {
        this._role = value;
    }
}
