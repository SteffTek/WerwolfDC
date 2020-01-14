import Discord = require("discord.js");
import {Game} from "./game";
import {constants} from "../utils/const";

export class User {

    private _dcUser: Discord.GuildMember;
    private _alive: boolean;
    private _role: string = "";
    private _isLeader: boolean;
    private _isMayor: boolean;
    private _game: Game;

    constructor(dcUser: Discord.GuildMember, game: Game, isLeader: boolean) {
        this._dcUser = dcUser;
        this._game = game;

        this.isLeader = isLeader;
    }

    get dcUser(): Discord.GuildMember {
        return this._dcUser;
    }

    get isLeader(): boolean {
        return this._isLeader;
    }

    set isLeader(value: boolean) {
        this._isLeader = value;

        if(value) {
            this._dcUser.addRole(constants.leaderRole(this._game.guild, this._game.id));
        } else {
            this._dcUser.removeRole(constants.leaderRole(this._game.guild, this._game.id));
        }
    }

    get isMayor(): boolean {
        return this._isMayor;
    }

    set isMayor(value: boolean) {
        this._isMayor = value;

        if(value) {
            this._dcUser.addRole(constants.mayorRole(this._game.guild, this._game.id));
        } else {
            this._dcUser.removeRole(constants.mayorRole(this._game.guild, this._game.id));
        }
    }

    get alive(): boolean {
        return this._alive;
    }

    set alive(value: boolean) {
        this._alive = value;

        //Set User Class
        if(value) {
            this._dcUser.addRole(constants.aliveRole(this._game.guild, this._game.id));
            this._dcUser.removeRole(constants.deadRole(this._game.guild, this._game.id));
        } else {
            this._dcUser.addRole(constants.deadRole(this._game.guild, this._game.id));
            this._dcUser.removeRole(constants.aliveRole(this._game.guild, this._game.id));
        }
    }

    get role(): string {
        return this._role;
    }

    set role(value: string) {
        this._role = value;
    }

    reset(){
        this._dcUser.removeRole(constants.deadRole(this._game.guild, this._game.id));
        this._dcUser.removeRole(constants.aliveRole(this._game.guild, this._game.id));
        this._dcUser.removeRole(constants.leaderRole(this._game.guild, this._game.id));
    }
}
