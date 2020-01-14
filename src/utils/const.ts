"use strict";
import Discord = require("discord.js");

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
}