"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants;
(function (constants) {
    function leaderRole(guild, id) {
        return guild.roles.find(function (role) { return role.name === "Spielleiter #" + id; });
    }
    constants.leaderRole = leaderRole;
    function deadRole(guild, id) {
        return guild.roles.find(function (role) { return role.name === "Tod #" + id; });
    }
    constants.deadRole = deadRole;
    function aliveRole(guild, id) {
        return guild.roles.find(function (role) { return role.name === "Lebendig #" + id; });
    }
    constants.aliveRole = aliveRole;
})(constants = exports.constants || (exports.constants = {}));
//# sourceMappingURL=const.js.map