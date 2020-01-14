"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User = /** @class */ (function () {
    function User(dcUser, isLeader) {
        this._dcUser = dcUser;
        this._isLeader = isLeader;
    }
    Object.defineProperty(User.prototype, "dcUser", {
        get: function () {
            return this._dcUser;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "isLeader", {
        get: function () {
            return this._isLeader;
        },
        set: function (value) {
            this._isLeader = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "alive", {
        get: function () {
            return this._alive;
        },
        set: function (value) {
            this._alive = value;
            //Set User Class
            if (value) {
                this._dcUser.addRole("LEBENDIG");
                this._dcUser.removeRole("TOT");
            }
            else {
                this._dcUser.addRole("TOT");
                this._dcUser.removeRole("LEBENDIG");
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "role", {
        get: function () {
            return this._role;
        },
        set: function (value) {
            this._role = value;
        },
        enumerable: true,
        configurable: true
    });
    return User;
}());
exports.User = User;
//# sourceMappingURL=user.js.map