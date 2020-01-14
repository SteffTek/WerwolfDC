import Discord = require("discord.js");
import {Game} from "./game";

export class User {

    private _dcUser: Discord.GuildMember;
    private _alive: boolean;
    private _role: string = "";
    private _isLeader: boolean;
    private _game: Game;

    constructor(dcUser: Discord.GuildMember, game: Game, isLeader: boolean) {
        this._dcUser = dcUser;
        this._isLeader = isLeader;
        this._game = game;
    }

    get dcUser(): Discord.GuildMember {
        return this._dcUser;
    }

    get isLeader(): boolean {
        return this._isLeader;
    }

    set isLeader(value: boolean) {
        this._isLeader = value;
    }

    get alive(): boolean {
        return this._alive;
    }

    set alive(value: boolean) {
        this._alive = value;

        //Set User Class
        if(value) {
            this._dcUser.addRole("LEBENDIG");
            this._dcUser.removeRole("TOT");
        } else {
            this._dcUser.addRole("TOT");
            this._dcUser.removeRole("LEBENDIG");
        }
    }

    get role(): string {
        return this._role;
    }

    set role(value: string) {
        this._role = value;
    }
}
