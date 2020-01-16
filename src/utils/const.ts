"use strict";
import Discord = require("discord.js");
import { Game } from "../game/game";
import stringSimilarity = require('string-similarity');

export module constants {
    export function leaderRole(guild: Discord.Guild, id: number){
        return guild.roles.find(role => role.name === "Spielleiter #" + id)
    }
    export function deadRole(guild: Discord.Guild, id: number){
        return guild.roles.find(role => role.name === "Tod #" + id)
    }
    export function aliveRole(guild: Discord.Guild, id: number){
        return guild.roles.find(role => role.name === "Lebendig #" + id)
    }
    export function mayorRole(guild: Discord.Guild, id: number){
        return guild.roles.find(role => role.name === "Bürgermeister #" + id)
    }

    export function stringToUser(string: string, game: Game){

        let users = [];

        for(var u in game.users) {
            let user = game.users[u];
            let username = user.dcUser.displayName;
            users.push(username);
        }

        var matches = stringSimilarity.findBestMatch(string, users);

        for(var u in game.users) {
            let user = game.users[u];
            if(user.dcUser.displayName == matches.bestMatch.target) {
                return user;
            }
        }

        return null;
    }
}