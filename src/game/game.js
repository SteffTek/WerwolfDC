"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Game = /** @class */ (function () {
    function Game(id, guild, emoji, leader) {
        this.userChannelMap = new Map();
        this.guild = guild;
        this.emoji = emoji;
        this.leader = leader;
        this.create();
    }
    //Create Ranks and Channels
    Game.prototype.create = function () {
    };
    Game.prototype.close = function () {
    };
    /*
        get getUser() {
    
        }*/
    Game.prototype.kickUser = function () {
    };
    Game.prototype.addUser = function () {
    };
    Object.defineProperty(Game.prototype, "setRoles", {
        /*
            get getRoles() {
        
            }*/
        set: function (roles) {
        },
        enumerable: true,
        configurable: true
    });
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=game.js.map