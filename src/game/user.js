"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User = /** @class */ (function () {
    function User(dcUser) {
        this._dcUser = dcUser;
    }
    Object.defineProperty(User.prototype, "dcUser", {
        get: function () {
            return this._dcUser;
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