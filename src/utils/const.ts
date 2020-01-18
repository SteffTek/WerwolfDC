"use strict";
import Discord = require("discord.js");
import { Game } from "../game/game";
import { User } from "../game/user";
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

        if(string == null){
            return null;
        }

        let users = [];

        for(let u in game.users) {
            let user = game.users[u];
            let username = user.dcUser.displayName;
            users.push(username);
        }

        let matches = stringSimilarity.findBestMatch(string, users);

        for(let u in game.users) {
            let user = game.users[u];
            if(user.dcUser.displayName == matches.bestMatch.target) {
                if(matches.bestMatch.rating >= 0.1){
                    return user;
                }
            }
        }

        return null;
    }

    export function stringToGuildMember(string: string, guild: Discord.Guild) {

        if(string == null){
            return null;
        }

        let users = [];
        guild.members.forEach(member => {
            users.push(member.displayName);
        });

        let matches = stringSimilarity.findBestMatch(string, users);

        let dcMember = null;

        guild.members.forEach(member => {
            if(member.displayName == matches.bestMatch.target) {
                if(matches.bestMatch.rating >= 0.1) {
                    dcMember = member;
                }
            }
        });

        return dcMember;
    }

    export function selfDestructingMessage(channel: Discord.TextChannel, string: string, time: number = 3000) {
        let message;
        channel.send(string).then(msg => {
            message = msg;

            if(time > 0)
                message.delete(time);
        });
    }

    export function privateSelfDestructingMessage(user: User, string: string, time: number = 3000) {
        let message;
        user.dcUser.send(string).then(msg => {
            message = msg;
            
            if(time > 0)
                message.delete(time);
        });
    }
}